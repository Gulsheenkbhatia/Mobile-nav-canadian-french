import cheerio from 'toro/lib/cheerio'
import get from 'lodash/get'
import isObject from 'lodash/isObject'
import pick from 'lodash/pick'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import promoBannerParser from 'toro/components/header/PromoBanner/parser'
import seoMarkupParser from 'toro/components/list/SEOMarkup/parser'
import policyLinksParser from 'toro/components/footer/PolicyLinks/parser'
import getCsrfTokenParser from 'toro/cms/helpers/getCsrfTokenParser'
import withLinksTransform from 'toro/cms/components/withLinksTransform'
import contentLinksParser from 'toro/components/footer/ContentLinks/parser'
import thredUpModalContentParser from 'toro/components/thredUp/ThreadUpModal/parser'
import socialLinksParser from 'toro/components/footer/SocialIcons/parser'
import footerCopyParser from 'toro/components/footer/FooterCopy/parser'
import emailSignupTextParser from 'toro/components/footer/EmailSignupText/parser'
import mobileMenuNavLinksParser from 'toro/components/header/MobileMenuNavLinks/parser'
import {
  freeShippingParser,
  freeShippingReturnParser,
  bundleORCAfreeShippingReturnParser,
  OutletShippingReturnParser,
  FinalSaleShippingReturnParser,
  SetShippingReturnParser,
} from 'toro/components/FreeShipping/parser'
import { topContentParser, bottomContentParser } from 'toro/helpers/parseContent'
import homeBodyParser from 'toro/components/home/HomeBody/parser'
import clpBodyParser from 'toro/components/list/ClpBody/parser'
import catParser from 'toro/components/list/CatContent/parser'
import giftCLPParser from 'toro/components/list/GiftClpContent/parser'
import contentAreaParser from 'toro/components/product/ContentArea/ContentAreaParser'
import normalizerAmplience from 'toro/cms/components/Html/normalizerAmplience'
import normalizerOcapi from 'toro/cms/components/Html/normalizerOcapi'
import normalizerScraped from 'toro/cms/components/Html/normalizerScraped'
import memberExclusiveParser from 'toro/components/list/MemberExclusive/parser'
import productCareParser from 'toro/components/ProductCare/parser'
import organizationSchemaParser from 'toro/components/AppMetaTags/OrganizationSchema/parser'
import callOutParser from 'toro/components/product/CallOutMessage/CallOutParser'
import promoModalParser from 'toro/components/product/PromoModal/promoModalParser'
import navigationFlyoutContentParser from 'toro/components/header/DesktopNavigation/NavigationFlyoutContent/parser'
import inlinePromoTilesParser from 'toro/components/list/ProductsListing/inlinePromoTilesParser'
import liveConnectStylingAdviceParser from 'toro/components/product/ProductMainSection/liveConnectStylingAdviceParser'
import storeButtonsParser from 'toro/components/footer/StoreButtons/parser'
import footerEmailConsentParser from 'toro/components/footer/FooterEmailConsent/parser'
import simpleParser from 'toro/cms/helpers/simpleParser'
import pdpReviewContentParser from 'toro/components/product/mobile/RatingsAndReviewsSection/WriteReviewSection/pdpReviewContentParser'

const defaultParser = (html) => ({ content: html })

const CONTENT_TYPES = [
  {
    schema:
      'https://unpkg.com/dc-accelerators-content-rendering-service/dist/contentTypes/html-editor.json',
    normalizer: normalizerAmplience,
  },
  {
    schema: 'content_asset',
    normalizer: normalizerOcapi,
  },
  {
    schema: 'content_slot',
    normalizer: normalizerScraped,
  },
]

