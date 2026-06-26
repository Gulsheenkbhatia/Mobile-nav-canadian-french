import type { BrandId } from '../components/nav/NavSearchExposed'
import type { MenuCategory } from './mobileMenuData'

const HOLIDAY_PLACEHOLDER_LABEL = 'Holiday'

/** coach-nav.vercel.app V3 Coach L1 — excludes SIT, Think, Sale, Featured. */
const COACH_V3_L1: MenuCategory[] = [
  { id: 'coach-women', label: 'Women' },
  { id: 'coach-men', label: 'Men' },
  { id: 'bags', label: 'Bags' },
  { id: 'new', label: 'New' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'retail_qa_auto_category', label: HOLIDAY_PLACEHOLDER_LABEL },
  { id: 'coachtopia', label: 'Coachtopia' },
]

/** Outlet L1 — vercel order with Best Sellers after Bags, Clearance after Holiday. */
const OUTLET_V3_L1: MenuCategory[] = [
  { id: 'outlet-women', label: 'Women' },
  { id: 'outlet-men-men', label: 'Men' },
  { id: 'outlet-bags-bags', label: 'Bags' },
  { id: 'outlet-bags-bestselling-bags', label: 'Best Sellers' },
  { id: 'outlet-whats-new', label: 'New' },
  { id: 'outlet_qa_auto_category', label: HOLIDAY_PLACEHOLDER_LABEL },
  { id: 'outlet-clearance', label: 'Clearance' },
]

/**
 * V3 L1 category list — fixed vercel order; holiday placeholder sits above Coachtopia.
 * Omits SIT Products, Think, Featured, and Sale from the synced menu.
 */
export function getV3L1Categories(brand: BrandId): MenuCategory[] {
  if (brand === 'coach') return COACH_V3_L1
  return OUTLET_V3_L1
}
