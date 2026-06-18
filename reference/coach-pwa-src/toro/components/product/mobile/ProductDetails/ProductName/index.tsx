import useStyleConfig from 'toro/hooks/useStyleConfig'
import useProductData from 'toro/hooks/useProductData'
import usePreference from 'toro/hooks/usePreference_new'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import isEmpty from 'lodash/isEmpty'
import { useAtomValue } from 'jotai/utils'
import { currentLocaleAtom } from 'store/global.atom'

const parseProductName = (productNameSeparators, locale, productName) => {
  if (!locale || isEmpty(productNameSeparators)) {
    return { title: productName, subtitle: '' }
  }

  // locale.replace('-', '_') is used to handle the case where the locale is in the format of 'en-US'
  // but the productNameSeparators preference is in the format of 'en_US'
  // for KS locale is 'en_US' what is causing another issue of not using default value
  const delimiters =
    productNameSeparators[locale]?.delimiters ||
    productNameSeparators[locale.replace('-', '_')]?.delimiters ||
    productNameSeparators[locale.replace('_', '-')]?.delimiters ||
    []

  if (delimiters.length === 0) {
    return { title: productName, subtitle: '' }
  }

  // Find all delimiter matches with their positions
  const delimiterMatches = []
  for (const delimiter of delimiters) {
    // Escape special regex characters in delimiter
    const escapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Create regex pattern to match delimiter surrounded by word boundaries or spaces
    const regexPattern = new RegExp(`\\s+${escapedDelimiter}\\s+`, 'i')
    const match = productName.match(regexPattern)

    if (match && match.index !== undefined) {
      delimiterMatches.push({
        delimiter,
        index: match.index,
        matchedText: match[0],
        matchLength: match[0].length,
      })
    }
  }

  if (delimiterMatches.length === 0) {
    return { title: productName, subtitle: '' }
  }

  // Sort matches by position to find the earliest one
  const earliestMatchIndex = delimiterMatches.sort((a, b) => a.index - b.index)[0].index

  const title = productName.substring(0, earliestMatchIndex).trim()
  const subtitle = productName.substring(earliestMatchIndex).trim()

  return { title, subtitle }
}

const ProductName = () => {
  const styles = useStyleConfig('ProductNameStyles')
  const name = useProductData('name')
  const locale = useAtomValue(currentLocaleAtom)

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

  if (!name) {
    return null
  }

  const formattedProductName = parseProductName(productNameSeparators, locale, name)

  return (
    <Box
      as="h1"
      data-qa="pdp_txt_pdt_title"
      className="product-name-container"
      sx={styles.productNameContainer}
    >
      <Text as="span" sx={styles.productName}>
        {formattedProductName.title}
      </Text>
      {formattedProductName.subtitle && (
        <Text as="span" display="block" sx={styles.productSubtitle}>
          {formattedProductName.subtitle}
        </Text>
      )}
    </Box>
  )
}

export default ProductName
