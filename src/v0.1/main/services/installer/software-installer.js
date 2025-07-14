const fs = require("fs");
const path = require("path");
const https = require("https");
const { execFile } = require("child_process");
const os = require("os");
const { EventEmitter } = require("events");

class SoftwareInstallerService extends EventEmitter {
  /**
   * 创建软件安装服务实例
   */
  constructor() {
    super();
    this.tempDir = path.join(os.tmpdir(), "QMR-Toolkit-Downloads");
  }

  async installSoftware(software) {
    const { id, name, url, installer_args } = software;

    this.emit("status", { id, status: "downloading" });

    try {
      const filePath = await this.downloadFile(url);
      this.emit("status", { id, status: "installing" });
      await this.runInstaller(filePath, installer_args);
      this.emit("status", { id, status: "success" });
    } catch (error) {
      this.emit("status", { id, status: "error", message: error.message });
      throw error;
    }
  }

  async downloadFile(url) {
    await fs.promises.mkdir(this.tempDir, { recursive: true });

    const fileName = path.basename(new URL(url).pathname);
    const filePath = path.join(this.tempDir, fileName);

    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(filePath);

      const request = (downloadUrl) => {
        https
          .get(downloadUrl, (response) => {
            if (
              response.statusCode >= 300 &&
              response.statusCode < 400 &&
              response.headers.location
            ) {
              request(response.headers.location);
              return;
            }

            if (response.statusCode !== 200) {
              reject(new Error(`下载失败，状态码: ${response.statusCode}`));
              return;
            }

            response.pipe(fileStream);

            fileStream.on("finish", () => {
              fileStream.close(() => resolve(filePath));
            });
          })
          .on("error", (err) => {
            fs.unlink(filePath, () => {});
            reject(err);
          });
      };

      request(url);
    });
  }

  runInstaller(filePath, args) {
    return new Promise((resolve, reject) => {
      execFile(
        filePath,
        args ? args.split(" ") : [],
        { shell: true },
        (error, stdout, stderr) => {
          if (error) {
            if (stderr) {
            }
            return reject(error);
          }
          resolve();
        }
      );
    });
  }

  async getSoftwareList(configPath) {
    try {
      const data = await fs.promises.readFile(configPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async cleanupTempDir() {
    try {
      await fs.promises.rm(this.tempDir, { recursive: true, force: true });
    } catch (error) {}
  }
}

module.exports = { SoftwareInstallerService };
