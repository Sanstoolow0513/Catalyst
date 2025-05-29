const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs").promises;
const axios = require("axios");
const https = require("https");

const urlPath  = path.join(__dirname, "clash", "keys.txt");
const clashPath = path.join(__dirname, "clash", "clash-win64.exe");
const configPath = path.join(__dirname, "clash", "config", "config.yaml");

//fs
const url = await fs.readFile(urlPath, "utf-8").trim();
//args
args = {
  "--url": url, // webserver_addr
  "--clashPath": clashPath, // mihomo_addr
  "--configPath": configPath, // yaml_addr
};

/**
 * ! 小心数据丢失和写入冲突
 * * fileimport: 需要手动指定clash引入目录
 * todo : 多指定链接和给定后台执行
 */
async function fetchConfig(args) {
  try {
    const response = await axios.get(args["--url"], { responseType: "text" });
    fs.writeFileSync(args["--configPath"], response.data);
    console.log("配置文件已成功保存到", args["--configPath"]);
  } catch (error) {
    console.error("获取配置文件时发生错误:", error.message);
  }
  // axios未封装
  // axios
  //   .get(config_keys, { responseType: "text" })
  //   .then((response) => {
  //     fs.writeFile(configPath, response.data, (error) => {
  //       if (error) {
  //         console.error("fs_error", error.message);
  //         return;
  //       }
  //       console.log("fs_write_success");
  //     });
  //   })
  //   .catch((error) => {
  //     console.error("axios_error", error.message);
  //   });
  // https未封装
  // https.get(config_keys, (res) => {
  //   let data = "";
  //   res.on("data", (EncodedAudioChunk) => {
  //     data += EncodedAudioChunk;
  //   });
  //   console.log(`正在获取配置文件...`);
  //   res
  //     .on("end", () => {
  //       fs.writeFile(configPath, data, (error) => {
  //         if (error) {
  //           console.error(`写入配置文件时发生错误: ${error.message}`);
  //           return;
  //         }
  //         console.log(`配置文件已成功保存到 ${configPath}`);
  //       });
  //     })
  //     .on("error", (error) => {
  //       console.error(`获取配置文件时发生错误: ${error.message}`);
  //     });
  // });
}

let clashProcess = null;

function startClash() {
  clashProcess = spawn(clashPath, ["-f", configPath]);

  clashProcess.stdout.on("data", (data) => {
    console.log(`[Clash stdout] ${data}`);
  });

  clashProcess.stderr.on("data", (data) => {
    console.error(`[Clash stderr] ${data}`);
  });

  clashProcess.on("close", (code) => {
    console.log(`Clash process exited with code ${code}`);
    clashProcess = null;
  });
}

function stopClash() {
  if (clashProcess) {
    clashProcess.kill();
    clashProcess = null;
  }
}

// https.get(config_keys, (res) => {
//   let data = "";
//   res.on("data", (EncodedAudioChunk) => {
//     data += EncodedAudioChunk;
//   });
//   console.log(`正在获取配置文件...`);
//   res
//     .on("end", () => {
//       fs.writeFile(configPath, data, (error) => {
//         if (error) {
//           console.error(`写入配置文件时发生错误: ${error.message}`);
//           return;
//         }
//         console.log(`配置文件已成功保存到 ${configPath}`);
//       });
//     })
//     .on("error", (error) => {
//       console.error(`获取配置文件时发生错误: ${error.message}`);
//     });
// });

fetchConfig();
