/**
 * Homepage marketing copy — English keys from homepageContent.live.json.
 * French sourced from ca.coach.com/fr (Jul 2026).
 */
export const HOMEPAGE_COPY_TRANSLATIONS: Record<string, string> = {
  'Moments of becoming.':
    'Des moments de transformation.',
  'Co-created with Gen Z, &Coach explores the in-between, where confidence is built. Singular moments, universally felt, which connect us all.':
    'Créé en collaboration avec la génération Z, &Coach explore des moments de transformation, à la fois singuliers et universels, qui nous relient tous.',
  'Shop Bags': 'Magasiner les sacs',
  'Discover &Coach': 'Découvrir &Coach',
  'Shop Tabby': 'Magasiner Tabby',
  "Shop Women's": 'Magasiner pour femmes',
  'Shop Charms': 'Magasiner les breloques',
  'Shop Shoulder Bags': 'Magasiner les sacs à porté-épaule',
  'Shop All Bags': 'Magasiner tous les sacs',
  'Shop All Wallets': 'Magasiner tous les portefeuilles',
  'Shop Sandals': 'Magasiner les sandales',
  'Shop All Shoes': 'Magasiner toutes les chaussures',
  "Bags that meet you where you are, and where you're headed next.":
    'Des sacs qui vous accompagnent où que vous soyez, et où que vous alliez.',
  "Women's": 'Femmes',
  'Catch up on Coach.': 'Tenez-vous à la page sur Coach.',
  'Two Coach burgundy handbags — a textured hobo with logo and a quilted bag with gold chain strap.':
    'Deux sacs à main bordeaux Coach — un sac besace texturé avec logo et un sac matelassé à chaîne dorée.',
  'Two Coach handbags — a black woven hobo with cherry charm and a cream leather bag with gold chain.':
    'Deux sacs à main Coach — un sac besace tressé noir avec breloque cerise et un sac en cuir crème à chaîne dorée.',
}

export function translateHomepageCopy(text: string): string {
  return HOMEPAGE_COPY_TRANSLATIONS[text] ?? text
}
