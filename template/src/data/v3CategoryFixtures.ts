import type { BrandId } from '../components/nav/NavSearchExposed'
import type { MenuCategoryDetail, MenuSubCategory } from './mobileMenuData'
import { getCategoryDetail, getSubCategory } from './mobileMenuData'
import {
  enrichSparseV3CategoryDetail,
  enrichSparseV3SubCategory,
} from './v3SparseMenuFill'

/** coach-nav.vercel.app V3 Coach Bags L2 — `et` fixture (Shop by Category + Trending). */
const coachBagsV3Detail: MenuCategoryDetail = {
  id: 'bags',
  label: 'Bags',
  sections: [
    {
      id: 'shop-by-category',
      eyebrow: 'Shop by Category',
      showEyebrow: true,
      links: [
        { id: 'view-all', label: 'View All' },
        { id: 'new', label: 'New' },
        { id: 'shoulder', label: 'Shoulder Bags' },
        { id: 'totes', label: 'Totes' },
        { id: 'crossbody', label: 'Crossbody Bags' },
        { id: 'top-handle', label: 'Top Handles & Carryalls' },
        { id: 'clutches', label: 'Clutches' },
        { id: 'backpacks', label: 'Backpacks' },
        { id: 'mens', label: "Men's" },
      ],
    },
    {
      id: 'trending',
      eyebrow: 'Trending',
      links: [
        { id: 'guides', label: 'Bag Guides' },
        { id: 'tabby-shop', label: 'The Tabby Shop' },
        { id: 'originals', label: 'The Coach Originals' },
      ],
    },
  ],
}

/** coach-nav.vercel.app V3 Outlet Bags L2 — flat sections + content spots. */
const outletBagsV3Detail: MenuCategoryDetail = {
  id: 'outlet-bags-bags',
  label: 'Bags',
  sections: [
    {
      id: 'shop-by-category',
      eyebrow: 'Shop by Category',
      showEyebrow: true,
      links: [
        { id: 'outlet-bags-view-all', label: 'View All' },
        { id: 'outlet-bags-totes-and-carryalls', label: 'Totes & Carryalls' },
        { id: 'outlet-bags-shoulder-bags-and-hobos', label: 'Shoulder Bags' },
        { id: 'outlet-bags-crossbody-bags', label: 'Crossbody Bags' },
        { id: 'outlet-bags-satchels-and-top-handles', label: 'Satchels & Top Handles' },
        { id: 'outlet-bags-backpacks', label: 'Backpacks' },
        { id: 'outlet-bags-belt-bags', label: 'Belt Bags & Sling Bags' },
        { id: 'outlet-bags-mini-bags-and-clutches', label: 'Mini Bags' },
        { id: 'outlet-wallets-wristlets', label: 'Wristlets' },
      ],
    },
    {
      id: 'trending',
      eyebrow: 'Trending',
      showEyebrow: true,
      links: [
        { id: 'outlet-bags-bestselling-bags', label: 'Bestsellers' },
        { id: 'outlet-clearance-bags', label: 'Clearance Bags' },
      ],
    },
  ],
}

/** coach-nav.vercel.app V3 Coach New — flat L2 (live menu has no top-level new id). */
const coachNewV3Detail: MenuCategoryDetail = {
  id: 'new',
  label: 'New',
  sections: [
    {
      id: 'shop-by-category',
      eyebrow: 'Shop by Category',
      showEyebrow: true,
      links: [
        { id: 'coach-new-view-all', label: 'View All' },
        { id: 'coach-new-womens', label: "Women's New Arrivals" },
        { id: 'coach-new-mens', label: "Men's New Arrivals" },
        { id: 'coach-new-bags', label: 'Bags' },
        { id: 'coach-new-shoes', label: 'Shoes' },
        { id: 'coach-new-wallets', label: 'Wallets' },
        { id: 'coach-new-accessories', label: 'Accessories' },
      ],
    },
    {
      id: 'trending',
      eyebrow: 'Trending',
      showEyebrow: true,
      links: [
        { id: 'coach-new-tabby', label: 'The Tabby Shop' },
        { id: 'coach-new-coachtopia', label: 'Coachtopia New' },
        { id: 'coach-new-bestsellers', label: 'Bestsellers' },
      ],
    },
  ],
}

/** coach-nav.vercel.app V3 Coach Gifts — flat L2. */
const coachGiftsV3Detail: MenuCategoryDetail = {
  id: 'gifts',
  label: 'Gifts',
  sections: [
    {
      id: 'shop-by-category',
      eyebrow: 'Shop by Category',
      showEyebrow: true,
      links: [
        { id: 'coach-gifts-view-all', label: 'View All' },
        { id: 'coach-gifts-for-her', label: 'Gifts for Her' },
        { id: 'coach-gifts-for-him', label: 'Gifts for Him' },
        { id: 'coach-gifts-under-100', label: 'Gifts Under $100' },
        { id: 'coach-gifts-cards', label: 'Gift Cards' },
        { id: 'coach-gifts-bags', label: 'Bags' },
        { id: 'coach-gifts-accessories', label: 'Accessories' },
      ],
    },
    {
      id: 'trending',
      eyebrow: 'Trending',
      showEyebrow: true,
      links: [
        { id: 'coach-gifts-top', label: 'Top Gifts' },
        { id: 'coach-gifts-personalization', label: 'Personalization' },
      ],
    },
  ],
}

