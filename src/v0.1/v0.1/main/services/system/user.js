const fs = require("fs");
const yaml = require("js-yaml");

class QMR {
  constructor(options = {}) {
    this.debug = options.debug;
    this.filepath = options.filepath;
    this.proxyManager = new ProxyManager(options);
    this.configManager = new ConfigManager(options);
  }

  if(debug) {
    console.log("DEBUG MODE");
  }
  async getUserConfig() {
    const userconfig = fs.readFileSync(filepath);
    const data = yaml.safeLoad(userconfig);
    return data;
  }

  async showUserConfig() {
    const userconfig = fs.readFileSync(filepath);
    const data = yaml.safeLoad(userconfig);
    console.log(data);
  }
  //承诺给用户的前端list加入一个结构 object
  async addUserConfig(setting) {
    data = this.getUserConfig();
    const newYaml = yaml.dump(data, setting);
    fs.writeFileSync(this.filepath, newYaml, "utf8");
  }
}
