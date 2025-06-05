import { ipcRenderer } from 'electron';

// 系统信息元素
const systemInfoContainer = document.getElementById('system-info-container');
// 资源监控元素
const cpuProgress = document.getElementById('cpu-progress');
const memProgress = document.getElementById('mem-progress');
const gpuProgress = document.getElementById('gpu-progress');

// 更新系统信息
function updateSystemInfo(info) {
    systemInfoContainer.innerHTML = `
        <div class="info-item">
            <span class="info-label">操作系统:</span>
            <span class="info-value">${info.os}</span>
        </div>
        <div class="info-item">
            <span class="info-label">平台:</span>
            <span class="info-value">${info.platform}</span>
        </div>
        <div class="info-item">
            <span class="info-label">CPU:</span>
            <span class="info-value">${info.cpu} (${info.cores}核)</span>
        </div>
        <div class="info-item">
            <span class="info-label">GPU:</span>
            <span class="info-value">${info.gpu}</span>
        </div>
        <div class="info-item">
            <span class="info-label">内存:</span>
            <span class="info-value">${info.totalMem} GB</span>
        </div>
    `;
}

// 更新资源使用情况
function updateResourceUsage(usage) {
    cpuProgress.style.width = `${usage.cpu}%`;
    cpuProgress.textContent = `${usage.cpu.toFixed(1)}%`;
    
    memProgress.style.width = `${usage.mem}%`;
    memProgress.textContent = `${usage.mem.toFixed(1)}%`;
    
    gpuProgress.style.width = `${usage.gpu}%`;
    gpuProgress.textContent = `${usage.gpu.toFixed(1)}%`;
}

// 从主进程获取初始系统信息
ipcRenderer.invoke('get-system-info').then(updateSystemInfo);

// 设置资源监控定时器
setInterval(() => {
    ipcRenderer.invoke('get-resource-usage').then(updateResourceUsage);
}, 1000);

// 暴露函数给全局，供标签页切换使用
window.updateSystemInfo = updateSystemInfo;
window.updateResourceUsage = updateResourceUsage;