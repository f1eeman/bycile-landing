import { expect, test } from '@playwright/test'

const PAGES = ['/', '/catalog/', '/product/', '/privacy/']

for (const path of PAGES) {
  test(`${path} отвечает и несёт ровно один h1`, async ({ page }) => {
    const response = await page.goto(path)

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
  })
}
