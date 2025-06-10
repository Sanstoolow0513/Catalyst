import { ipcRenderer } from 'electron';

// UI元素
const startClashBtn = document.getElementById('start-clash-btn');
const stopClashBtn = document.getElementById('stop-clash-btn');
const refreshNodesBtn = document.getElementById('refresh-nodes-btn');
const nodeListElement = document.getElementById('node-list');
const clashStatusElement = document.getElementById('clash-status');

// 初始化UI状态
stopClashBtn.disabled = true;
refreshNodesBtn.disabled = true;

// 启动Clash
startClashBtn.addEventListener('click', async () => {
    try {
        const urls = await ipcRenderer.invoke('get-available-urls');
        if (urls.length === 0) {
            showClashStatus('没有可用的配置文件URL，请检查url.txt文件', 'error');
            return;
        }
        
        // 使用第一个URL（实际应用中可以让用户选择）
        ipcRenderer.send('start-clash', urls[0]);
    } catch (error) {
        showClashStatus(`启动失败: ${error.message}`, 'error');
    }
});

// 停止Clash
stopClashBtn.addEventListener('click', () => {
    ipcRenderer.send('stop-clash');
});

// 刷新节点列表
refreshNodesBtn.addEventListener('click', () => {
    refreshNodeList();
});

// 监听Clash状态变化
ipcRenderer.on('clash-status-changed', (event, isRunning) => {
    startClashBtn.disabled = isRunning;
    stopClashBtn.disabled = !isRunning;
    refreshNodesBtn.disabled = !isRunning;
    
    if (!isRunning) {
        clearNodeList();
    }
});

ipcRenderer.on('clash-message', (event, message) => {
    showClashStatus(message, 'info');
});

// 显示Clash状态
function showClashStatus(message, type) {
    clashStatusElement.innerHTML = `
        <div class="status-message ${type}">${message}</div>
    `;
}

// 刷新节点列表
async function refreshNodeList() {
    try {
        const nodes = await ipcRenderer.invoke('get-node-list');
        if (nodes.length === 0) {
            nodeListElement.innerHTML = '<li>没有可用节点</li>';
            return;
        }
        
        nodeListElement.innerHTML = '';
        
        for (const node of nodes) {
            const li = document.createElement('li');
            li.className = 'node-item';
            li.innerHTML = `
                <span class="node-name">${node.name}</span>
                <span class="node-server">${node.server}</span>
                <span class="node-latency">测试中...</span>
                <button class="btn btn-primary switch-node-btn" data-node="${node.name}">切换</button>
            `;
            nodeListElement.appendChild(li);
            
            // 测试节点延迟
            testNodeLatency(node.name, li.querySelector('.node-latency'));
            
            // 添加切换节点事件
            li.querySelector('.switch-node-btn').addEventListener('click', async (e) => {
                const nodeName = e.target.dataset.node;
                const result = await ipcRenderer.invoke('switch-node', nodeName);
                if (result.success) {
                    showClashStatus(result.message, 'success');
                } else {
                    showClashStatus(result.message, 'error');
                }
            });
        }
    } catch (error) {
        showClashStatus(`获取节点列表失败: ${error.message}`, 'error');
    }
}

// 测试节点延迟
async function testNodeLatency(nodeName, element) {
    try {
        const latency = await ipcRenderer.invoke('test-node-latency', nodeName);
        if (latency > 0) {
            element.textContent = `${latency}ms`;
            element.className = 'node-latency success';
        } else {
            element.textContent = '超时';
            element.className = 'node-latency error';
        }
    } catch (error) {
        element.textContent = '错误';
        element.className = 'node-latency error';
    }
}

// 清空节点列表
function clearNodeList() {
    nodeListElement.innerHTML = '<li>服务未启动</li>';
}