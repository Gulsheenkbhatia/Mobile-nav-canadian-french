const proxyPagesPatterns = [
  '/gifts/gift-services',
  '/products/gift-certificate',
  '/shop/customization',
  '/shop/gift-guide/gift-cards',
  'insider=true',
  'signin=true',
  '/shop/gifts/gift-cards',
  '/sw-scoop',
  '/shop/gift-cards',
  '/shop/cartes-cadeaux',
  '/products/carte-cadeau',
  `/courage-to-be-real`,
  `/tomorrows-vintage`,
  `/coach-icons`,
  `/coach-x-cyril`,
  `/shop/new-featured-runway-fall-22`,
  `/shop/nouveautes-en-vedette-defile-automne`,
  `/shop/neu-highlights-laufsteg-herbst`,
  `/shop/nuevo-destacado-desfile-otono`,
  `/shop/novita-in-vetrina-sfilata-autunno`,
  `/stores/store-locator`,
]

const isProxiedPath = (path) =>
  path && path.length && proxyPagesPatterns.some((pattern) => path.includes(pattern))

export default isProxiedPath
