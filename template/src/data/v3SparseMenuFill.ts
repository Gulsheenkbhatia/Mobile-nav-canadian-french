import type { BrandId } from '../components/nav/NavSearchExposed'
import type {
  MenuCategoryDetail,
  MenuLink,
  MenuLinkSection,
  MenuSubCategory,
} from './mobileMenuData'
import { isDuplicateNavLinkLabel } from '../utils/navLinkDedup'

const MIN_DRILL_LINKS = 6

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function link(id: string, label: string): MenuLink {
  return { id, label }
}

function totalLinkCount(sections: MenuLinkSection[]): number {
  return sections.reduce((sum, section) => sum + section.links.length, 0)
}

function placeholderLinksForTitle(
  title: string,
  brand: BrandId,
): MenuLink[] {
  const key = title.trim().toLowerCase()

  if (key.includes('qa auto')) {
    return [
      link('qa-placeholder-l3-a', 'QA Auto L3 Category'),
      link('qa-placeholder-l3-b', 'QA Auto L3 Subcategory'),
      link('qa-placeholder-l3-c', 'QA Auto L3 Product Set'),
      link('qa-placeholder-l3-d', 'QA Auto L3 View All'),
      link('qa-placeholder-l3-e', 'QA Auto L3 Sale Item'),
    ]
  }

  if (/\bview all\b/.test(key)) {
    return brand === 'outlet'
      ? [
          link('outlet-fill-bags', 'Bags'),
          link('outlet-fill-wallets', 'Wallets'),
          link('outlet-fill-shoes', 'Shoes'),
          link('outlet-fill-clothing', 'Clothing'),
          link('outlet-fill-accessories', 'Accessories'),
          link('outlet-fill-clearance', 'Clearance'),
        ]
      : [
          link('coach-fill-bags', 'Bags'),
          link('coach-fill-wallets', 'Wallets'),
          link('coach-fill-shoes', 'Shoes'),
          link('coach-fill-clothing', 'Clothing'),
          link('coach-fill-accessories', 'Accessories'),
          link('coach-fill-jewelry', 'Jewelry'),
        ]
  }

  if (key.includes('new')) {
    return brand === 'outlet'
      ? [
          link('outlet-fill-womens-new', "Women's New Arrivals"),
          link('outlet-fill-mens-new', "Men's New Arrivals"),
          link('outlet-fill-new-bags', 'Bags'),
          link('outlet-fill-new-shoes', 'Shoes'),
          link('outlet-fill-bestsellers', 'Bestsellers'),
          link('outlet-fill-clearance', 'Clearance'),
        ]
      : [
          link('coach-fill-womens-new', "Women's New Arrivals"),
          link('coach-fill-mens-new', "Men's New Arrivals"),
          link('coach-fill-new-bags', 'Bags'),
          link('coach-fill-new-shoes', 'Shoes'),
          link('coach-fill-new-wallets', 'Wallets'),
          link('coach-fill-new-accessories', 'Accessories'),
        ]
  }

  if (key.includes('gift')) {
    return [
      link('coach-fill-gifts-her', 'Gifts for Her'),
      link('coach-fill-gifts-him', 'Gifts for Him'),
      link('coach-fill-gifts-under-100', 'Gifts Under $100'),
      link('coach-fill-gift-cards', 'Gift Cards'),
      link('coach-fill-gifts-bags', 'Bags'),
      link('coach-fill-gifts-accessories', 'Accessories'),
    ]
  }

  if (key.includes('sale') || key.includes('clearance')) {
    return brand === 'outlet'
      ? [
          link('outlet-fill-sale-bags', 'Bags'),
          link('outlet-fill-sale-wallets', 'Wallets'),
          link('outlet-fill-sale-women', "Women's Sale"),
          link('outlet-fill-sale-men', "Men's Sale"),
          link('outlet-fill-sale-shoes', 'Shoes'),
          link('outlet-fill-extra-clearance', 'Extra 20% Off Clearance'),
        ]
      : [
          link('coach-fill-sale-bags', 'Bags'),
          link('coach-fill-sale-wallets', 'Wallets'),
          link('coach-fill-sale-women', "Women's Sale"),
          link('coach-fill-sale-men', "Men's Sale"),
          link('coach-fill-sale-shoes', 'Shoes'),
          link('coach-fill-sale-accessories', 'Accessories'),
        ]
  }

  if (key.includes('wallet') || key.includes('card case')) {
    return [
      link('coach-fill-wallets-card-cases', 'Card Cases'),
      link('coach-fill-wallets-wristlets', 'Wristlets'),
      link('coach-fill-wallets-billfolds', 'Billfolds'),
      link('coach-fill-wallets-large', 'Large Wallets'),
      link('coach-fill-wallets-new', 'New'),
    ]
  }

  if (key.includes('wristlet')) {
    return [
      link('coach-fill-wristlets-view-all', 'View All'),
      link('coach-fill-wristlets-new', 'New'),
      link('coach-fill-wristlets-leather', 'Leather Wristlets'),
      link('coach-fill-wristlets-canvas', 'Canvas Wristlets'),
      link('coach-fill-wristlets-sale', 'Sale'),
    ]
  }

  if (key.includes('charm') || key.includes('strap')) {
    return [
      link('coach-fill-charms-view-all', 'View All'),
      link('coach-fill-charms-bag-charms', 'Bag Charms'),
      link('coach-fill-charms-straps', 'Bag Straps'),
      link('coach-fill-charms-new', 'New'),
      link('coach-fill-charms-bestsellers', 'Bestsellers'),
    ]
  }

  if (key.includes('cloth') || key.includes('ready-to-wear') || key.includes('wear')) {
    return [
      link('coach-fill-rtw-view-all', 'View All'),
      link('coach-fill-rtw-outerwear', 'Outerwear'),
      link('coach-fill-rtw-tops', 'Tops'),
      link('coach-fill-rtw-dresses', 'Dresses'),
      link('coach-fill-rtw-new', 'New'),
    ]
  }

  if (key.includes('perfume') || key.includes('cologne') || key.includes('fragrance')) {
    return [
      link('coach-fill-fragrance-view-all', 'View All'),
      link('coach-fill-fragrance-bestsellers', 'Bestsellers'),
      link('coach-fill-fragrance-travel', 'Travel Size'),
      link('coach-fill-fragrance-gifts', 'Gift Sets'),
      link('coach-fill-fragrance-new', 'New'),
    ]
  }

  if (key.includes('accessor')) {
    return [
      link('coach-fill-accessories-view-all', 'View All'),
      link('coach-fill-accessories-jewelry', 'Jewelry & Watches'),
      link('coach-fill-accessories-hats', 'Hats & Gloves'),
      link('coach-fill-accessories-belts', 'Belts'),
      link('coach-fill-accessories-new', 'New'),
    ]
  }

  if (key.includes('collection')) {
    return [
      link('coach-fill-collections-tabby', 'The Tabby Shop'),
      link('coach-fill-collections-brooklyn', 'Brooklyn'),
      link('coach-fill-collections-originals', 'Coach Originals'),
      link('coach-fill-collections-coachtopia', 'Coachtopia'),
      link('coach-fill-collections-new', 'New'),
    ]
  }

  if (key.includes('coachtopia') || key.includes('circularity')) {
    return [
      link('coach-fill-coachtopia-bags', 'Bags'),
      link('coach-fill-coachtopia-accessories', 'Accessories'),
      link('coach-fill-coachtopia-clothes', 'Clothes'),
      link('coach-fill-coachtopia-new', 'New'),
      link('coach-fill-coachtopia-all', 'View All'),
    ]
  }

  if (key.includes('bestseller')) {
    return [
      link('outlet-fill-bestsellers-bags', 'Bags'),
      link('outlet-fill-bestsellers-wallets', 'Wallets'),
      link('outlet-fill-bestsellers-women', 'Women'),
      link('outlet-fill-bestsellers-men', 'Men'),
      link('outlet-fill-bestsellers-clearance', 'Clearance'),
    ]
  }

  if (key.includes('edit')) {
    return [
      link('coach-fill-edits-summer', 'Summer Styles'),
      link('coach-fill-edits-charms', 'Bags, Meet Charms'),
      link('coach-fill-edits-work', 'Work Edit'),
      link('coach-fill-edits-weekend', 'Weekend Edit'),
      link('coach-fill-edits-new', 'New'),
    ]
  }

  if (key.includes('made to order') || key.includes('custom')) {
    return [
      link('coach-fill-mto-tabby', 'Made To Order Tabby'),
      link('coach-fill-mto-rogue', 'Made To Order Rogue'),
      link('coach-fill-mto-bags', 'Bags'),
      link('coach-fill-mto-accessories', 'Accessories'),
      link('coach-fill-mto-gifts', 'Gifts'),
    ]
  }

  if (key.includes('sit') || key.includes('think')) {
    return [
      link(`${slugify(title)}-placeholder-a`, 'Featured Styles'),
      link(`${slugify(title)}-placeholder-b`, 'New Arrivals'),
      link(`${slugify(title)}-placeholder-c`, 'Bestsellers'),
      link(`${slugify(title)}-placeholder-d`, 'Bags'),
      link(`${slugify(title)}-placeholder-e`, 'Accessories'),
    ]
  }

  const prefix = slugify(title) || 'category'
  return [
    link(`${prefix}-placeholder-a`, 'Bags'),
    link(`${prefix}-placeholder-b`, 'Wallets'),
    link(`${prefix}-placeholder-c`, 'Shoes'),
    link(`${prefix}-placeholder-d`, 'Clothing'),
    link(`${prefix}-placeholder-e`, 'Accessories'),
    link(`${prefix}-placeholder-f`, 'New'),
  ].filter((candidate) => candidate.label.toLowerCase() !== key)
}

