import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/product/')
})

test('«Приблизить» открывает снимок, Esc закрывает и возвращает фокус', async ({
  page,
}) => {
  const open = page.getByRole('button', { name: 'Приблизить' })
  const dialog = page.getByRole('dialog', { name: 'Седло Steed G67' })

  await open.click()
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('img')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(open).toBeFocused()
})

test('клик по подложке закрывает окно', async ({ page }) => {
  await page.getByRole('button', { name: 'Приблизить' }).click()
  await page.mouse.click(4, 4)

  await expect(page.getByRole('dialog')).toBeHidden()
})
