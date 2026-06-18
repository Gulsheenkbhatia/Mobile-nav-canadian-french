import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtomValue } from 'jotai/utils'
import { currentLocaleAtom } from 'store/global.atom'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import isEmpty from 'lodash/isEmpty'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

const parseProductName = (productNameSeparators, locale, productName) => {
  if (!locale || isEmpty(productNameSeparators)) {
    return { title: productName, subtitle: '' }
  }

  const delimiters =
    productNameSeparators[locale]?.delimiters ||
    productNameSeparators[locale.replace('-', '_')]?.delimiters ||
    productNameSeparators[locale.replace('_', '-')]?.delimiters ||
    []

  if (!delimiters.length) {
    return { title: productName, subtitle: '' }
  }

  const delimiterMatches = []

  for (const delimiter of delimiters) {
    const escaped = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\s+${escaped}\\s+`, 'i')
    const match = productName.match(regex)

    if (match?.index !== undefined) {
      delimiterMatches.push({
        index: match.index,
        matchLength: match[0].length,
      })
    }
  }

  if (!delimiterMatches.length) {
    return { title: productName, subtitle: '' }
  }

  const earliestMatchIndex = delimiterMatches.sort((a, b) => a.index - b.index)[0].index

  return {
    title: productName.substring(0, earliestMatchIndex).trim(),
    subtitle: productName.substring(earliestMatchIndex).trim(),
  }
}

const ProductTitleV7 = ({ isDiscoverMode }) => {
  const name = useProductData('name')
  const locale = useAtomValue(currentLocaleAtom)

  const styles = useMultiStyleConfig('ProductTitleV7', {
    isDiscoverMode,
  })
  const {
    toggleSiteFeatures: {
      productNameSeparators = {
        'en-US': { delimiters: ['with', 'in'] },
        'en-CA': { delimiters: ['with', 'in'] },
      },
    },
  } = usePreference({
    ToggleSiteFeatures: ['productNameSeparators'],
  })

  if (!name) return null

  const formatted = parseProductName(productNameSeparators, locale, name)

  return (
    <Box as="h1" data-qa="pdp_v7_txt_product_title" sx={styles.productTitleWrapper}>
      <Text as="span" sx={styles.productTitle}>
        {formatted.title}
      </Text>
      {formatted.subtitle ? (
        <Text as="span" display="block" sx={styles.productTitle}>
          {formatted.subtitle}
        </Text>
      ) : null}
    </Box>
  )
}

export default ProductTitleV7
