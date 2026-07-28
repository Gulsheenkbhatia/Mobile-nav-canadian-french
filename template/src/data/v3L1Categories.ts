import type { BrandId } from '../components/nav/NavSearchExposed'
import type { MenuCategory } from './mobileMenuData'

/** Nav pod T1 list — Coach retail (Canadian French, ca.coach.com/fr). */
export const COACH_T1_CATEGORIES: MenuCategory[] = [
  { id: 'coach-women', label: 'Femme' },
  { id: 'coach-men', label: 'Pour homme' },
  { id: 'bags', label: 'Sacs' },
  { id: 'new', label: 'Nouveauté' },
  { id: 'gifts', label: 'Cadeaux' },
  { id: 'coach-sale', label: 'Soldes' },
  { id: 'coachtopia', label: 'Coachtopia' },
]

/** Nav pod T1 list — Coach Outlet (Canadian French). */
export const OUTLET_T1_CATEGORIES: MenuCategory[] = [
  { id: 'outlet-women', label: 'Femme' },
  { id: 'outlet-men-men', label: 'Pour homme' },
  { id: 'outlet-bags-bags', label: 'Sacs' },
  { id: 'outlet-deals', label: 'Offres' },
  { id: 'outlet-whats-new', label: 'Nouveauté' },
  { id: 'outlet-gifts', label: 'Cadeaux' },
]

/** V3 L1 category list — Nav pod T1 order for pressure testing and prototype. */
export function getV3L1Categories(brand: BrandId): MenuCategory[] {
  if (brand === 'coach') return COACH_T1_CATEGORIES
  return OUTLET_T1_CATEGORIES
}
