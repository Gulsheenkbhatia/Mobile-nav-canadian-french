import { parseScrapedContentSlots, parseSEOContentSlot } from 'toro/cms/server/contentSlotsParser'
import { parseUgcMarkupFromHeadless } from 'toro/helpers/ugcParser'
import {
  transformLandingHtml,
  extractPromoSlots,
  manageDealModuleSlots,
} from 'toro/helpers/home-parser'
import get from 'lodash/get'
import getViewportByReq from 'toro/helpers/getViewportByReq'
import { transformNativeCssScrollOnServer } from 'toro/cms/server/utils'
import cheerio from 'toro/lib/cheerio'
import fetchContentByPage from 'toro/helpers/fetchContentByPage'
import fetchContentAssets from './fetchContentAssets'
import isExperimentEnabled from 'toro/helpers/isExperimentEnabled'
import { EXPERIMENTS } from 'toro/constants/experiments'

const CLP_LANDING = 'catLanding'
const CLP_GIFT_CARD = 'giftCardLanding'
const CLP_LANDING_PAGE = 'caCategoryLandingPage'

async function fetchPlpContent(req, slots, bypassPreference, inlinePromoTileSlots) {
  try {
    const viewport = getViewportByReq(req)
    const { path, seoId, bottomContentSlot, renderingTemplate } = slots

    const settledPromises = await Promise.allSettled([
      path ? fetchContentByPage(req, path, true, bypassPreference) : null,
      fetchContentAssets(req, [seoId, bottomContentSlot]),
    ])

    const [contentSlotData, contentsRes] = settledPromises.map((result) => result.value)
    const bottomContentAssetData = contentsRes?.data?.[bottomContentSlot] || {}
    const seoContent = contentsRes?.data?.[seoId] || {}
    const siteId = process.env.SITE_ID_US

    const isDealsModuleEnabled =
      isExperimentEnabled(req, EXPERIMENTS.DEALS_MODULE_ON_PLP) && viewport === 'mobile'

    const promoData = extractPromoSlots(
      manageDealModuleSlots(contentSlotData, isDealsModuleEnabled),
      {
        cut: inlinePromoTileSlots,
      }
    )

    const topContentSlotData = parseScrapedContentSlots(
      {
        topContentSlot: {
          content: {
            id: 'category_top_content_slot',
            _type: 'content_slot',
            markup: transformLandingHtml(
              manageDealModuleSlots(contentSlotData, isDealsModuleEnabled),
              {
                viewport,
                ignoreLazy: true,
              }
            ),
            config: {
              device: 'All',
            },
          },
        },
      },
      { siteId, skipLazy: true, viewport }
    )

    const bottomContentSlotData = parseScrapedContentSlots(
      {
        bottomContentSlot: {
          content: {
            id: 'category_bottom_content_slot',
            _type: 'content_slot',
            markup: transformLandingHtml(contentSlotData, { viewport, ignoreLazy: true }),
            config: {
              device: 'All',
            },
          },
        },
      },
      { siteId, skipLazy: true, viewport }
    )

    let contentSlots
    let clpType
    if (renderingTemplate === CLP_LANDING) {
      contentSlots = parseScrapedContentSlots(
        {
          'cat-landing': {
            content: {
              id: 'cat-landing',
              _type: 'content_slot',
              markup: transformLandingHtml(contentSlotData, { viewport }),
            },
          },
        },
        { siteId, viewport }
      )
      clpType = 'cat-landing'
    } else if (renderingTemplate === CLP_GIFT_CARD) {
      contentSlots = parseScrapedContentSlots(
        {
          'gift-slots': {
            content: {
              id: 'gift-slots',
              _type: 'content_slot',
              markup: transformLandingHtml(contentSlotData, { viewport }),
            },
          },
        },
        { siteId, viewport }
      )
      clpType = 'gift-slots'
    } else if (renderingTemplate === CLP_LANDING_PAGE) {
      contentSlots = parseScrapedContentSlots(
        {
          'clp-body': {
            content: {
              id: 'clp-body',
              _type: 'content_slot',
              markup: transformLandingHtml(contentSlotData, { viewport }),
            },
          },
        },
        { siteId, viewport }
      )
      clpType = 'clp-body'
    }

    const topContentMarkup = get(topContentSlotData, 'topContentSlot.content.content')

    if (topContentMarkup) {
      const $ = cheerio.load(topContentMarkup, undefined, false)
      topContentSlotData.topContentSlot.content.content = transformNativeCssScrollOnServer($)
    }

    return {
      ...topContentSlotData,
      promoData,
      seoContent: parseSEOContentSlot(get(seoContent, 'c_body.default.markup', '')),
      seoFacetMetaTags: seoContent?.metaData,
      bottomContentSlotData: {
        ...bottomContentSlotData,
        assetMarkup: get(bottomContentAssetData, 'c_body.default.markup', ''),
      },
      ugcContentSlotData: parseUgcMarkupFromHeadless(contentSlotData) ?? {},
      contentSlots: contentSlots ?? {},
      clpType,
      contentSlotData,
    }
  } catch (err) {
    console.log('fetchPlpContent error:', err)
    return {}
  }
}

export default fetchPlpContent
