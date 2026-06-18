import get from 'lodash/get'

import { SCHEMA_TYPES, SCHEMA_URLS } from 'toro/constants/seo'

type AppData = Record<string, unknown>
type PageData = Record<string, unknown>
type HomeImageObjectSchemaProps = {
  pageData: PageData
  appData: AppData
}

export const HomeImageObjectSchema = ({ pageData, appData }: HomeImageObjectSchemaProps) => {
  const { ORGANIZATION, IMAGE } = SCHEMA_TYPES
  const { BASE_URL } = SCHEMA_URLS

  const url = get(pageData, 'heroImageSrc', '')
  const altText = get(pageData, 'heroImageAlt', '')
  const brand = get(appData, 'brand', '')

  const brandName =
    typeof brand === 'string' && brand.trim()
      ? brand
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : ''

  if (!url || !altText || typeof url !== 'string') {
    return null
  }

  const json = {
    '@context': BASE_URL,
    '@type': IMAGE,
    contentUrl: url.startsWith('//') ? `https:${url}` : url,
    caption: altText,
    creator: { '@type': ORGANIZATION, name: brandName },
    creditText: brandName,
    copyrightNotice: `© ${brandName}`,
    representativeOfPage: true,
  }

  return (
    <script
      type="application/ld+json"
      data-key="HomePageImageObject"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    ></script>
  )
}
