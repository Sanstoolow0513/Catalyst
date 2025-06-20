const { ipcRenderer } = require("electron");

console.log("[renderer.js] 脚本开始执行");

document.addEventListener("DOMContentLoaded", () => {
  console.log("[renderer.js] DOMContentLoaded 事件触发");
  document.getElementById("test-btn").addEventListener("click",()=>{
    ipcRenderer.send("hello-from-renderer","你好主进程");
  });
  const logContainer = document.getElementById("clash-status");
  const startBtn = document.getElementById("start-clash-btn");
  const stopBtn = document.getElementById("stop-clash-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      console.log("[renderer.js] '启动Clash' 按钮点击，发送 'start-clash' 事件");
      if (logContainer) {
        logContainer.innerHTML = ""; // 启动前清空日志
      }
      ipcRenderer.send("start-clash");
      startBtn.disabled = true;
      if (stopBtn) {
        stopBtn.disabled = false;
      }
    });
  } else {
    console.error("[renderer.js] 未找到 #start-clash-btn 元素");
  }

  if (stopBtn) {
    stopBtn.addEventListener("click", () => {
      console.log("[renderer.js] '停止Clash' 按钮点击，发送 'stop-clash' 事件");
      ipcRenderer.send("stop-clash");
      stopBtn.disabled = true;
      if (startBtn) {
        startBtn.disabled = false;
      }
    });
  } else {
    console.error("[renderer.js] 未找到 #stop-clash-btn 元素");
  }


  // 日志输出
  ipcRenderer.on("clash-message", (event, msg) => {
    console.log("[renderer.js] 收到 clash-message:", msg);
    if (logContainer) {
      const p = document.createElement("p");
      p.textContent = msg;
      logContainer.appendChild(p);
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  });
  ipcRenderer.on("clash-error", (event, msg) => {
    console.log("[renderer.js] 收到 clash-error:", msg);
    if (logContainer) {
      const p = document.createElement("p");
      p.textContent = msg;
      p.style.color = "red";
      logContainer.appendChild(p);
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  });
  ipcRenderer.on("clash-log", (event, msg) => {
    console.log("[renderer.js] 收到 clash-log:", msg);
    if (logContainer) {
      const p = document.createElement("p");
      p.textContent = msg;
      p.style.color = "#888";
      logContainer.appendChild(p);
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  });
  ipcRenderer.on("hello-from-main",( arg)=>{
    alert("收到主进程：" , arg);
  })
});
