import type { ImageMetadata } from 'astro'

import bikeBlackHybrid from '@/img/products/bike-black-hybrid.png'
import bikeBlackRoad from '@/img/products/bike-black-road.png'
import bikeBlueFixie from '@/img/products/bike-blue-fixie.png'
import bikeGreenFixie from '@/img/products/bike-green-fixie.png'
import bikeGreenRoad from '@/img/products/bike-green-road.png'
import bikeOrangeRoad from '@/img/products/bike-orange-road.png'
import bikeRedFixie from '@/img/products/bike-red-fixie.png'
import bagCropalm from '@/img/products/bag-cropalm.png'
import saddleDarleyB36q from '@/img/products/saddle-darley-b36q.png'
import saddleGSoul from '@/img/products/saddle-g-soul.png'
import sprocketsSchrima from '@/img/products/sprockets-schrima.png'
import saddleSteedG67 from '@/img/product/saddle-steed-g67.png'

export interface Product {
  readonly name: string
  readonly nameBreak?: number
  readonly specs: readonly [string, string]
  readonly price: string
  readonly oldPrice?: string
  readonly discount?: string
  readonly isNew?: boolean
  readonly image: ImageMetadata
}

const rub = (value: string): string =>
  `${value.replaceAll(' ', '\u00A0')}\u00A0₽`

export const SHOWCASE_BIKES: readonly Product[] = [
  {
    name: 'Peuzer Kropper Apocalypse',
    nameBreak: 14,
    specs: ['24”, сталь Hi-Ten', 'Венгрия'],
    price: rub('75 000'),
    image: bikeBlackHybrid,
  },
  {
    name: 'Schwimm Stingold Oss',
    nameBreak: 7,
    specs: ['20”+24”, сталь', 'США'],
    price: rub('34 000'),
    image: bikeOrangeRoad,
  },
  {
    name: 'Darley Ravidson',
    nameBreak: 6,
    specs: ['20”, сталь', 'Китай'],
    price: rub('23 000'),
    image: bikeGreenFixie,
  },
]

export const CATALOG_BIKES: readonly Product[] = [
  {
    name: 'Peuzer Kropper Apocalypse',
    nameBreak: 14,
    specs: ['24”, сталь Hi-Ten', 'Венгрия'],
    price: rub('75 000'),
    oldPrice: rub('90 000'),
    image: bikeBlackHybrid,
  },
  {
    name: 'Schwimm Stingold Oss',
    nameBreak: 7,
    specs: ['20”+24”, сталь', 'США'],
    price: rub('34 000'),
    oldPrice: rub('40 800'),
    discount: '-20%',
    image: bikeOrangeRoad,
  },
  {
    name: 'Darley Ravidson',
    nameBreak: 6,
    specs: ['20”, сталь', 'Китай'],
    price: rub('23 000'),
    isNew: true,
    image: bikeGreenFixie,
  },
  {
    name: 'Miracle Cyclone Electro',
    nameBreak: 15,
    specs: ['26”, 500W, 5 скоростей, сталь', 'США'],
    price: rub('154 000'),
    oldPrice: rub('184 800'),
    discount: '-20%',
    image: bikeRedFixie,
  },
  {
    name: 'X-back Rainmobile',
    nameBreak: 6,
    specs: ['24”, сталь', 'Китай'],
    price: rub('42 000'),
    isNew: true,
    image: bikeGreenRoad,
  },
  {
    name: 'Peuzer Kropper Apocalypse',
    nameBreak: 14,
    specs: ['20”, сталь', 'Китай'],
    price: rub('23 000'),
    image: bikeBlackHybrid,
  },
  {
    name: 'Peuzer Kropper Apocalypse',
    nameBreak: 14,
    specs: ['24”, сталь Hi-Ten', 'Венгрия'],
    price: rub('75 000'),
    oldPrice: rub('90 000'),
    image: bikeBlackHybrid,
  },
  {
    name: 'Best4You Copter',
    nameBreak: 8,
    specs: ['20”+24”, сталь', 'США'],
    price: rub('34 000'),
    oldPrice: rub('47 600'),
    discount: '-40%',
    image: bikeBlueFixie,
  },
  {
    name: 'Darley Ravidson',
    nameBreak: 6,
    specs: ['20”, сталь', 'Китай'],
    price: rub('23 000'),
    isNew: true,
    image: bikeBlackRoad,
  },
]

export const ACCESSORIES: readonly Product[] = [
  {
    name: 'Седло G-Soul',
    nameBreak: 5,
    specs: ['натуральная кожа', 'доступно в\u00A03 цветах'],
    price: rub('3200'),
    image: saddleGSoul,
  },
  {
    name: 'Сумка на руль Cropalm',
    nameBreak: 13,
    specs: ['15х10х5 cm', 'натуральная кожа'],
    price: rub('1800'),
    image: bagCropalm,
  },
  {
    name: 'Седло Darley B36 q',
    nameBreak: 5,
    specs: ['натуральная кожа', 'доступно в\u00A03 цветах'],
    price: rub('8625'),
    image: saddleDarleyB36q,
  },
  {
    name: 'Звезды Schrima',
    nameBreak: 6,
    specs: ['высокопрочный', 'титановый сплав'],
    price: rub('16780'),
    image: sprocketsSchrima,
  },
]

export interface Review {
  readonly author: string
  readonly date: string
  readonly dateLabel: string
  readonly rating: number
  readonly title: string
  readonly text: string
}

export const STEED_G67 = {
  name: 'Седло Steed G67',
  trail: ['Аксессуары', 'Седла', 'Brooks'],
  rating: 4,
  reviewCount: 9,
  price: rub('7 935'),
  description:
    'В\u00A0комплекте ключ для регулировки, газета с\u00A0полезной информацией и\u00A0рекомендациями по уходу от компании-производителя. Фирменная картонная упаковка.',
  warranty: 'Гарантия 1 год',
  image: saddleSteedG67,
  reviews: [
    {
      author: 'JawPike',
      date: '2018-03-18',
      dateLabel: '18 / 03 / 2018',
      rating: 5,
      title: 'Максимальный комфорт',
      text: 'Очень доволен, что приобрел именно это седло. Качество просто отличное!',
    },
  ] satisfies readonly Review[],
} as const
