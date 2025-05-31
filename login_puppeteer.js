const puppeteer = require("puppeteer");
const { setGlobalProxy } = require("./clash/clash_controller");

// 初始化代理
(async () => {
    await setGlobalProxy();
})();


async function encryput(page) {
  await page.waitForSelector("#username", { visible: true });
  await page.waitForSelector("input[id='pwd']", { visible: true });
  await page.type("#username_tip", "U202215561");
  await page.type("input[id='pwd_tip']", "01153501");
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins",
      "--no-sandbox",
    ],
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
  );

  await page.goto("http://172.18.18.61:8080");

  const frame = await page.frames().find((f) => f.url().includes("index.jsp"));
  if (frame) {
    await encryput(page);
  } else {
    await encryput(page);
  }

  await page.screenshot({ path: "after_login.png" });
  //
  await page.click("#loginLink_div");

  await page.waitForNavigation({ waitUntil: "networkidle0" });

  await page.waitForTimeout(10000);
  const url = await page.url();
  const content = await page.content();

  console.log("最终地址:", url);
  console.log("页面内容:", content);

  await browser.close();
})();
