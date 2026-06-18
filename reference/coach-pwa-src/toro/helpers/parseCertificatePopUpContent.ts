import cheerio from 'toro/lib/cheerio'
import get from 'lodash/get'
import { FetchedContentAsset } from 'toro/types/contentAsset'

type CertificatePopUp = {
  enabled: boolean
  title: string
  image?: string
  body: string
  button: string
}

export default function parseCertificatePopUpContent(
  content: FetchedContentAsset | null,
  locale: string
): null | CertificatePopUp {
  if (!content) return null

  const isOnline =
    get(content, `online.${locale}`) ||
    get(content, `online.${locale.replace(/-/g, '_')}`) ||
    get(content, `online.default`, false)

  const html =
    get(content, `c_body.${locale}.markup`) ||
    get(content, `c_body.${locale.replace(/-/g, '_')}.markup`) ||
    get(content, `c_body.default.markup`)

  if (!isOnline || !html) return null

  try {
    const $ = cheerio.load(html)

    return {
      enabled: true,
      title: $('h2').text(),
      image: $('picture').attr('data-iesrc'),
      body: $('p.at-body-text').text(),
      button: $('a').text(),
    }
  } catch (e) {
    return null
  }
}
