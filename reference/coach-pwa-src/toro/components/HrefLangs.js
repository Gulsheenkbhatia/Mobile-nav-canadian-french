import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useMemo, memo } from 'react'

export const deriveHreflangs = (hreflangs) =>
  Object.entries(hreflangs).map(([language, href]) => ({
    language: language.includes('default') ? 'x-default' : language,
    href,
  }))

const getAttrValueFromHtml = (html, attrName) => {
  const regExp = new RegExp(`${attrName}="(.+?)"`)
  return get(html.match(regExp), '1', '')
}

export const getHrefLinksArray = (hreflang) => {
  if (typeof hreflang !== 'undefined') {
    const arrayLinks = hreflang?.split('\n')?.map((item, index) => {
      if (item?.trim() !== '') {
        const hreflanguage = getAttrValueFromHtml(item, 'hreflang')
        const href = getAttrValueFromHtml(item, 'href')
        return (
          <link
            key={`${hreflang}-${index}`}
            rel="alternate"
            hrefLang={hreflanguage}
            href={decodeURI(href)}
          />
        )
      }
      return null
    })
    return arrayLinks
  }
}

function HrefLangs({ pageData }) {
  const router = useRouter()
  const pageType = get(pageData, 'pageType', '')

  const {
    seoSitePreferences: { baseURLsForLocales, homePageCustomHreflang: homePageCustom },
  } = usePreference({
    SEOSitePreferences: ['baseURLsForLocales', 'homePageCustomHreflang'],
  })

  const plpHreflangs = get(pageData, 'plpHreflangURL')
  const pdpHreflangs = get(pageData, 'pickedProps.promotionData.canonicals')

  const customCanonicalTag = useMemo(() => {
    if (pageType === 'PLP') {
      const customValue = get(pageData, 'c_customHreflang')
      return getHrefLinksArray(customValue)
    } else if (pageType === 'PDP') {
      const customVariantGroupValue = get(
        pageData,
        'defaultVariantGroup.customAttributes.c_customHreflang'
      )
      const customDefaultVariantValue = get(
        pageData,
        'defaultVariant.customAttributes.c_customHreflang'
      )
      const customValue = get(pageData, 'custom.c_customHreflang')
      return getHrefLinksArray(customValue || customDefaultVariantValue || customVariantGroupValue)
    } else if (pageType === 'HP') {
      return getHrefLinksArray(homePageCustom)
    }
  }, [homePageCustom, pageData])

  const hreflangs = useMemo(() => {
    if (pageType === 'PLP' && plpHreflangs) {
      return deriveHreflangs(plpHreflangs)
    } else if (pageType === 'PDP' && pdpHreflangs) {
      return deriveHreflangs(pdpHreflangs)
    } else if (baseURLsForLocales) {
      return Object.keys(baseURLsForLocales).map((key) => {
        const hostname = get(baseURLsForLocales[key], 'hostname', '')
        let targetLocale = key !== 'en_US' ? get(baseURLsForLocales[key], 'targetlocale', '') : ''
        targetLocale = targetLocale.replace(/\//g, '')

        const uri = router.asPath

        if (targetLocale !== '') {
          targetLocale = '/' + targetLocale
        }

        const href = `https://${hostname}${targetLocale}${uri}`.split('?')[0]
        return {
          language: key.replace('_', '-'),
          href,
        }
      })
    }
  }, [baseURLsForLocales])

  if (pageType === 'Search') {
    return null
  }

  return (
    <Head>
      {customCanonicalTag
        ? customCanonicalTag.map((e) => e)
        : hreflangs?.map((hreflang, index) => (
            <link
              key={`${hreflang.language}-${index}`}
              rel="alternate"
              hrefLang={get(hreflang, 'language')}
              href={decodeURI(get(hreflang, 'href'))}
            />
          ))}
    </Head>
  )
}

export default memo(HrefLangs)
