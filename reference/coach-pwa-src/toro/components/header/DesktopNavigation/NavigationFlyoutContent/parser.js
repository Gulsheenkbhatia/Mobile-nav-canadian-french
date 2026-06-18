import cheerio from 'toro/lib/cheerio'
import { getRelativeUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import compact from 'lodash/compact'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import fetchContentAssets from 'toro/helpers/fetchContentAssets'

function getFlyoutContentIdRecursively(menuData) {
  const result = []

  function getSubCategoryFlyoutContentIdRecursively(category) {
    const flyoutContentId = get(category, 'navFlyoutContentId')
    flyoutContentId && result.push(flyoutContentId)

    if (menuData?.subCategories) {
      menuData.subCategories.forEach((subCategory) =>
        getSubCategoryFlyoutContentIdRecursively(subCategory)
      )
    }
  }

  menuData.forEach((category) => getSubCategoryFlyoutContentIdRecursively(category))

  return uniq(result)
}

export async function fetchFlyoutContents(menuData, req) {
  const ids = getFlyoutContentIdRecursively(menuData)
  const contentSlotsRaw = await fetchContentAssets(req, ids)
  const contentSlots = compact(Object.values(get(contentSlotsRaw, 'data', [])))
  return contentSlots
}

export default function navigationFlyoutContentParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  if (!sanitizedHtml) {
    return {}
  }
  const $ = cheerio.load(sanitizedHtml)

  const $picture = $('picture, img')

  $('a > span').remove()

  let pictureHtml
  try {
    if ($picture?.length) {
      if (!$picture.find('img')?.length) {
        const imgAltText = $picture.attr('data-alt')
        $picture.append(`<img alt="${imgAltText}">`)
      }

      $picture.find('source').each((idx, item) => {
        const $item = $(item)
        $item.attr('srcset', $item.data('srcset'))
      })

      pictureHtml = $.html($picture).replace(/&amp;/g, '&')
    }
  } catch (error) {
    console.error('Error parsing flyout content picture', error)
  }

  const $link = $('a')
  const href = getRelativeUrl($link.attr('href'))
  const title = $link.attr('title')

  return {
    href,
    title,
    pictureHtml,
  }
}
