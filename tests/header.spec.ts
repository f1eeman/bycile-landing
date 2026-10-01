import { expect, test } from '@playwright/test'

const PAGES = ['/', '/catalog/', '/product/']

for (const path of PAGES) {
  test(`${path}: каждая ссылка шапки и подвала ведёт в существующую цель`, async ({
    page,
    request,
  }) => {
    await page.goto(path)

    const hrefs = await page
      .locator('header nav a, footer nav a')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')))

    expect(hrefs.length).toBe(14)

    for (const href of hrefs) {
      const target = String(href)

      if (target.startsWith('#')) {
        await expect(page.locator(target)).toHaveCount(1)
        continue
      }

      const url = new URL(target, page.url())
      const response = await request.get(url.pathname)

      expect(response.status()).toBe(200)

      if (url.hash !== '')
        expect(await response.text()).toContain(`id="${url.hash.slice(1)}"`)
    }
  })
}

test('активный пункт: каталог — страница, карточка — раздел', async ({
  page,
}) => {
  await page.goto('/catalog/')
  await expect(
    page.locator('header nav').getByRole('link', { name: 'Велосипеды' }),
  ).toHaveAttribute('aria-current', 'page')

  await page.goto('/product/')
  await expect(
    page.locator('header nav').getByRole('link', { name: 'Аксессуары' }),
  ).toHaveAttribute('aria-current', 'true')

  await page.goto('/')
  await expect(page.locator('header nav [aria-current]')).toHaveCount(0)
})

test('счётчик корзины есть только на карточке', async ({ page }) => {
  await page.goto('/product/')
  await expect(
    page.locator('header').getByRole('button', { name: 'Корзина, товаров: 1' }),
  ).toBeVisible()

  await page.goto('/catalog/')
  await expect(
    page
      .locator('header')
      .getByRole('button', { name: 'Корзина', exact: true }),
  ).toBeVisible()
})

test('«Контакты» доводит до соцсетей в подвале', async ({ page }) => {
  await page.goto('/')
  await page
    .locator('header nav')
    .getByRole('link', { name: 'Контакты' })
    .click()

  const contacts = page.locator('#contacts')

  await expect(contacts).toBeInViewport()
  await expect(contacts.getByRole('link', { name: 'Вконтакте' })).toBeVisible()
})

test('фокус с клавиатуры виден на тёмной шапке', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')

  const outline = await page.evaluate(() => {
    const active = document.activeElement

    if (active === null) return 'none'

    return getComputedStyle(active).outlineStyle
  })

  expect(outline).not.toBe('none')
})
