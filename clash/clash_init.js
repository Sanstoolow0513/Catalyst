import path from "path";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile, mkdir } from "fs/promises";
import { spawn } from "child_process";

// filename and dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const urlPath = path.join(__dirname, "clash", "url.txt");
const configPath = path.join(__dirname, "clash", "config.yaml", "config.yaml");
const mihomoPath = path.join(__dirname, "clash", "mihomo.exe");

/**
 * ! 多引导并未实现
 * TODOS: 应该是引入的时候创建不同的config文件夹然后路径读取回调获得值，但是现在就这样
 */
const data = await readFile(urlPath, "utf-8");

const args = {
  "--url": data.trim(), // webserver_addr
  "--mihomoPath": mihomoPath, // mihomo_addr
  "--configPath": configPath, // yaml_addr
}

/**
 * ! 小心数据丢失和写入冲突
 * * fileimport: 需要手动指定clash引入目录
 * TODOS: 多指定链接和给定后台执行
 */
async function fetchConfig(args) {
  try {
    const response = await axios.get(args["--url"], { responseType: "text" });
    writeFile(args["--configPath"], response.data);
    console.log("配置文件已成功保存到", args["--configPath"]);
  } catch (error) {
    console.error("获取配置文件时发生错误:", error.message);
  }
}

/**
 * 启动mihomo进程实现
 * 
 */

fetchConfig(args);