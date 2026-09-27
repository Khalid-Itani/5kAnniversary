import { randomUUID } from "node:crypto";
import { test, expect, type Page } from "@playwright/test";
import { database, signIn } from "./support/database";

async function fillRegistration(page: Page, email: string) {
  await page.goto("/register");
  await page.getByLabel("First name", { exact: true }).fill("Regression");
  await page.getByLabel("Last name", { exact: true }).fill("Runner");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Age on race day").fill("30");
  await page.getByLabel("City", { exact: true }).fill("Jersey City");
  await page.getByRole("radio", { name: "Run", exact: true }).check();
  await page.getByLabel("GoFundMe donor name").fill("Test Donor");
  await page.getByLabel("Amount donated").fill("20");
}

for (const signedIn of [false, true]) {
  test(`registration saves ${signedIn ? "while signed into admin (42501 regression)" : "while signed out"}`, async ({ page, context }) => {
    const { admin } = database();
    if (signedIn) {
      await signIn(context);
      await page.goto("/admin");
      await expect(page.getByRole("heading", { name: "Race operations" })).toBeVisible();
    }
    const email = `runner-${randomUUID()}@example.com`;
    await fillRegistration(page, email);
    await page.getByLabel(/Email me event reminders/).check();
    await page.getByRole("button", { name: "Submit registration" }).click();
    await expect(page.getByRole("status")).toContainText("Registration received.");
    const { data, error } = await admin.from("registrations").select("*").eq("email", email).single();
    expect(error).toBeNull();
    expect(data).toMatchObject({ donation_status: "pending", email_updates: true, amount_claimed: 20 });
    await fillRegistration(page, email);
    await page.getByRole("button", { name: "Submit registration" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText("already registered");
  });

  test(`business inquiry saves ${signedIn ? "with an admin session" : "without a session"}`, async ({ page, context }) => {
    const { admin } = database();
    if (signedIn) await signIn(context);
    const email = `business-${randomUUID()}@example.com`;
    await page.goto("/businesses");
    await page.getByLabel("Business or organization name").fill("Test Cafe");
    await page.getByLabel("Contact name", { exact: true }).fill("Test Contact");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("How would you like to participate?").selectOption("food_drink");
    await page.getByLabel("Tell us what you have in mind").fill("We can supply water.");
    await page.getByRole("button", { name: "Send business inquiry" }).click();
    await expect(page.getByRole("status")).toContainText("Thanks for reaching out.");
    const result = await admin.from("business_inquiries").select("status,message").eq("email", email).single();
    expect(result.error).toBeNull();
    expect(result.data).toEqual({ status: "new", message: "We can supply water." });
  });
}

test("invalid age, donation and honeypot never create a registration", async ({ page }) => {
  const { admin } = database();
  const email = `invalid-${randomUUID()}@example.com`;
  for (const [name, value, message] of [
    ["ageOnRaceDay", "17", "18 and older"],
    ["amountClaimed", "19", "at least $20"],
    ["website", "spam", "Unable to submit"],
  ]) {
    await fillRegistration(page, email);
    await page.locator(`[name="${name}"]`).evaluate((el, value) => { (el as HTMLInputElement).value = value; }, value);
    await page.getByRole("button", { name: "Submit registration" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(message);
  }
  const { count, error } = await admin.from("registrations").select("id", { count: "exact", head: true }).eq("email", email);
  expect(error).toBeNull();
  expect(count).toBe(0);
});
