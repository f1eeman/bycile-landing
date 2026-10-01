export type NavKey =
  | 'bikes'
  | 'accessories'
  | 'parts'
  | 'workshop'
  | 'delivery'
  | 'contacts'
  | 'test-drive'
  | 'installment'
  | 'club'

export interface NavLink {
  readonly key: NavKey
  readonly label: string
  readonly href: string
}

const BIKES: NavLink = { key: 'bikes', label: 'Велосипеды', href: '/catalog/' }
const ACCESSORIES: NavLink = {
  key: 'accessories',
  label: 'Аксессуары',
  href: '/#parts',
}
const PARTS: NavLink = { key: 'parts', label: 'Запчасти', href: '/#parts' }
const WORKSHOP: NavLink = {
  key: 'workshop',
  label: 'Мастерская',
  href: '/#workshop',
}
const DELIVERY: NavLink = {
  key: 'delivery',
  label: 'Доставка и оплата',
  href: '#contacts',
}

export const HEADER_LINKS: readonly NavLink[] = [
  BIKES,
  ACCESSORIES,
  PARTS,
  WORKSHOP,
  DELIVERY,
  { key: 'contacts', label: 'Контакты', href: '#contacts' },
]

export const FOOTER_LINKS: readonly NavLink[] = [
  BIKES,
  ACCESSORIES,
  PARTS,
  WORKSHOP,
  { key: 'test-drive', label: 'Тест-драйв', href: '/#bikes' },
  DELIVERY,
  { key: 'installment', label: 'Рассрочка', href: '/#bikes' },
  { key: 'club', label: 'Вступление в клуб', href: '/#club' },
]
