const { ipcRenderer } = require('electron');

const dragDropArea = document.getElementById('drag-drop-area');
const fileInputHidden = document.getElementById('file-input-hidden');
const browseFilesButton = document.getElementById('browse-files-button');
const fileListElement = document.getElementById('file-list');
const downloadSelectedButton = document.getElementById('download-selected-button');
const clearListButton = document.getElementById('clear-list-button');
const overallProgressBar = document.getElementById('overall-progress-bar');
const statusMessage = document.getElementById('status-message');

let filesToProcess = []; // Stores { fileObject: File, id: string, status: 'pending' | 'downloading' | 'completed' | 'error', progress: 0, localPath: null, url: 'user-provided-url-or-placeholder' }
let nextFileId = 0;

// --- Drag and Drop --- //
dragDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDropArea.classList.add('drag-over');
});

dragDropArea.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDropArea.classList.remove('drag-over');
});

dragDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDropArea.classList.remove('drag-over');
    const droppedFiles = Array.from(event.dataTransfer.files);
    addFilesToList(droppedFiles);
});

// --- File Browsing --- //
browseFilesButton.addEventListener('click', () => {
    fileInputHidden.click();
});

fileInputHidden.addEventListener('change', (event) => {
    const selectedFiles = Array.from(event.target.files);
    addFilesToList(selectedFiles);
    fileInputHidden.value = ''; // Reset for next selection
});

function addFilesToList(newFiles) {
    newFiles.forEach(file => {
        // For this example, we'll assume the user will provide URLs later or they are not needed for local processing.
        // In a real download manager, you'd need a way to associate URLs with these files.
        const fileEntry = {
            fileObject: file, // The actual File object
            id: `file-${nextFileId++}`,
            name: file.name,
            status: 'pending', // Initial status
            progress: 0,
            localPath: null, // Will be set by main process after download
            url: prompt(`请输入文件 "${file.name}" 的下载URL (如果需要下载):`, 'https://example.com/placeholder.zip') || '' // Placeholder for URL
        };
        filesToProcess.push(fileEntry);
    });
    renderFileList();
    updateDownloadButtonState();
}

