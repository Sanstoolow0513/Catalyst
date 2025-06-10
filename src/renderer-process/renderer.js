import { ipcRenderer } from "electron";

const logContainer = document.getElementById("clash-status");
const startBtn = document.getElementById("start-clash-btn");
const stopBtn = document.getElementById("stop-clash-btn");

startBtn.addEventListener("click", () => {
  logContainer.innerHTML = ""; // 启动前清空日志
  ipcRenderer.send("start-clash");
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
  ipcRenderer.send("stop-clash");
  stopBtn.disabled = true;
  startBtn.disabled = false;
});

// 日志输出
ipcRenderer.on("clash-message", (event, msg) => {
  const p = document.createElement("p");
  p.textContent = msg;
  logContainer.appendChild(p);
  logContainer.scrollTop = logContainer.scrollHeight;
});
ipcRenderer.on("clash-error", (event, msg) => {
  const p = document.createElement("p");
  p.textContent = msg;
  p.style.color = "red";
  logContainer.appendChild(p);
  logContainer.scrollTop = logContainer.scrollHeight;
});
ipcRenderer.on("clash-log", (event, msg) => {
  const p = document.createElement("p");
  p.textContent = msg;
  p.style.color = "#888";
  logContainer.appendChild(p);
  logContainer.scrollTop = logContainer.scrollHeight;
});
