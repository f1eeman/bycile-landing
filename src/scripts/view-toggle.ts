const VIEWS = new Set(['grid', 'list'])

export function initViewToggle(): void {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-view-toggle]'),
  )

  for (const button of buttons) {
    const id = button.getAttribute('aria-controls')
    const target = id === null ? null : document.getElementById(id)

    if (target === null) continue

    button.addEventListener('click', () => {
      const view = button.dataset['viewToggle']

      if (view === undefined || !VIEWS.has(view)) return

      target.dataset['view'] = view

      for (const other of buttons)
        if (other.getAttribute('aria-controls') === id)
          other.setAttribute(
            'aria-pressed',
            String(other.dataset['viewToggle'] === view),
          )
    })
  }
}