/** coach-nav.vercel.app V3 Outlet New — flat L2. */
const outletNewV3Detail: MenuCategoryDetail = {
  id: 'outlet-whats-new',
  label: 'New',
  sections: [
    {
      id: 'shop-by-category',
      eyebrow: 'Shop by Category',
      showEyebrow: true,
      links: [
        { id: 'outlet-whats-new-view-all', label: 'View All' },
        { id: 'outlet-whats-new-womens', label: "Women's New Arrivals" },
        { id: 'outlet-whats-new-mens', label: "Men's New Arrivals" },
        { id: 'outlet-whats-new-bags', label: 'Bags' },
        { id: 'outlet-whats-new-shoes', label: 'Shoes' },
        { id: 'outlet-whats-new-bestsellers', label: 'Bestsellers' },
        { id: 'outlet-whats-new-clearance', label: 'Clearance' },
      ],
    },
    {
      id: 'trending',
      eyebrow: 'Trending',
      showEyebrow: true,
      links: [
        { id: 'outlet-whats-new-extra-clearance', label: 'Extra 20% Off Clearance' },
        { id: 'outlet-whats-new-coachtopia', label: 'Coachtopia' },
      ],
    },
  ],
}

const coachV3CategoryFixtures: Record<string, MenuCategoryDetail> = {
  bags: coachBagsV3Detail,
  new: coachNewV3Detail,
  gifts: coachGiftsV3Detail,
}

const outletBestSellersV3Detail: MenuCategoryDetail = {
  id: 'outlet-bags-bestselling-bags',
  label: 'Best Sellers',
  sections: [
    {
      id: 'shop',
      eyebrow: 'Bestsellers',
      links: [
        {
          id: 'outlet-bags-bestselling-bags',
          label: 'Shop All Best Sellers',
          href: '/shop/outlet/shop-all/bestsellers',
        },
      ],
    },
  ],
}

const outletClearanceV3Detail: MenuCategoryDetail = {
  id: 'outlet-clearance',
  label: 'Clearance',
  sections: [
    {
      id: 'shop',
      eyebrow: 'Clearance',
      links: [{ id: 'outlet-clearance-view-all', label: 'Shop All Clearance' }],
    },
  ],
}

/** Coach Outlet Deals T1 — flat L2 (no L2 content spots in production). */
const outletDealsV3Detail: MenuCategoryDetail = {
  id: 'outlet-deals',
  label: 'Deals',
  sections: [
    {
      id: 'shop-by-category',
      eyebrow: 'Shop by Category',
      showEyebrow: true,
      links: [
        { id: 'outlet-deals-view-all', label: 'View All Deals' },
        { id: 'outlet-deals-extra-clearance', label: 'Extra 20% Off Clearance' },
        { id: 'outlet-deals-doorbusters', label: 'Doorbusters' },
        { id: 'outlet-deals-bags', label: 'Bags' },
        { id: 'outlet-deals-wallets', label: 'Wallets & Wristlets' },
        { id: 'outlet-deals-women', label: "Women's Deals" },
        { id: 'outlet-deals-men', label: "Men's Deals" },
      ],
    },
    {
      id: 'trending',
      eyebrow: 'Trending',
      showEyebrow: true,
      links: [
        { id: 'outlet-deals-bestsellers', label: 'Bestsellers' },
        { id: 'outlet-deals-clearance', label: 'Clearance' },
      ],
    },
  ],
}

/** Coach Outlet Gifts T1 — promoted from Featured in live menu. */
const outletGiftsV3Detail: MenuCategoryDetail = {
  id: 'outlet-gifts',
  label: 'Gifts',
  sections: [
    {
      id: 'shop-by-category',
      eyebrow: 'Shop by Category',
      showEyebrow: true,
      links: [
        { id: 'outlet-gifts-view-all', label: 'View All' },
        { id: 'outlet-gifts-for-her', label: 'Gifts for Her' },
        { id: 'outlet-gifts-for-him', label: 'Gifts for Him' },
        { id: 'outlet-gifts-under-100', label: 'Gifts Under $100' },
        { id: 'outlet-gifts-cards', label: 'Gift Cards' },
        { id: 'outlet-gifts-bags', label: 'Bags' },
      ],
    },
    {
      id: 'trending',
      eyebrow: 'Trending',
      showEyebrow: true,
      links: [
        { id: 'outlet-gifts-top', label: 'Top Gifts' },
        { id: 'outlet-gifts-bestsellers', label: 'Bestsellers' },
      ],
    },
  ],
}

const outletV3CategoryFixtures: Record<string, MenuCategoryDetail> = {
  'outlet-bags-bags': outletBagsV3Detail,
  'outlet-bags-bestselling-bags': outletBestSellersV3Detail,
  'outlet-whats-new': outletNewV3Detail,
  'outlet-clearance': outletClearanceV3Detail,
  'outlet-deals': outletDealsV3Detail,
  'outlet-gifts': outletGiftsV3Detail,
}

export function getV3CategoryDetail(
  id: string,
  brand: BrandId,
): MenuCategoryDetail | undefined {
  const fixtures =
    brand === 'coach' ? coachV3CategoryFixtures : outletV3CategoryFixtures
  return fixtures[id]
}

/** V3 drill detail — vercel fixtures override synced menu where defined. */
export function resolveV3CategoryDetail(
  id: string,
  brand: BrandId,
): MenuCategoryDetail {
  const detail = getV3CategoryDetail(id, brand) ?? getCategoryDetail(id, brand)
  return enrichSparseV3CategoryDetail(detail, brand)
}

/** V3 L3 drill — enriches single-link sub-categories with placeholder rows. */
export function resolveV3SubCategory(
  categoryId: string,
  subCategoryId: string,
  brand: BrandId,
): MenuSubCategory | undefined {
  const sub = getSubCategory(categoryId, subCategoryId, brand)
  if (!sub) return undefined
  return enrichSparseV3SubCategory(sub, brand)
}
