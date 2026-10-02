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

test('«Закрыть» закрывает окно и возвращает фокус на «Приблизить»', async ({
  page,
}) => {
  const open = page.getByRole('button', { name: 'Приблизить' })
  const dialog = page.getByRole('dialog', { name: 'Седло Steed G67' })

  await open.click()
  await dialog.getByRole('button', { name: 'Закрыть' }).click()

  await expect(dialog).toBeHidden()
  await expect(open).toBeFocused()
})

test('открытое окно не прокручивает страницу и не сдвигает её после закрытия', async ({
  page,
}) => {
  const open = page.getByRole('button', { name: 'Приблизить' })
  const dialog = page.getByRole('dialog', { name: 'Седло Steed G67' })
  const scrollY = () => page.evaluate(() => window.scrollY)
  const columnX = async () =>
    (await page.locator('.layout.content-column').boundingBox())?.x

  await open.scrollIntoViewIfNeeded()
  const before = { y: await scrollY(), x: await columnX() }

  await open.click()
  await expect(dialog).toBeVisible()

  const viewport = page.viewportSize()

  if (viewport === null) throw new Error('нет окна')

  await page.mouse.move(viewport.width / 2, viewport.height / 2)
  await page.mouse.wheel(0, 800)
  await page.waitForTimeout(500)

  expect(await scrollY()).toBe(before.y)

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  expect(await scrollY()).toBe(before.y)
  expect(await columnX()).toBe(before.x)
})
