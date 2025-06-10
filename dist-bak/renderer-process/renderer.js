/* 模块导入 */
// Electron IPC渲染进程模块
import { ipcRenderer } from 'electron';
/* DOM元素引用 */
// 拖拽区域元素
const dragDropArea = document.getElementById('drag-drop-area');
// 隐藏的文件输入元素
const fileInputHidden = document.getElementById('file-input-hidden');
// 浏览文件按钮
const browseFilesButton = document.getElementById('browse-files-button');
// 文件列表容器
const fileListElement = document.getElementById('file-list');
// 下载选中文件按钮
const downloadSelectedButton = document.getElementById('download-selected-button');
// 清空列表按钮
const clearListButton = document.getElementById('clear-list-button');
// 整体进度条元素
const overallProgressBar = document.getElementById('overall-progress-bar');
// 状态消息显示区域
const statusMessage = document.getElementById('status-message');
/* 文件处理队列 */
// 存储待处理文件对象 { fileObject: File, id: string, status: 'pending'|'downloading'|'completed'|'error', progress: 0, localPath: null, url: 'user-provided-url-or-placeholder' }
let filesToProcess = [];
// 下一个文件ID计数器
let nextFileId = 0;
/* --- 拖拽功能 --- */
// 拖拽悬停样式
dragDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDropArea.classList.add('drag-over');
});
// 拖拽离开样式
dragDropArea.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDropArea.classList.remove('drag-over');
});
// 文件投放处理
dragDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragDropArea.classList.remove('drag-over');
    // 获取投放的文件列表
    const droppedFiles = Array.from(event.dataTransfer.files);
    addFilesToList(droppedFiles);
});
/* --- 文件浏览功能 --- */
// 浏览文件按钮点击事件
browseFilesButton.addEventListener('click', () => {
    fileInputHidden.click();
});
// 文件选择变化事件
fileInputHidden.addEventListener('change', (event) => {
    // 获取选中文件列表
    const selectedFiles = Array.from(event.target.files);
    addFilesToList(selectedFiles);
    fileInputHidden.value = ''; // 重置文件输入框
});
/* 文件添加处理 */
function addFilesToList(newFiles) {
    newFiles.forEach(file => {
        // 创建文件条目对象
        const fileEntry = {
            fileObject: file,
            id: `file-${nextFileId++}`,
            name: file.name,
            status: 'pending',
            progress: 0,
            localPath: null,
            // 获取用户输入的下载URL
            url: prompt(`请输入文件 "${file.name}" 的下载URL (如果需要下载):`, 'https://example.com/placeholder.zip') || ''
        };
        // 添加到处理队列
        filesToProcess.push(fileEntry);
    });
    // 更新文件列表显示
    renderFileList();
    // 更新下载按钮状态
    updateDownloadButtonState();
}
/* 文件列表渲染 */
function renderFileList() {
    // 清空现有列表
    fileListElement.innerHTML = '';
    // 空列表处理
    if (filesToProcess.length === 0) {
        const li = document.createElement('li');
        li.textContent = '没有文件。请拖拽或选择文件。';
        li.style.textAlign = 'center';
        li.style.color = '#777';
        fileListElement.appendChild(li);
        clearListButton.style.display = 'none';
        return;
    }
    // 显示清空按钮
    clearListButton.style.display = 'inline-block';
    // 遍历文件队列
    filesToProcess.forEach(fileEntry => {
        // 创建列表项
        const li = document.createElement('li');
        li.setAttribute('data-id', fileEntry.id); // 设置数据ID属性
        li.classList.add(fileEntry.status); // 添加状态类
        // 处理选中状态
        if (fileEntry.selected) {
            li.classList.add('selected'); // 添加选中样式
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
/* 文件选择切换 */
function toggleFileSelection(fileId) {
    // 查找文件条目
    const fileEntry = filesToProcess.find(f => f.id === fileId);
    if (fileEntry) {
        // 反转选中状态
        fileEntry.selected = !fileEntry.selected;
    }
    // 重新渲染列表
    renderFileList();
    // 更新下载按钮状态
    updateDownloadButtonState();
}
/* 下载按钮状态更新 */
function updateDownloadButtonState() {
    // 检查是否有选中且待处理的文件
    const anySelected = filesToProcess.some(f => f.selected && f.status === 'pending');
    // 启用/禁用下载按钮
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
/* --- IPC通信模块 --- */
// 下载按钮点击事件
downloadSelectedButton.addEventListener('click', () => {
    // 获取选中的待下载文件
    const selectedFilesForDownload = filesToProcess.filter(f => f.selected && f.status === 'pending');
    if (selectedFilesForDownload.length > 0) {
        // 构建下载任务载荷
        const filesPayload = selectedFilesForDownload.map(f => ({
            id: f.id,
            name: f.name,
            url: f.url
        }));
        // URL验证检查
        if (filesPayload.some(f => !f.url)) {
            statusMessage.textContent = '错误：部分选中文件缺少下载URL。';
            alert('部分选中文件缺少下载URL。请确保所有待下载文件都有URL。');
            return;
        }
        // 发送下载请求
        ipcRenderer.send('download-files', filesPayload);
        // 更新状态提示
        statusMessage.textContent = '开始下载选中的文件...';
        // 禁用下载按钮
        downloadSelectedButton.disabled = true;
    }
});
// 下载进度更新监听
ipcRenderer.on('download-progress', (event, { id, progress, name }) => {
    // 查找对应文件条目
    const fileEntry = filesToProcess.find(f => f.id === id);
    if (fileEntry) {
        // 更新下载状态
        fileEntry.status = 'downloading';
        // 更新下载进度
        fileEntry.progress = progress;
        // 重新渲染列表
        renderFileList();
    }
    // 更新整体进度
    updateOverallProgress();
});
// 下载完成事件处理
ipcRenderer.on('download-complete', (event, { id, localPath, name }) => {
    // 查找已完成的文件
    const fileEntry = filesToProcess.find(f => f.id === id);
    if (fileEntry) {
        // 更新完成状态
        fileEntry.status = 'completed';
        fileEntry.progress = 100; // 进度100%
        fileEntry.localPath = localPath; // 保存本地路径
        fileEntry.selected = false; // 取消选中
        renderFileList(); // 重新渲染列表
    }
    // 显示完成提示
    statusMessage.textContent = `文件 "${name}" 下载完成。`;
    // 更新整体进度
    updateOverallProgress();
    // 更新下载按钮状态
    updateDownloadButtonState();
});
// 下载错误事件处理
ipcRenderer.on('download-error', (event, { id, error, name }) => {
    // 查找错误文件条目
    const fileEntry = filesToProcess.find(f => f.id === id);
    if (fileEntry) {
        // 更新错误状态
        fileEntry.status = 'error';
        fileEntry.selected = false; // 取消选中
        renderFileList(); // 重新渲染列表
    }
    // 显示错误信息
    statusMessage.textContent = `下载 "${name}" 失败: ${error}`;
    // 更新整体进度
    updateOverallProgress();
    // 更新下载按钮状态
    updateDownloadButtonState();
});
/* 开发工具安装功能 */
// 绑定安装按钮事件
document.querySelectorAll('.install-btn[data-tool]').forEach(button => {
    button.addEventListener('click', (e) => {
        // 获取工具名称
        const tool = e.target.dataset.tool;
        // 发送安装请求
        ipcRenderer.send('install-dev-tool', tool);
        // 禁用按钮
        e.target.disabled = true;
        // 更新按钮文本
        e.target.textContent = '安装中...';
    });
});
/* IDE安装功能 */
// 绑定IDE安装事件
document.querySelectorAll('.install-btn[data-ide]').forEach(button => {
    button.addEventListener('click', (e) => {
        // 获取IDE名称
        const ide = e.target.dataset.ide;
        // 发送安装请求
        ipcRenderer.send('install-ide', ide);
        // 禁用安装按钮
        e.target.disabled = true;
        // 更新按钮状态
        e.target.textContent = '安装中...';
    });
});
/* 安装状态监听 */
// 监听安装状态更新
ipcRenderer.on('install-status', (event, { type, name, status, message }) => {
    let button;
    // 查找对应按钮
    if (type === 'tool') {
        button = document.querySelector(`.install-btn[data-tool="${name}"]`);
    }
    else if (type === 'ide') {
        button = document.querySelector(`.install-btn[data-ide="${name}"]`);
    }
    if (button) {
        // 更新按钮状态
        if (status === 'success') {
            button.textContent = '已安装'; // 成功状态
            button.classList.add('btn-success'); // 添加成功样式
        }
        else {
            button.textContent = '安装失败'; // 失败状态
            button.classList.add('btn-error'); // 添加错误样式
            // 记录错误日志
            console.error(`安装${name}失败: ${message}`);
        }
    }
});
/* 整体进度更新 */
function updateOverallProgress() {
    // 获取下载中/已完成/错误文件
    const downloadingOrCompletedFiles = filesToProcess.filter(f => f.status === 'downloading' ||
        f.status === 'completed' ||
        f.status === 'error');
    if (downloadingOrCompletedFiles.length === 0) {
        // 无下载任务时重置进度条
        overallProgressBar.style.width = '0%';
        overallProgressBar.textContent = '0%';
        return;
    }
    let totalProgress = 0;
    let filesConsideredForProgress = 0;
    // 遍历所有文件
    filesToProcess.forEach(file => {
        // 仅统计下载中/已完成/错误的文件
        if (file.status === 'downloading' ||
            file.status === 'completed' ||
            file.status === 'error') {
            filesConsideredForProgress++;
            // 累加进度值
            if (file.status === 'completed') {
                totalProgress += 100; // 完成文件加100%
            }
            else if (file.status === 'downloading') {
                totalProgress += file.progress; // 累加当前进度
            }
            // 错误文件不贡献进度
        }
    });
    // 计算平均进度
    const averageProgress = filesConsideredForProgress > 0 ? totalProgress / filesConsideredForProgress : 0;
    // 更新进度条宽度
    overallProgressBar.style.width = `${averageProgress.toFixed(1)}%`;
    // 显示进度百分比
    overallProgressBar.textContent = `${averageProgress.toFixed(1)}%`;
    // 检查所有任务是否完成
    const allDone = filesToProcess.every(f => f.status === 'completed' ||
        f.status === 'error' ||
        f.status === 'pending');
    // 检查是否有下载进行中
    const anyDownloading = filesToProcess.some(f => f.status === 'downloading');
    // 显示最终统计信息
    if (allDone && !anyDownloading && filesConsideredForProgress > 0) {
        const successfulDownloads = filesToProcess.filter(f => f.status === 'completed').length;
        statusMessage.textContent = `所有选定下载任务处理完毕。成功: ${successfulDownloads}/${filesConsideredForProgress}。`;
    }
}
// Initial render
renderFileList();
updateDownloadButtonState();
//# sourceMappingURL=renderer.js.map