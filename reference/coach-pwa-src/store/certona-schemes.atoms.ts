import { atom } from 'jotai'

/**
 * Scheme types currently used in the app: `home1_rr`, `product1_rr`, `product2_rr`, `searchrv1_rr`, `nosearch1_rr`, `nosearch2_rr`, `search1_rr`
 */
export type CertonaSchemeType = `${
  | `home${'1' | '2'}`
  | `product${'1' | '2' | '3' | '5'}`
  | 'search1'
  | `nosearch${'1' | '2'}`
  | 'searchrv1'
  | 'emptycart'
  | 'purchase'
  | 'wishlist'
  | 'orderhistory'
  | 'offers'
  | 'addtobag'
  | `sitewide${'1' | '2'}`
  | `sitevisit${'1' | '2'}`
  | `productlisting${'1' | '2' | '3' | '6' | '7'}`}_rr`

export type CertonaScheme = {
  scheme: CertonaSchemeType
  display: string
  experience_id: string
  explanation?: string
  items?: any[]
}

export type CertonaProduct = {
  ID: string
  parentproductid: string
  name: string
  detailURL: string
  description: string
  imageURL: string
  price: {
    currency: string
    fullprice: string
    saleprice: string
    discountpercentage: string
  }
  AverageRating: string
  ReviewCount: string
  Availability: string
  Color: string
  RefinementColor: string
  CategoryLevel1: string
  CategoryLevel2: string
  ProductType: string
  PrimaryCategory: string
  UPC: string
  onFigureImageUrl?: string
  variationId?: string
  isSized?: boolean
}

export type CertonaRequestOptions = {
  pagetype?: CertonaPageType
  recommendations?: boolean
  event?: string
  itemid?: string
  customerid?: string
  devicetype?: 'desktop' | 'tablet' | 'mobile'
  country?: string
  qty?: string
  price?: string
  total?: string
  transactionid?: string
  exitemid?: string
  filter?: CertonaRequestFilter
  categoryID?: string
  force?: boolean
  environment?: 'qa'
  p3recommendations?: boolean
}

/**
 * Page types currently used in the app: `home`, `product`, `search`, `category`, `subcategory`, `addtocart`, `cartremove`,`error`, `search`, `nosearch`, `addtowishlist`, `wishlistremove`
 */
export type CertonaPageType =
  | 'home'
  | 'product'
  | 'search'
  | 'category'
  | 'subcategory'
  | 'quickview'
  | 'cart'
  | 'addtocart'
  | 'cartremove'
  | 'nosearch'
  | 'error'
  | 'account'
  | 'searchrv'
  | 'searchtype'
  | 'emptycart'
  | 'purchase'
  | 'wishlist'
  | 'addtowishlist'
  | 'wishlistremove'
  | 'orderhistory'
  | 'exclusiveoffers'
  | 'productlisting'
  | 'sitewide'
  | 'sitevisit'

type CertonaRequestFilter = {
  language?: string
  warehouse?: string
  categoryid?: string
  shippingdifference?: string
  allcategories?: string
  entrancesource?: string
  Categorylevel1?: string
  Categorylevel2?: string
  Categorylevel3?: string
  [key: string]: string
}

const certonaSchemesAtom = atom<CertonaScheme[]>([])

export const setCertonaSchemesAtom = atom(null, (get, set, newSchemes: CertonaScheme[]) => {
  if (!Array.isArray(newSchemes)) {
    return
  }

  const updatedSchemes = get(certonaSchemesAtom).filter(
    (item) => !newSchemes.some((newItem) => newItem.scheme === item.scheme)
  )
  set(certonaSchemesAtom, updatedSchemes.concat(newSchemes))
})

export const clearSchemeInCertonaAtom = atom(null, (get, set, schemeName: string) => {
  const updatedSchemes = get(certonaSchemesAtom).filter((item) => item.scheme !== schemeName)
  set(certonaSchemesAtom, updatedSchemes)
})

export const certonaScriptLoadedAtom = atom<boolean>(false)

export const setCertonaScriptLoadedAtom = atom(null, (_, set) => {
  set(certonaScriptLoadedAtom, true)
})

export default certonaSchemesAtom
