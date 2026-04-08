const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText));

  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });

  // Try to click on a product - look for elements that might be product cards
  try {
    // Wait for the page to load products
    await page.waitForTimeout(2000);

    // Look for clickable elements in the product grid
    const productElements = await page.$$('.group.cursor-pointer');
    if (productElements.length > 0) {
      console.log(`Found ${productElements.length} product elements`);
      await productElements[0].click();
      console.log('Clicked on first product');
      await page.waitForTimeout(2000);
    } else {
      console.log('No product elements found');
    }
  } catch (e) {
    console.log('Error clicking product:', e.message);
  }

  await page.screenshot({ path: 'page_after_click.png', fullPage: true });
  console.log('DONE');
  await browser.close();
})();