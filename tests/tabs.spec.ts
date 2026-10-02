import { expect, test, type Page } from '@playwright/test'

const tabOf = (page: Page, name: string) => page.getByRole('tab', { name })

test.beforeEach(async ({ page }) => {
  await page.goto('/product/')
})

test('по умолчанию открыты «Отзывы»', async ({ page }) => {
  await expect(tabOf(page, 'Отзывы')).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toHaveCount(1)
  await expect(page.getByRole('tabpanel')).toContainText('Максимальный комфорт')
})

test('клик открывает «Условия гарантии»', async ({ page }) => {
  await tabOf(page, 'Условия гарантии').click()

  await expect(tabOf(page, 'Условия гарантии')).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await expect(page.getByRole('tabpanel')).toContainText('Гарантия 1 год')
})

test('стрелки, Home и End водят фокус и выбор', async ({ page }) => {
  await tabOf(page, 'Отзывы').focus()

  await page.keyboard.press('ArrowRight')
  await expect(tabOf(page, 'Обзоры')).toBeFocused()
  await expect(tabOf(page, 'Обзоры')).toHaveAttribute('aria-selected', 'true')

  await page.keyboard.press('ArrowRight')
  await expect(tabOf(page, 'Подробное описание')).toBeFocused()

  await page.keyboard.press('End')
  await expect(tabOf(page, 'Обзоры')).toBeFocused()

  await page.keyboard.press('Home')
  await expect(tabOf(page, 'Подробное описание')).toBeFocused()
  await expect(page.locator('[role="tab"][tabindex="0"]')).toHaveCount(1)
})
