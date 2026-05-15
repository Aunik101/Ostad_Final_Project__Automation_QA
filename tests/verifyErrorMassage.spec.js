const { test, expect } = require("@playwright/test");

test("Verify error message on invalid login", async ({ page }) => {
    // Verify error message on invalid login
    await page.goto("https://www.saucedemo.com/");
    await page.getByPlaceholder("Username").type("invalid_user");timeout: 10000;
    await page.getByPlaceholder("Password").type("wrong_password");
    await page.getByRole("button", { name: "Login" }).click();
    const errorMessage = await page.locator("[data-test='error']").textContent();

    expect(errorMessage).toContain("Username and password do not match");
    console.log("Error Message:", errorMessage);
});
