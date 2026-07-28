import { MENU_HREF_TRANSLATIONS } from './menuHrefTranslations'
import { MENU_ID_TRANSLATIONS } from './menuIdTranslations'

export type NavLabelContext = {
  href?: string
  id?: string
  /** L3 links: prefer href over label (retail vs outlet). L2 rows: omit. */
  preferHref?: boolean
}

/**
 * English → Canadian French nav labels.
 * Sourced from ca.coach.com/fr category pages and live nav (Jul 2026).
 */
export const MENU_LABEL_TRANSLATIONS: Record<string, string> = {
  // L1
  Women: 'Femme',
  Men: 'Pour homme',
  Bags: 'Sacs',
  New: 'Nouveauté',
  Gifts: 'Cadeaux',
  Sale: 'Soldes',
  Deals: 'Offres',
  Featured: 'En vedette',
  Holiday: 'Fêtes',
  Coachtopia: 'Coachtopia',
  All: 'Tout',

  // Section eyebrows
  'Shop by Category': 'Magasiner par catégorie',
  Trending: 'Tendances',
  Handbags: 'Sacs à main',
  'Wallets & Wristlets': 'Portefeuilles et wristlets',
  Wallets: 'Portefeuilles',
  'Charms & Straps': 'Breloques et bandoulières',
  Shoes: 'Chaussures',
  Accessories: 'Accessoires',
  'Luxury Accessories': 'de luxe',
  Clothes: 'Vêtements',
  Clothing: 'Vêtements',

  // Common actions
  'View All': 'Afficher tout',
  'View All Deals': 'Voir toutes les offres',
  'View All Bags': 'Voir tous les sacs',
  'View All Accessories': 'Voir tous les accessoires',
  'View All Clothes': 'Voir tous les vêtements',
  'Shop All Best Sellers': 'Magasiner les succès de vente',
  'Shop All Clearance': 'Magasiner toute la liquidation',

  // New / sale
  'New Arrivals': 'Nouveautés',
  'Outlet New Arrivals': 'Nouveautés de la boutique Outlet',
  "Women's New Arrivals": 'Nouveautés pour femmes',
  "Men's New Arrivals": 'Nouveautés pour hommes',
  "Women's Sale": 'Modèles en solde pour femmes',
  "Men's Sale": 'Modèles en solde pour hommes',
  "Women's Deals": 'Offres pour femmes',
  "Men's Deals": 'Offres pour hommes',
  "Men's": 'Hommes',
  Bestsellers: 'Succès de vente',
  'Best Sellers': 'Succès de vente',
  Clearance: 'Liquidation',
  'Clearance Bags': 'Sacs en liquidation',
  'Extra 20% Off Clearance': 'Liquidation : 20 % de rabais supplémentaire',
  Doorbusters: 'Aubaines choc',

  // Women's bags
  'Shoulder Bags': 'Sacs à porté-épaule',
  'Shoulder Bags & Hobos': 'Sacs à porté-épaule et sacs besaces',
  'Crossbody Bags': 'Sacs à porté-croisé',
  'Messenger & Crossbody': 'Sacs messagers et porté-croisé',
  'Totes & Carryalls': 'Sacs fourre-tout et cabas',
  'Top Handles & Carryalls': 'Sac à poignée supérieure et fourre-tout',
  Totes: 'Cabas',
  'Satchels & Top Handles': 'Sacoches et sacs à poignées supérieures',
  Clutches: 'Pochettes',
  Backpacks: 'Sac à dos',
  'Totes & Duffles': 'Cabas et sacs duffles',
  Briefcases: 'Serviettes',
  'Tabby Collection': 'Collection Tabby',
  'Tote Bags': 'Cabas',
  'Belt Bags & Sling Bags': 'Sacs de ceinture et sacs à bandoulière',
  'Mini Bags': 'Sacs minis et pochettes',
  'Ergo Bags': 'Sacs Ergo',

  // Wallets
  'Card Cases': 'Étuis-cartes',
  'Card Cases & Money Clips': 'Porte-cartes et pinces à billets',
  'Card Cases & Wallets': 'Porte-cartes et portefeuilles',
  'Small Wallets': 'Petits portefeuilles',
  'Large Wallets': 'Grands portefeuilles',
  Billfolds: 'Porte-billets',
  Wristlets: 'Wristlets et pochettes',
  'Leather Wristlets': 'Wristlets en cuir',
  'Canvas Wristlets': 'Wristlets en toile',

  // Shoes
  Sandals: 'Sandales',
  Sneakers: 'Chaussures de sport',
  'Flats & Loafers': 'Ballerines et mocassins',
  Heels: 'Talons hauts et escarpins',
  'Boots & Booties': 'Bottes et bottines',
  Boots: 'Bottes',
  'Sandals & Slides': 'Sandales et mules',
  'Loafers & Drivers': 'Flâneurs et mocassins de conduite',

  // Accessories
  'Straps, Charms, and Keyrings': 'Bandoulières, breloques et anneau-clés',
  Jewelry: 'Bijoux',
  'Jewelry & Watches': 'Bijoux et montres',
  Watches: 'Montres',
  Belts: 'Ceintures',
  Eyewear: 'Lunettes',
  Sunglasses: 'Lunettes',
  Fragrance: 'Parfums',
  Perfume: 'Parfums',
  Cologne: 'Eau de cologne',
  'Product Care': 'Produits d’entretien',
  'Tech, Desk, & Travel': 'Technicien, bureau et voyage',
  'Tech & Travel': 'Accessoires de voyage et pour appareils mobiles',
  'Bag Charms': 'Breloques pour sacs',
  'Bag Straps': 'Bandoulières',
  'Bag Charms & Stickers': 'Breloques et autocollants pour sacs',
  'Hats & Gloves': 'Chapeaux, foulards et gants',

  // Apparel
  Tops: 'Hauts',
  Bottoms: 'Bas',
  Dresses: 'Robes',
  'Jackets & Outerwear': 'Vestes et vêtements d’extérieur',
  Outerwear: 'Vêtements d’extérieur',
  'Tops & Bottoms': 'Hauts et bas',
  'New Clothes': 'Vêtements neufs',

  // Gifts
  'Gifts for Her': 'Cadeaux pour elle',
  'Gifts for Him': 'Cadeaux pour lui',
  'Gifts Under $100': 'Cadeaux à moins de 100 $',
  'Gift Cards': 'Cartes-cadeaux',
  'Top Gifts': 'Meilleurs cadeaux',
  Personalization: 'Personnalisation',
  'Gift Sets': 'Ensembles-cadeaux',
  'Travel Size': 'Format voyage',

  // Featured / edits
  Collections: 'Collections',
  Edits: 'Sélections',
  'Coach (Re)loved': 'Coach (Re)loved',
  'Trending Now: Summer Styles': 'Tendances du moment : styles d’été',
  'Bags, Meet Charms': 'Sacs et breloques',
  'Summer Styles': 'Styles d’été',
  'Work Edit': 'Sélection travail',
  'Weekend Edit': 'Sélection week-end',
  'Featured Styles': 'Styles en vedette',
  'The Vacation Edit': 'La sélection vacances',

  // Brand / collections
  'Bag Guides': 'Guides des sacs',
  'The Tabby Shop': 'La boutique Tabby',
  'The Coach Originals': 'Les grands classiques Coach',
  'The New Brooklyn': 'Le nouveau Brooklyn',
  'Coach Originals': 'Coach Originals',
  Brooklyn: 'Brooklyn',
  'Coachtopia New': 'Nouveautés Coachtopia',
  Circularity: 'Le monde de Coachtopia',
  'Made To Order': 'Sur mesure',
  'Made To Order Tabby': 'Tabby sur mesure',
  'Made To Order Rogue': 'Rogue sur mesure',
  Nolita: 'Nolita',

  // Internal / QA (prototype fixtures)
  'SIT Products': 'Produits SIT',
  Think: 'Think',
  'QA Auto L2 Category': 'Catégorie QA Auto L2',
  'QA Auto L3 Category': 'Catégorie QA Auto L3',
  'QA Auto L3 Subcategory': 'Sous-catégorie QA Auto L3',
  'QA Auto L3 Product Set': 'Ensemble de produits QA Auto L3',
  'QA Auto L3 View All': 'Voir tout QA Auto L3',
  'QA Auto L3 Sale Item': 'Article en solde QA Auto L3',
  'QA Auto Sale Category': 'Catégorie QA Auto en solde',
  'QA Auto View All': 'Voir tout QA Auto',
  'QA Auto L2 Category Set Products': 'Ensemble de produits QA Auto L2',
  'QA Auto Test Category': 'Catégorie de test QA Auto',
  'TEST L3 VIEW ALL': 'Voir tout QA Auto L3',
  'QA-L3-VIEW ALL': 'Voir tout QA Auto L3',
  'Copy Goes Here': 'Texte ici',
}