export const CONTENT_SLOT_PARSER = {
  // GLOBAL
  'header-banner-m': promoBannerParser,
  'nav-mobile-additional-content': defaultParser,
  'csrf-token': getCsrfTokenParser,
  'override-content': simpleParser,
  // FOOTER
  'toro-ca-footer-policy-links': policyLinksParser,
  'footer-content-link': contentLinksParser,
  emailSignupText: emailSignupTextParser,
  'toro-ca-footer-social': socialLinksParser,
  'toro-ca-footer-copy': footerCopyParser,
  'toro-coachtopia-footer': footerCopyParser,
  'toro-ca-footer-emailssignuptext': emailSignupTextParser,
  'nav-element-content-area': mobileMenuNavLinksParser,
  'nav-drawer-content-link': contentLinksParser,
  'store-buttons': storeButtonsParser,
  'footer-email-consent': footerEmailConsentParser,
  //ThreadUp
  'thredUP-modal-content': thredUpModalContentParser,
  // PDP
  'free-shipping': freeShippingParser,
  'free-shipping-return': freeShippingReturnParser,
  /** Same markup + parser as `free-shipping-return`; OCAPI content id `fast-shipping-pdp` */
  'fast-shipping-pdp': freeShippingReturnParser,
  'variety-of-payment-pdp': freeShippingReturnParser,
  'outlet-shipping-return': OutletShippingReturnParser,
  'final-sale-shipping-return': FinalSaleShippingReturnParser,
  'set-shipping-return': SetShippingReturnParser,
  'bundle-or-ca-free-shipping-return': bundleORCAfreeShippingReturnParser,
  'pdp-content-area-one-markup': contentAreaParser,
  'pdp-content-area-two-markup': contentAreaParser,
  'pdp-content-area-three-markup': contentAreaParser,
  'pdp-content-area-four-markup': contentAreaParser,
  'product-care': productCareParser,
  'liveConnect-StylingAdvice-new': liveConnectStylingAdviceParser,
  'liveConnect-StylingAdvice': defaultParser,
  'toro-pdp-payment-logo': footerCopyParser,
  // PLP
  category_top_content_slot: topContentParser,
  category_bottom_content_slot: bottomContentParser,
  'call-out-message': callOutParser,
  'promo-modal-content': promoModalParser,
  // SEARCH
  'search-help': defaultParser,
  // HOME
  'home-body': homeBodyParser,
  // CLP
  'clp-body': clpBodyParser,
  'cat-landing': catParser,
  'gift-slots': giftCLPParser,
  // NAVIGATION
  'navigation-flyout': navigationFlyoutContentParser,
  // OTHER
  'membership-exclusive': memberExclusiveParser,
  'ct-animated-globe-icon': defaultParser,
  organization_schema_asset: organizationSchemaParser,
  'inline-promo-tile': inlinePromoTilesParser,
  signupOfferCTA: simpleParser,
  signUpDisclaimer: simpleParser,
  'pdp-review-content': pdpReviewContentParser,
}

export const getNormalizerForContentSlot = (content) => {
  const type = CONTENT_TYPES.find(
    (item) =>
      item.schema === get(content, 'content._meta.schema') ||
      item.schema === get(content, 'content._type')
  )

  if (!type) {
    return null
  }

  return type.normalizer
}

// TOOD: remove this and use the generalized parsers below
export const parseSEOContentSlot = (markup = '') => {
  if (!markup) {
    return {}
  }

  const sanitizedHtml = sanitizeHtmlMarkup(markup)
  return seoMarkupParser(sanitizedHtml)
}

