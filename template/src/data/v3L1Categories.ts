import type { BrandId } from '../components/nav/NavSearchExposed'
import type { MenuCategory } from './mobileMenuData'
import { getMenuTopCategories } from './mobileMenuData'

const QA_AUTO_IDS = new Set([
  'retail_qa_auto_category',
  'outlet_qa_auto_category',
])

/** coach-nav.vercel.app V3 Coach L1 — excludes SIT, Think, Sale, Featured. */
const COACH_V3_L1: MenuCategory[] = [
  { id: 'coach-women', label: 'Women' },
  { id: 'coach-men', label: 'Men' },
  { id: 'bags', label: 'Bags' },
  { id: 'new', label: 'New' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'coachtopia', label: 'Coachtopia' },
]

/** Outlet L1 — same vercel order where live ids exist. */
const OUTLET_V3_L1: MenuCategory[] = [
  { id: 'outlet-women', label: 'Women' },
  { id: 'outlet-men-men', label: 'Men' },
  { id: 'outlet-bags-bags', label: 'Bags' },
  { id: 'outlet-whats-new', label: 'New' },
]

/**
 * V3 L1 category list — fixed vercel order, QA Auto Category appended last.
 * Omits SIT Products, Think, Featured, and Sale from the synced menu.
 */
export function getV3L1Categories(brand: BrandId): MenuCategory[] {
  const ordered = brand === 'coach' ? COACH_V3_L1 : OUTLET_V3_L1
  const qaAuto = getMenuTopCategories(brand).filter((c) => QA_AUTO_IDS.has(c.id))

  return [...ordered, ...qaAuto]
}
