import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/catalog/')
})

test('девять карточек в сетке', async ({ page }) => {
  await expect(page.locator('#catalog-grid > li')).toHaveCount(9)
})

test('вид «в столбик» и обратно', async ({ page }) => {
  const grid = page.locator('#catalog-grid')
  const list = page.getByRole('button', { name: 'Отобразить в столбик' })
  const tiles = page.getByRole('button', { name: 'Отобразить карточками' })

  await expect(tiles).toHaveAttribute('aria-pressed', 'true')

  await list.click()

  await expect(grid).toHaveAttribute('data-view', 'list')
  await expect(list).toHaveAttribute('aria-pressed', 'true')
  await expect(tiles).toHaveAttribute('aria-pressed', 'false')

  const first = await grid.locator('> li').first().boundingBox()
  const second = await grid.locator('> li').nth(1).boundingBox()

  if (first === null || second === null) throw new Error('нет коробок карточек')

  expect(second.y).toBeGreaterThan(first.y + first.height - 1)

  await tiles.click()

  await expect(grid).toHaveAttribute('data-view', 'grid')
})

test('«Сбросить фильтры» возвращает умолчания формы', async ({ page }) => {
  const carbon = page.getByRole('checkbox', { name: 'Карбон' })
  const steel = page.getByRole('checkbox', { name: 'Сталь' })

  await carbon.check()
  await steel.uncheck()
  await page.getByRole('button', { name: 'Сбросить фильтры' }).click()

  await expect(carbon).not.toBeChecked()
  await expect(steel).toBeChecked()
})

test('«Показать» отправляет фильтр на ту же страницу', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Карбон' }).check()
  await page.getByRole('button', { name: 'Показать' }).click()

  await expect(page).toHaveURL(/\/catalog\/\?.+/)
  await expect(page.locator('#catalog-grid > li')).toHaveCount(9)
})

test('на телефоне фильтр свёрнут и раскрывается', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 })

  const show = page.getByRole('button', { name: 'Показать' })

  await expect(show).toBeHidden()

  await page.locator('[data-filter-toggle]').click()

  await expect(show).toBeVisible()
})
