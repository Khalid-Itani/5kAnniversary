import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";
import { database, signIn } from "./support/database";

test("organizer can update statuses, export participants and sign out", async ({ page, context }) => {
  const { admin } = database();
  const email = `admin-row-${randomUUID()}@example.com`;
  const participant = await admin.from("registrations").insert({ first_name: "Admin", last_name: "Test", email,
    age_on_race_day: 30, city: "Jersey City", participation_type: "walk", donor_name: "Test", amount_claimed: 20 }).select().single();
  expect(participant.error).toBeNull();
  const business = await admin.from("business_inquiries").insert({ business_name: `Cafe ${email}`, contact_name: "Test",
    email, interest_type: "other", message: "Local test" }).select().single();
  expect(business.error).toBeNull();
  await signIn(context);
  await page.goto("/admin");
  const row = page.getByRole("row").filter({ hasText: email });
  await row.getByRole("combobox").selectOption("verified");
  await row.getByRole("button", { name: "Save" }).click();
  await expect.poll(async () => (await admin.from("registrations").select("donation_status").eq("id", participant.data.id).single()).data?.donation_status).toBe("verified");
  const card = page.getByRole("article").filter({ hasText: `Cafe ${email}` });
  await card.getByRole("combobox").selectOption("contacted");
  await card.getByRole("button", { name: "Save" }).click();
  await expect.poll(async () => (await admin.from("business_inquiries").select("status").eq("id", business.data.id).single()).data?.status).toBe("contacted");
  const csv = await context.request.get("/admin/export");
  expect(csv.status()).toBe(200);
  expect(await csv.text()).toContain(email);
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect((await context.request.get("/admin/export")).status()).toBe(401);
});

test("database denies public reads and privileged inserts; non-organizers cannot read or update", async ({ context, page }) => {
  const { admin, anon } = database();
  expect((await anon.from("registrations").select("*")).error).not.toBeNull();
  expect((await anon.from("business_inquiries").select("*")).error).not.toBeNull();
  const unauthorizedInsert = await anon.from("registrations").insert({
    first_name: "Unauthorized", last_name: "Test", email: `blocked-${randomUUID()}@example.com`,
    age_on_race_day: 30, city: "Test", participation_type: "run", donor_name: "Test",
    amount_claimed: 20, donation_status: "verified",
  });
  expect(unauthorizedInsert.error?.code).toBe("42501");
  const email = `protected-${randomUUID()}@example.com`;
  const record = await admin.from("registrations").insert({ first_name: "Private", last_name: "Test", email,
    age_on_race_day: 30, city: "Test", participation_type: "run", donor_name: "Test", amount_claimed: 20 }).select().single();
  expect(record.error).toBeNull();
  const outsider = await signIn(context, `outsider-${randomUUID()}@example.com`);
  expect((await outsider.from("registrations").select("*").eq("id", record.data.id)).data).toEqual([]);
  await outsider.from("registrations").update({ donation_status: "verified" }).eq("id", record.data.id);
  expect((await admin.from("registrations").select("donation_status").eq("id", record.data.id).single()).data?.donation_status).toBe("pending");
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect((await context.request.get("/admin/export")).status()).toBe(401);
});
