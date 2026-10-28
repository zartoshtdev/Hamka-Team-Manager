import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});
test('empty state contains no sample project', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'نمای کلی فضای کار' })).toBeVisible();
  await expect(page.getByText('جای پروژهٔ اولت اینجاست')).toBeVisible();
});
test('member → project → task survives a reload', async ({ page }) => {
  await page.goto('/#/members');
  await page.getByRole('button', { name: 'عضو جدید', exact: true }).click();
  await page.getByLabel('نام و نام خانوادگی').fill('عضو تست');
  await page.getByLabel('تخصص یا سمت').fill('طراح');
  await page.getByRole('button', { name: 'ذخیرهٔ عضو' }).click();
  await page.goto('/#/projects');
  await page.getByRole('button', { name: 'پروژهٔ جدید', exact: true }).click();
  await page.getByLabel('نام پروژه', { exact: true }).fill('پروژهٔ تست');
  await page.getByLabel('سرپرست پروژه').click();
  await page.getByRole('option', { name: 'عضو تست' }).click();
  await page.getByRole('button', { name: 'ذخیرهٔ پروژه' }).click();
  await page.goto('/#/tasks');
  await page.getByRole('button', { name: 'تسک جدید', exact: true }).first().click();
  await page.getByLabel('پروژه', { exact: true }).last().click();
  await page.getByRole('option', { name: 'پروژهٔ تست' }).click();
  await page.getByLabel('عنوان تسک', { exact: true }).fill('تسک تست');
  await page.getByRole('button', { name: 'ذخیرهٔ تسک' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'تسک تست', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'تسک تست', exact: true }).click();
  await page.getByLabel('زیرکار جدید').fill('بررسی نهایی');
  await page.getByRole('button', { name: 'افزودن', exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'بررسی نهایی' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'بررسی نهایی' }).check();
});
test('theme preference persists', async ({ page }) => {
  await page.getByRole('button', { name: 'تغییر تم' }).click();
  await page.reload();
  const theme = await page.evaluate(
    () => JSON.parse(localStorage.getItem('hamkar.workspace.v1')!).settings.theme,
  );
  expect(theme).toBe('dark');
});
test('mobile navigation opens', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile viewport only');
  await page.getByRole('button', { name: 'بازکردن منو' }).click();
  await expect(page.getByRole('link', { name: 'اعضای تیم' })).toBeVisible();
});
