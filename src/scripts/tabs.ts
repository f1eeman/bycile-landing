interface Tabs {
  tabs: HTMLElement[]
  panels: HTMLElement[]
}

const tabsOf = (root: HTMLElement): Tabs | null => {
  const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-tabs-tab]'))
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>('[data-tabs-panel]'),
  )

  if (tabs.length === 0 || tabs.length !== panels.length) return null

  return { tabs, panels }
}

const mark = (tabs: Tabs, index: number, focus: boolean): void => {
  tabs.tabs.forEach((tab, at) => {
    const current = at === index

    tab.setAttribute('aria-selected', String(current))
    tab.tabIndex = current ? 0 : -1

    if (current && focus) tab.focus()
  })

  tabs.panels.forEach((panel, at) => {
    panel.toggleAttribute('hidden', at !== index)
  })
}

const swap = (tabs: Tabs, index: number, focus: boolean): void => {
  const tab = tabs.tabs[index]

  if (tab?.getAttribute('aria-selected') === 'true') {
    if (focus) tab.focus()

    return
  }

  mark(tabs, index, focus)
}

const shiftOf = (key: string, index: number, length: number): number | null => {
  if (key === 'ArrowRight') return (index + 1) % length
  if (key === 'ArrowLeft') return (index - 1 + length) % length
  if (key === 'Home') return 0
  if (key === 'End') return length - 1

  return null
}

const drive = (tabs: Tabs): void => {
  const selected = tabs.tabs.findIndex(
    (tab) => tab.getAttribute('aria-selected') === 'true',
  )

  mark(tabs, Math.max(selected, 0), false)

  tabs.tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      swap(tabs, index, false)
    })

    tab.addEventListener('keydown', (event) => {
      const next = shiftOf(event.key, index, tabs.tabs.length)

      if (next === null) return

      event.preventDefault()
      swap(tabs, next, true)
    })
  })
}

export function initTabs(): void {
  for (const root of document.querySelectorAll<HTMLElement>('[data-tabs]')) {
    const tabs = tabsOf(root)

    if (tabs !== null) drive(tabs)
  }
}
