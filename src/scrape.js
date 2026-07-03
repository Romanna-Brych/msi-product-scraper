const fs = require("fs/promises");
const path = require("path");
const { firefox } = require("playwright");

const PRODUCT_URL =
  "https://us-store.msi.com/Motherboards/Intel-Platform-Motherboard/INTEL-Z890/MAG-Z890-TOMAHAWK-WIFI";

async function main() {
  let browser;
  try {
    browser = await firefox.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.goto(PRODUCT_URL);

    const productIdInput = page.locator('input[name="product_id"]');
    const itemId =
      (await productIdInput.count()) > 0
        ? await productIdInput.inputValue()
        : null;

    const title =
      (
        await page.locator(".product-detail h2.crop-text-2.title").textContent()
      )?.trim() || null;

    const brandText =
      (await page.locator("#logo img").getAttribute("alt"))?.trim() || null;

    const brand = brandText ? brandText.split("-")[0] : null;

    const categoryLinks = page.locator(".breadcrumb a");

    const categoryTree = await categoryLinks.evaluateAll((links) =>
      links
        .map((link) => ({
          name: link.textContent.trim(),
          url: link.href || null,
        }))
        .filter((item) => item.name && item.name.toLowerCase() !== "home"),
    );

    const productCategory =
      categoryTree.map((item) => item.name).join(" > ") || null;

    const description =
      (
        await page
          .locator(".product-detail h2.crop-text-2.title + div p")
          .textContent()
      )?.trim() || null;

    const priceText =
      (await page.locator("#prices-new").textContent())?.trim() || null;
    const price = priceText ? Number(priceText.replace("$", "")) : null;

    const salePrice = null;

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

    const imageUrl =
      (await page.locator("#imagePopup").getAttribute("src")) || null;

    const additionalImageUrls = await page
      .locator("#carouselImages img.product-detail-thumb-bto")
      .evaluateAll((images) =>
        images
          .map((img) => img.getAttribute("popup_img"))
          .filter(Boolean)
          .filter((url, index, array) => array.indexOf(url) === index),
      );

    const specs = await page
      .locator("table.table tbody tr")
      .evaluateAll((rows) =>
        rows.map((row) => ({
          name: row.querySelector("th")?.textContent.trim() || null,
          value: row.querySelector("td")?.textContent.trim() || null,
        })),
      );

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

    const gtin = null;
    const mpn =
      specs.find((spec) => spec.name === "Manufacturer Number")?.value || null;
    const scrapedAt = new Date().toISOString();

    const product = {
      url: page.url(),
      item_id: itemId,
      title,
      brand,
      product_category: productCategory,
      category_tree: categoryTree,
      description,
      price,
      sale_price: salePrice,
      availability,
      image_url: imageUrl,
      additional_image_urls: additionalImageUrls,
      specs,
      star_rating: starRating,
      review_count: reviewCount,
      gtin,
      mpn,
      scraped_at: scrapedAt,
    };

    const outputDir = path.join(process.cwd(), "output");
    const outputPath = path.join(outputDir, "product.json");

    await fs.mkdir(outputDir, { recursive: true });

    await fs.writeFile(outputPath, JSON.stringify(product, null, 2));

    console.log("Saved to output/product.json");
  } catch (error) {
    console.error(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();
