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

    const productIdInput = page.locator('input[name="product_id"]');
    const itemId =
      (await productIdInput.count()) > 0
        ? await productIdInput.inputValue()
        : null;

    console.log(itemId);

    const title =
      (
        await page
          .locator(".product-detail > .row > div:nth-child(2) > h2")
          .textContent()
      )?.trim() || null;

    console.log(title);

    const brandText =
      (await page.locator("#logo img").getAttribute("alt"))?.trim() || null;

    const brand = brandText ? brandText.split("-")[0] : null;

    console.log(brand);

    const categoryLinks = page.locator(".breadcrumb a");

    const categoryTree = await categoryLinks.evaluateAll((links) =>
      links
        .map((link) => ({
          name: link.textContent.trim(),
          url: link.href || null,
        }))
        .filter((item) => item.name && item.name.toLowerCase() !== "home"),
    );

    console.log(categoryTree);

    const productCategory =
      categoryTree.map((item) => item.name).join(" > ") || null;

    console.log(productCategory);
  } catch (error) {
    console.log(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
