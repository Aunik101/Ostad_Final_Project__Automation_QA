const { test, expect } = require('@playwright/test');

test('Q3', async ({ page }) => {

  // Login
  await page.goto('https://www.saucedemo.com');
  await page.fill('#user-name', 'performance_glitch_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 15000 });

  // Reset App State
  await page.click('#react-burger-menu-btn');
  await page.click('#reset_sidebar_link');
  await page.click('#react-burger-cross-btn');

  // Filter Z to A
  await page.selectOption('[data-test="product-sort-container"]', 'za');

  // Add first product to cart
  const firstItem    = page.locator('.inventory_item').first();
  const productName  = await firstItem.locator('.inventory_item_name').innerText();
  const productPrice = await firstItem.locator('.inventory_item_price').innerText();
  await firstItem.locator('button[id^="add-to-cart"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Go to cart → Checkout
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // Fill customer info
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.fill('[data-test="postalCode"]', '12345');
  await page.click('[data-test="continue"]');

  // Verify product name and total on overview page
  await expect(page).toHaveURL(/checkout-step-two/, { timeout: 15000 });
  await expect(page.locator('.inventory_item_name')).toHaveText(productName);

  const subtotal = parseFloat((await page.locator('.summary_subtotal_label').innerText()).replace(/[^0-9.]/g, ''));
  const tax      = parseFloat((await page.locator('.summary_tax_label').innerText()).replace(/[^0-9.]/g, ''));
  const total    = parseFloat((await page.locator('.summary_total_label').innerText()).replace(/[^0-9.]/g, ''));

  console.log(`Product: ${productName} | Price: ${productPrice}`);
  console.log(`Subtotal: $${subtotal} | Tax: $${tax} | Total: $${total}`);

  expect(subtotal).toBeCloseTo(parseFloat(productPrice.replace('$', '')), 2);
  expect(subtotal + tax).toBeCloseTo(total, 2);

  // Finish purchase
  await page.click('[data-test="finish"]');
  await expect(page).toHaveURL(/checkout-complete/, { timeout: 15000 });
  await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you');

  // Reset App State & Logout
  await page.click('[data-test="back-to-products"]');
  await page.click('#react-burger-menu-btn');
  await page.click('#reset_sidebar_link');
  await page.click('#logout_sidebar_link');
  await expect(page.locator('#login-button')).toBeVisible();
});