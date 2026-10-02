import { expect, test } from '@playwright/test'

const PAGES = ['/', '/catalog/', '/product/', '/privacy/']
const WIDTHS = [320, 375, 768, 1024, 1366, 1920]

for (const path of PAGES) {
  for (const width of WIDTHS) {
    test(`${path} на ${String(width)}: нет горизонтальной прокрутки`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight)
      })

      const scroll = await page.evaluate(
        () => document.documentElement.scrollWidth,
      )

      expect(scroll).toBeLessThanOrEqual(width)
    })
  }
}

test('навигация шапки — одна строка, пока бургер скрыт', async ({ page }) => {
  for (const width of [1024, 1100, 1200, 1280, 1366, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/catalog/')

    if (await page.locator('[data-menu-toggle]').isVisible()) continue

    const tops = await page
      .locator('header nav a')
      .evaluateAll((nodes) =>
        nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
      )

    expect(new Set(tops).size, `ширина ${String(width)}`).toBe(1)
  }
})

test('на 1920 фон промо закрывает всю ширину', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')

  const promo = await page.locator('#promo').boundingBox()
  const picture = await page.locator('#promo img').first().boundingBox()

  if (promo === null || picture === null) throw new Error('нет коробок промо')

  expect(promo.width).toBe(1920)
  expect(picture.x).toBeLessThanOrEqual(0)
  expect(picture.x + picture.width).toBeGreaterThanOrEqual(1920)
  expect(picture.height).toBeGreaterThanOrEqual(promo.height)
})

test('после полной прокрутки ни один блок не остался прозрачным', async ({
  page,
}) => {
  for (const path of PAGES) {
    await page.goto(path)

    for (let step = 0; step < 12; step += 1) {
      await page.mouse.wheel(0, 900)
      await page.waitForTimeout(120)
    }

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight)
    })
    await page.waitForTimeout(900)

    const hidden = await page
      .locator('[data-reveal]')
      .evaluateAll(
        (nodes) =>
          nodes.filter((node) => Number(getComputedStyle(node).opacity) < 1)
            .length,
      )

    expect(hidden, path).toBe(0)
  }
})

for (const { path, list } of [
  { path: '/', list: '#bikes .cards' },
  { path: '/catalog/', list: '.catalog-grid' },
]) {
  test(`${path}: одиночная карточка последнего ряда стоит по центру`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })

    for (const width of [600, 768, 900]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)

      const frames = page.locator(`${list} .frame`)
      const count = await frames.count()

      expect(count).toBeGreaterThan(1)

      const last = await frames.nth(count - 1).boundingBox()
      const previous = await frames.nth(count - 2).boundingBox()

      if (last === null || previous === null) throw new Error('нет рамок')
      if (Math.abs(last.y - previous.y) < 1) continue

      const middle = await page.evaluate(
        () => document.documentElement.clientWidth / 2,
      )

      expect(
        Math.abs(last.x + last.width / 2 - middle),
        `ширина ${String(width)}`,
      ).toBeLessThanOrEqual(1)
    }
  })
}

test('Tab от верха главной доходит до полей клуба раньше подвала', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto('/')

  let reached = ''

  for (let step = 0; step < 80 && reached === ''; step += 1) {
    await page.keyboard.press('Tab')
    reached = await page.evaluate(() => {
      const active = document.activeElement

      if (active?.id === 'bid-name') return 'club'
      if (active?.closest('footer')) return 'footer'

      return ''
    })
  }

  expect(reached).toBe('club')
})

for (const path of ['/', '/catalog/', '/product/']) {
  test(`${path}: фокус на названии карточки товара виден`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1366, height: 900 })
    await page.goto(path)

    const link = page.locator('.card .link').first()

    await link.focus()
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Tab')
    await expect(link).toBeFocused()

    const box = await link.boundingBox()

    if (box === null) throw new Error('нет ссылки карточки')

    const clip = {
      x: box.x - 8,
      y: box.y - 8,
      width: box.width + 16,
      height: box.height + 16,
    }
    const focused = await page.screenshot({ clip })

    await link.blur()

    const blurred = await page.screenshot({ clip })

    expect(focused.equals(blurred)).toBe(false)
  })
}