const VIEW_ALL_PREFIX = 'View All '
const GIFTS_UNDER_PREFIX = 'Gifts Under $'

function translateWithPatterns(
  label: string,
  ctx?: NavLabelContext,
): string | undefined {
  if (label.startsWith(VIEW_ALL_PREFIX)) {
    const rest = label.slice(VIEW_ALL_PREFIX.length)
    return `Afficher tout ${translateNavLabel(rest, ctx)}`
  }

  if (label.startsWith(GIFTS_UNDER_PREFIX)) {
    const amount = label.slice(GIFTS_UNDER_PREFIX.length)
    return `Cadeaux à moins de ${amount} $`
  }

  return undefined
}

function translateFromHref(href: string | undefined): string | undefined {
  if (!href) return undefined
  return MENU_HREF_TRANSLATIONS[href]
}

/** Translate a synced or fixture nav label to Canadian French. */
export function translateNavLabel(label: string, ctx?: NavLabelContext): string {
  const trimmed = label.trim()

  if (trimmed === 'View All' || trimmed.startsWith(VIEW_ALL_PREFIX)) {
    const patterned = translateWithPatterns(trimmed, ctx)
    if (patterned) return patterned
    if (trimmed === 'View All') return 'Afficher tout'
  }

  if (ctx?.id) {
    const idLabel = MENU_ID_TRANSLATIONS[ctx.id]
    if (idLabel) return idLabel
  }

  if (ctx?.preferHref) {
    const hrefLabel = translateFromHref(ctx.href)
    if (hrefLabel) return hrefLabel
  }

  const exact = MENU_LABEL_TRANSLATIONS[trimmed]
  if (exact) return exact

  const patterned = translateWithPatterns(trimmed, ctx)
  if (patterned) return patterned

  const hrefLabel = translateFromHref(ctx?.href)
  if (hrefLabel) return hrefLabel

  return trimmed
}