function renderFileList() {
    fileListElement.innerHTML = ''; // Clear existing list
    if (filesToProcess.length === 0) {
        const li = document.createElement('li');
        li.textContent = '没有文件。请拖拽或选择文件。';
        li.style.textAlign = 'center';
        li.style.color = '#777';
        fileListElement.appendChild(li);
        clearListButton.style.display = 'none';
        return;
    }

    clearListButton.style.display = 'inline-block';
    filesToProcess.forEach(fileEntry => {
        const li = document.createElement('li');
        li.setAttribute('data-id', fileEntry.id);
        li.classList.add(fileEntry.status);
        if (fileEntry.selected) {
            li.classList.add('selected');
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'file-name';
        nameSpan.textContent = fileEntry.name;
        nameSpan.title = fileEntry.name;

        const statusSpan = document.createElement('span');
        statusSpan.className = 'file-status';
        statusSpan.classList.add(fileEntry.status);
        statusSpan.textContent = getStatusText(fileEntry);

        li.appendChild(nameSpan);
        li.appendChild(statusSpan);

        // Allow selection by clicking
        li.addEventListener('click', () => toggleFileSelection(fileEntry.id));

        fileListElement.appendChild(li);
    });
}

function getStatusText(fileEntry) {
    switch (fileEntry.status) {
        case 'pending': return '待处理';
        case 'downloading': return `${fileEntry.progress.toFixed(1)}%`;
        case 'completed': return '完成';
        case 'error': return '错误';
        default: return '';
    }
}

function toggleFileSelection(fileId) {
    const fileEntry = filesToProcess.find(f => f.id === fileId);
    if (fileEntry) {
        fileEntry.selected = !fileEntry.selected;
    }
    renderFileList();
    updateDownloadButtonState();
}

function updateDownloadButtonState() {
    const anySelected = filesToProcess.some(f => f.selected && f.status === 'pending');
    downloadSelectedButton.disabled = !anySelected;
}

clearListButton.addEventListener('click', () => {
    filesToProcess = [];
    nextFileId = 0;
    renderFileList();
    updateDownloadButtonState();
    overallProgressBar.style.width = '0%';
    overallProgressBar.textContent = '0%';
    statusMessage.textContent = '列表已清空。';
});

// --- IPC Communication --- //
downloadSelectedButton.addEventListener('click', () => {
    const selectedFilesForDownload = filesToProcess.filter(f => f.selected && f.status === 'pending');
    if (selectedFilesForDownload.length > 0) {
        // We need to send serializable data, not full File objects if they are large or complex.
        // For downloads, we primarily need the URL and a way to identify the file back.
        const filesPayload = selectedFilesForDownload.map(f => ({
            id: f.id,
            name: f.name,
            url: f.url // Make sure URL is set for each file
        }));

        if (filesPayload.some(f => !f.url)) {
            statusMessage.textContent = '错误：部分选中文件缺少下载URL。';
            alert('部分选中文件缺少下载URL。请确保所有待下载文件都有URL。');
            return;
        }

        ipcRenderer.send('download-files', filesPayload);
        statusMessage.textContent = '开始下载选中的文件...';
        downloadSelectedButton.disabled = true;
    }
});

ipcRenderer.on('download-progress', (event, { id, progress, name }) => {
    const fileEntry = filesToProcess.find(f => f.id === id);
    if (fileEntry) {
        fileEntry.status = 'downloading';
        fileEntry.progress = progress;
        renderFileList(); // Re-render to update status and progress text
    }
    updateOverallProgress();
});

ipcRenderer.on('download-complete', (event, { id, localPath, name }) => {
    const fileEntry = filesToProcess.find(f => f.id === id);
    if (fileEntry) {
        fileEntry.status = 'completed';
        fileEntry.progress = 100;
        fileEntry.localPath = localPath;
        fileEntry.selected = false; // Deselect after completion
        renderFileList();
    }
    statusMessage.textContent = `文件 "${name}" 下载完成。`;
    updateOverallProgress();
    updateDownloadButtonState(); // Re-enable if other pending files are selected
});

ipcRenderer.on('download-error', (event, { id, error, name }) => {
    const fileEntry = filesToProcess.find(f => f.id === id);
    if (fileEntry) {
        fileEntry.status = 'error';
        fileEntry.selected = false; // Deselect on error
        renderFileList();
    }
    statusMessage.textContent = `下载 "${name}" 失败: ${error}`;
    updateOverallProgress();
    updateDownloadButtonState();
});

function updateOverallProgress() {
    const downloadingOrCompletedFiles = filesToProcess.filter(f => f.status === 'downloading' || f.status === 'completed' || f.status === 'error');
    if (downloadingOrCompletedFiles.length === 0) {
        overallProgressBar.style.width = '0%';
        overallProgressBar.textContent = '0%';
        return;
    }

    let totalProgress = 0;
    let filesConsideredForProgress = 0;

    filesToProcess.forEach(file => {
        // Only consider files that were attempted for download for overall progress
        if (file.status === 'downloading' || file.status === 'completed' || file.status === 'error') {
            filesConsideredForProgress++;
            if (file.status === 'completed') {
                totalProgress += 100;
            } else if (file.status === 'downloading') {
                totalProgress += file.progress;
            }
            // Errors contribute 0 to progress but are counted in filesConsideredForProgress
        }
    });

    const averageProgress = filesConsideredForProgress > 0 ? totalProgress / filesConsideredForProgress : 0;
    overallProgressBar.style.width = `${averageProgress.toFixed(1)}%`;
    overallProgressBar.textContent = `${averageProgress.toFixed(1)}%`;

    const allDone = filesToProcess.every(f => f.status === 'completed' || f.status === 'error' || f.status === 'pending'); // All attempted are done or were pending
    const anyDownloading = filesToProcess.some(f => f.status === 'downloading');
    if (allDone && !anyDownloading && filesConsideredForProgress > 0) {
        const successfulDownloads = filesToProcess.filter(f => f.status === 'completed').length;
        statusMessage.textContent = `所有选定下载任务处理完毕。成功: ${successfulDownloads}/${filesConsideredForProgress}。`;
    }
}

// Initial render
renderFileList();
updateDownloadButtonState();