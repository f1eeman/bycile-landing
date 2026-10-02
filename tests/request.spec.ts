import { expect, test, type Page } from '@playwright/test'

const cardOf = (page: Page) => page.locator('[data-bid-card]')
const nameOf = (page: Page) => page.locator('[data-bid-name]')
const phoneOf = (page: Page) => page.locator('[data-bid-phone]')
const emailOf = (page: Page) => page.locator('[data-bid-email]')
const consentOf = (page: Page) => page.locator('[data-bid-consent]')
const submitOf = (page: Page) =>
  page.locator('[data-bid-form]').getByRole('button', { name: 'Подать заявку' })

const fillValid = async (page: Page) => {
  await nameOf(page).fill('Иван')
  await phoneOf(page).click()
  await page.keyboard.type('991234567')
  await emailOf(page).fill('ivan+club@mail.ru')
  await consentOf(page).check()
}

test.describe('форма клуба', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await cardOf(page).scrollIntoViewIfNeeded()
  })

  test('пустая отправка называет все поля и ставит фокус в первое', async ({
    page,
  }) => {
    await submitOf(page).click()

    await expect(page.locator('#bid-name-error')).toHaveText('Укажите имя')
    await expect(page.locator('#bid-phone-error')).toHaveText(
      'Укажите номер телефона',
    )
    await expect(page.locator('#bid-email-error')).toHaveText('Укажите e-mail')
    await expect(page.locator('#bid-consent-error')).toHaveText(
      'Нужно согласие на обработку данных',
    )
    await expect(nameOf(page)).toBeFocused()
    await expect(cardOf(page)).not.toHaveAttribute('data-bid-state')
  })

  test('фокус предзаполняет девятку, цифры ложатся группами 3–3–2–2', async ({
    page,
  }) => {
    await phoneOf(page).click()

    await expect(phoneOf(page)).toHaveValue('+7 9')

    await page.keyboard.type('011234567')

    await expect(phoneOf(page)).toHaveValue('+7 901 123 45 67')

    await phoneOf(page).press('Backspace')

    await expect(phoneOf(page)).toHaveValue('+7 901 123 45 6')
  })

  test('вставка номера с восьмёркой и скобками нормализуется', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await phoneOf(page).click()
    await page.evaluate(() =>
      navigator.clipboard.writeText('8 (999) 123-45-67'),
    )
    await page.keyboard.press('ControlOrMeta+V')

    await expect(phoneOf(page)).toHaveValue('+7 999 123 45 67')
  })

  test('имя не принимает цифры', async ({ page }) => {
    await nameOf(page).click()
    await page.keyboard.type('Иван1234')

    await expect(nameOf(page)).toHaveValue('Иван')
  })

  test('неполный номер не проходит, ошибка гаснет при вводе', async ({
    page,
  }) => {
    await nameOf(page).fill('Иван')
    await phoneOf(page).click()
    await page.keyboard.type('123')
    await submitOf(page).click()

    await expect(page.locator('#bid-phone-error')).toHaveText(
      'Введите номер полностью',
    )
    await expect(phoneOf(page)).toHaveAttribute('aria-invalid', 'true')
    await expect(phoneOf(page)).toBeFocused()

    await page.keyboard.type('4')

    await expect(phoneOf(page)).toHaveValue('+7 912 34')
    await expect(phoneOf(page)).not.toHaveAttribute('aria-invalid')
  })

  test('Enter на одной предзаполненной девятке просит номер', async ({
    page,
  }) => {
    await nameOf(page).fill('Иван')
    await phoneOf(page).click()

    await expect(phoneOf(page)).toHaveValue('+7 9')

    await page.keyboard.press('Enter')

    await expect(page.locator('#bid-phone-error')).toHaveText(
      'Укажите номер телефона',
    )
    await expect(phoneOf(page)).toHaveAttribute('aria-invalid', 'true')
  })

  test('неверный e-mail не проходит, с плюсом — проходит', async ({ page }) => {
    await fillValid(page)
    await emailOf(page).fill('ivan@')
    await submitOf(page).click()

    await expect(page.locator('#bid-email-error')).toHaveText(
      'Проверьте адрес e-mail',
    )
    await expect(emailOf(page)).toBeFocused()

    await emailOf(page).fill('ivan+club@mail.ru')

    await expect(emailOf(page)).not.toHaveAttribute('aria-invalid')
  })

  test('без согласия не отправляется, с ним — подменяет карточку', async ({
    page,
  }) => {
    await fillValid(page)
    await consentOf(page).uncheck()
    await submitOf(page).click()

    await expect(page.locator('#bid-consent-error')).toHaveText(
      'Нужно согласие на обработку данных',
    )

    await consentOf(page).check()

    await expect(consentOf(page)).not.toHaveAttribute('aria-invalid')

    const logged = page.waitForEvent('console', (message) =>
      message.text().includes('experience'),
    )

    await submitOf(page).click()

    expect((await logged).text()).toContain('experience')
    await expect(cardOf(page)).toHaveAttribute('data-bid-state', 'done')
    await expect(
      cardOf(page).getByRole('heading', { name: 'Заявка отправлена' }),
    ).toBeFocused()
  })

  test('«Закрыть» возвращает пустую форму со стажем по умолчанию', async ({
    page,
  }) => {
    await fillValid(page)
    await page.getByLabel('до 1 года').check()
    await submitOf(page).click()

    await cardOf(page).getByRole('button', { name: 'Закрыть' }).click()

    await expect(cardOf(page)).not.toHaveAttribute('data-bid-state')
    await expect(nameOf(page)).toHaveValue('')
    await expect(phoneOf(page)).toHaveValue('')
    await expect(emailOf(page)).toHaveValue('')
    await expect(consentOf(page)).not.toBeChecked()
    await expect(page.getByLabel('до 5 лет')).toBeChecked()
    await expect(nameOf(page)).toBeFocused()
  })
})