function mergeWithPlaceholders(
  sections: MenuLinkSection[],
  title: string,
  brand: BrandId,
): MenuLinkSection[] {
  if (totalLinkCount(sections) > 1) return sections

  const baseSection = sections[0] ?? {
    id: 'shop-by-category',
    eyebrow: 'Shop by Category',
    showEyebrow: true,
    links: [],
  }

  const primary = baseSection.links[0]
  const placeholders = placeholderLinksForTitle(title, brand)
  const seen = new Set<string>()
  const links: MenuLink[] = []

  for (const candidate of primary ? [primary, ...placeholders] : placeholders) {
    if (isDuplicateNavLinkLabel(candidate.label, title)) continue
    const dedupeKey = candidate.label.trim().toLowerCase()
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)
    links.push(candidate)
    if (links.length >= MIN_DRILL_LINKS) break
  }

  return [
    {
      ...baseSection,
      id: baseSection.id || 'shop-by-category',
      eyebrow: baseSection.eyebrow ?? 'Shop by Category',
      showEyebrow: baseSection.showEyebrow ?? true,
      links,
    },
  ]
}

export function enrichSparseV3Sections(
  sections: MenuLinkSection[],
  title: string,
  brand: BrandId,
): MenuLinkSection[] {
  return mergeWithPlaceholders(sections, title, brand)
}

export function enrichSparseV3CategoryDetail(
  detail: MenuCategoryDetail,
  brand: BrandId,
): MenuCategoryDetail {
  if (detail.subCategories?.length) return detail
  if (!detail.sections?.length) return detail

  return {
    ...detail,
    sections: enrichSparseV3Sections(detail.sections, detail.label, brand),
  }
}

export function enrichSparseV3SubCategory(
  sub: MenuSubCategory,
  brand: BrandId,
): MenuSubCategory {
  return {
    ...sub,
    sections: enrichSparseV3Sections(sub.sections, sub.label, brand),
  }
}
