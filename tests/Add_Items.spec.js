const { test, expect } = require('@playwright/test');

test('Add_Items', async ({ page }) => {

  // ── 1. Login to SauceDemo 
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(/.*inventory/);
  console.log(' Logged in');
  await page.waitForTimeout(1000);
  // ── 2. Reset App State 
  await page.click('#react-burger-menu-btn');
  await page.click('#reset_sidebar_link');
  await page.click('#react-burger-cross-btn');
  console.log(' App State Reset');
  await page.waitForTimeout(1000);
  // ── 3. Add 3 items to cart 
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
  await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  console.log(' 3 Items Added to Cart');
  await page.waitForTimeout(1000)
  // ── 4. Go to Checkout 
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.fill('[data-test="postalCode"]', '12345');
  await page.click('[data-test="continue"]');
  await page.waitForTimeout(1000)
  // ── 5. Verify product names and total price
  await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
  await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
  await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Bolt T-Shirt' })).toBeVisible();

  const total = await page.locator('.summary_total_label').textContent();
  expect(total).toMatch(/Total:\s*\$[\d.]+/);
  console.log(` Products verified | ${total.trim()}`);

  // ── 6. Finish order
  await page.click('[data-test="finish"]');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  console.log(' Order Placed Successfully');
  await page.waitForTimeout(1000)
  // ── 7. Reset App State again 
  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.click('#react-burger-menu-btn');
  await page.click('#reset_sidebar_link');
  await page.click('#react-burger-cross-btn');
  console.log(' App State Reset Again');

  // ── 8. Logout 
  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  console.log(' Logged Out');
  await page.waitForTimeout(1000)
});