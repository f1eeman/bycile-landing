export function initZoom(): void {
  for (const opener of document.querySelectorAll<HTMLElement>(
    '[data-zoom-open]',
  )) {
    const id = opener.getAttribute('aria-controls')
    const dialog = id === null ? null : document.getElementById(id)

    if (!(dialog instanceof HTMLDialogElement)) continue

    opener.addEventListener('click', () => {
      dialog.showModal()
    })

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close()
    })

    dialog
      .querySelector<HTMLElement>('[data-zoom-close]')
      ?.addEventListener('click', () => {
        dialog.close()
      })
  }
}