const parseCMSContentSlot = (id, data, options = {}) => {
  let parser = CONTENT_SLOT_PARSER[id]

  // Handle dynamic accordion content slots
  if (!parser && id?.startsWith('accordion-')) {
    parser = contentAreaParser
  }

  if (!parser) {
    return {}
  }

  const normalize = getNormalizerForContentSlot(data)
  if (!normalize) {
    return {}
  }

  let normalizedData
  if (
    id === 'footer-content-link' ||
    id === 'nav-drawer-content-link' ||
    id === 'toro-ca-footer-policy-links'
  ) {
    normalizedData = normalize(data, options.language === 'default' ? 'en-US' : options.language)
  } else {
    normalizedData = normalize(data)
  }
  let { content: markup } = normalizedData
  markup = withLinksTransform(markup, options)
  let content
  if (parser) {
    content = parser(markup, options?.viewport)
    if (!content.styles) {
      // some parser extract their own styles
      const $ = cheerio.load(markup)
      const elId = `#${id}`
      content.styles = $(`${elId} style`).html()
    }
  }

  const pickedProps = pick(data.content, ['online', 'config', 'position', 'tileUP', 'id'])

  return {
    ...data,
    content,
    ...pickedProps,
  }
}

export const parseCMSContentSlots = (slotsObj, options = {}) => {
  if (!isObject(slotsObj)) {
    return {}
  }

  if (!options.siteId) {
    console.error('ERROR: You must assign a site ID to the CMS parser.')
    return {}
  }

  const out = {}
  for (const key of Object.keys(slotsObj)) {
    const slot = slotsObj[key]
    const skipLazy = skipLazyForPromoTile(key, slot)

    out[key] = parseCMSContentSlot(key, slot, { ...options, skipLazy })
  }
  return out
}

/*
 * Skip lazy loading for promo tiles that are likely to be in the viewport.
 * This applies to large screen mobile devices or desktop when the slot position
 * is within the first PROMO_TILE_SKIP_LAZY_THRESHOLD product tiles.
 */
const PROMO_TILE_SKIP_LAZY_THRESHOLD = 4
function skipLazyForPromoTile(key, slot) {
  return key === 'inline-promo-tile' && slot?.content?.position < PROMO_TILE_SKIP_LAZY_THRESHOLD
}

export const parsePreloadImageSrc = (markup, viewport) => {
  const $ = cheerio.load(markup)
  const lcpImageAttribute = `data-${viewport}-lcp-image`
  const preloadImageSrc = $(`[${lcpImageAttribute}]`).attr(lcpImageAttribute)
  if (!!preloadImageSrc) {
    return preloadImageSrc
  }
  return ''
}

export const parseHeroBannerData = (markup, viewport) => {
  const $ = cheerio.load(markup)
  const lcpImageAttribute = `data-${viewport}-lcp-image`
  const pictureSelector = $(`picture[${lcpImageAttribute}]`)

  const src =
    pictureSelector.attr(lcpImageAttribute) || pictureSelector.find('img').attr('src') || ''
  const alt = pictureSelector.find('img').attr('alt') || pictureSelector.attr('data-alt') || ''

  if (src && alt) {
    return { heroImageSrc: src, heroImageAlt: alt }
  }

  return { heroImageSrc: '', heroImageAlt: '' }
}

const parseScrapedContentSlot = (id, data, options = {}) => {
  if (!CONTENT_SLOT_PARSER[id]) {
    return {}
  }

  const normalize = getNormalizerForContentSlot(data)
  if (!normalize) {
    return {}
  }

  let { content: markup } = normalize(data)
  markup = withLinksTransform(markup, options)
  const $ = cheerio.load(markup)
  const parser = CONTENT_SLOT_PARSER[id]
  let content
  if (parser) {
    content = parser(markup, options)
    if (!content.styles) {
      // some parser extract their own styles
      const elId = `#${id}`
      content.styles = $(`${elId} style`).html()
    }
  }

  const config = data.content?.config

  return {
    ...data,
    content,
    config,
  }
}

export const parseScrapedContentSlots = (slotsObj, options = {}) => {
  if (!slotsObj) {
    return {}
  }

  if (!options.siteId) {
    console.error('ERROR: You must assign a site ID to the Scraped parser.')
    return {}
  }

  const out = {}
  for (const key of Object.keys(slotsObj)) {
    const id = slotsObj[key].content.id
    out[key] = parseScrapedContentSlot(id, slotsObj[key], options)
  }
  return out
}
