# MSI Product Page Scraper

A simple Playwright-based scraper that extracts product information from an MSI product page and saves the result as JSON.

## Tech Stack

- Node.js
- JavaScript
- Playwright (Firefox)

## Installation

```bash
npm install
npx playwright install firefox
```

## Run

```bash
npm run scrape
```

After running the scraper, the extracted product data will be saved to:

```text
output/product.json
```

## Output Schema

```json
{
  "url": "string",
  "item_id": "string | null",
  "title": "string | null",
  "brand": "string | null",
  "product_category": "string | null",
  "category_tree": [
    {
      "name": "string",
      "url": "string | null"
    }
  ],
  "description": "string | null",
  "price": "number | null",
  "sale_price": "number | null",
  "availability": "in_stock | out_of_stock | pre_order | null",
  "image_url": "string | null",
  "additional_image_urls": ["string"],
  "specs": [
    {
      "name": "string",
      "value": "string | null"
    }
  ],
  "star_rating": "number | null",
  "review_count": "number | null",
  "gtin": "string | null",
  "mpn": "string | null",
  "scraped_at": "ISO 8601 datetime"
}
```

## Note

This project uses Playwright with Firefox in headless mode. Before running the scraper, install the Firefox browser:

```bash
npx playwright install firefox
```
