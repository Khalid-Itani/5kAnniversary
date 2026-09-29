import { test, expect } from "@playwright/test";

test("homepage introduces the nonprofit partner and links to its website", async ({ page }) => {
  await page.goto("/");
  const partner = page.getByRole("region", { name: "In partnership with EMBRACE" });
  await expect(partner.getByRole("img", { name: "EMBRACE" })).toBeVisible();
  const website = partner.getByRole("link", { name: /Visit EMBRACE/ });
  await expect(website).toHaveAttribute("href", "https://www.weembraceu.org/");
  await expect(website).toHaveAttribute("target", "_blank");
  await expect(website).toHaveAttribute("rel", "noopener noreferrer");
});

test("public pages load on desktop and mobile without horizontal overflow", async ({ page }) => {
  for (const route of ["/", "/register", "/businesses", "/privacy", "/admin/login"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("registration validates empty fields without accepting the submission", async ({ page }) => {
  await page.goto("/register");
  await page.getByRole("button", { name: "Submit registration" }).click();
  await expect(page.locator("form").getByRole("alert")).toHaveText("First name is required.");
});

test("organizer login rejects other email addresses", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Admin email").fill("outsider@example.com");
  await page.getByRole("button", { name: "Email me a sign-in link" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("not authorized");
});

test("unauthenticated admin access and CSV export are blocked", async ({ page, request }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect((await request.get("/admin/export")).status()).toBe(401);
  await page.goto("/auth/callback");
  await expect(page).toHaveURL(/\/admin\/login\?error=auth$/);
});
