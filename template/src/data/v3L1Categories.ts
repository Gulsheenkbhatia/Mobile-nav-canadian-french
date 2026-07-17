import type { BrandId } from '../components/nav/NavSearchExposed'
import type { MenuCategory } from './mobileMenuData'

/** Nav pod T1 list — Coach retail. */
export const COACH_T1_CATEGORIES: MenuCategory[] = [
  { id: 'coach-women', label: 'Women' },
  { id: 'coach-men', label: 'Men' },
  { id: 'bags', label: 'Bags' },
  { id: 'new', label: 'New' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'coach-sale', label: 'Sale' },
  { id: 'coachtopia', label: 'Coachtopia' },
]

/** Nav pod T1 list — Coach Outlet. */
export const OUTLET_T1_CATEGORIES: MenuCategory[] = [
  { id: 'outlet-women', label: 'Women' },
  { id: 'outlet-men-men', label: 'Men' },
  { id: 'outlet-bags-bags', label: 'Bags' },
  { id: 'outlet-deals', label: 'Deals' },
  { id: 'outlet-whats-new', label: 'New' },
  { id: 'outlet-gifts', label: 'Gifts' },
]

/** V3 L1 category list — Nav pod T1 order for pressure testing and prototype. */
export function getV3L1Categories(brand: BrandId): MenuCategory[] {
  if (brand === 'coach') return COACH_T1_CATEGORIES
  return OUTLET_T1_CATEGORIES
}
