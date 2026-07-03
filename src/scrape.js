const { chromium } = require("playwright");

async function main() {
  let browser;
  try {
    browser = await chromium.launch({
      headless: false,
    });
    const page = await browser.newPage();

    await page.goto(
      "https://us-store.msi.com/Motherboards/Intel-Platform-Motherboard/INTEL-Z890/MAG-Z890-TOMAHAWK-WIFI",
    );
  } catch (error) {
    console.log(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
