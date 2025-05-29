const puppeteer = require("puppeteer");

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

  await page.goto(
    "http://172.18.18.61:8080/eportal/index.jsp?wlanuserip=a8bd09ff950541c39bc0d30f53bd0b35&wlanacname=31e4a47743279bf6ea846721f186502e&ssid=&nasip=bf154bd7033a365bc1f2795dda2e9033&snmpagentip=&mac=aff6a535a210b67e9e2c1f18a4f6b67a&t=wireless-v2&url=709db9dc9ce334aa02a9e1ee58ba6fcf3bc3349e947ead368bdd021b808fdbac30c65edaa96b0727&apmac=&nasid=31e4a47743279bf6ea846721f186502e&vid=04ede860129d2221&port=26ef2a2baeda521b&nasportid=5b9da5b08a53a540806c821ff7c143815e5fe8f203792136a1ebba6a7fb85be7"
  );

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
