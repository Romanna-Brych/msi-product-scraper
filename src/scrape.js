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

    const description =
      (
        await page
          .locator(".product-detail > .row > div:nth-child(2) > div")
          .first()
          .textContent()
      )?.trim() || null;
    console.log(description);

    const priceText =
      (await page.locator("#prices-new").textContent())?.trim() || null;
    const price = priceText ? Number(priceText.replace("$", "")) : null;
    console.log(price);

    const salePrice = null;
    console.log(salePrice);

    const availabilityText =
      (
        await page.locator("#prices-wrapper span").last().textContent()
      )?.trim() || null;

    let availability = null;

    if (availabilityText === "In Stock") {
      availability = "in_stock";
    } else if (availabilityText === "Out of Stock") {
      availability = "out_of_stock";
    } else if (availabilityText === "Pre Order") {
      availability = "pre_order";
    }
    console.log(availability);

    const imageUrl =
      (await page.locator("#imagePopup").getAttribute("src")) || null;
    console.log(imageUrl);

    const additionalImageUrls = await page
      .locator("#carouselImages img.product-detail-thumb-bto")
      .evaluateAll((images) =>
        images
          .map((img) => img.getAttribute("popup_img"))
          .filter(Boolean)
          .filter((url, index, array) => array.indexOf(url) === index),
      );
    console.log(additionalImageUrls);

    const specs = await page
      .locator("table.table tbody tr")
      .evaluateAll((rows) =>
        rows.map((row) => ({
          name: row.querySelector("th")?.textContent.trim() || null,
          value: row.querySelector("td")?.textContent.trim() || null,
        })),
      );

    console.log(specs);

    const ratingText =
      (
        await page
          .locator("#average-rating-link #average-rating-info")
          .first()
          .textContent()
      )?.trim() || null;

    const starRating = ratingText ? Number(ratingText.split(" ")[0]) : null;

    const reviewCount = ratingText
      ? Number(ratingText.split("(")[1].replace(")", ""))
      : null;

    console.log(starRating);
    console.log(reviewCount);

    const gtin = null;
    console.log(gtin);

    const mpn =
      specs.find((spec) => spec.name === "Manufacturer Number")?.value || null;

    console.log(mpn);

    const scrapedAt = new Date().toISOString();

    console.log(scrapedAt);
  } catch (error) {
    console.log(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
