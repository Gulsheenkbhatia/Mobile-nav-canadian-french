import Text from 'toro/components/Text'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import isObject from 'lodash/isObject'

const ProductSizeControlText = ({ text, selectedCountry }) => {
  const styles = useMultiStyleConfig('ProductVariationCSS')

  if (isObject(text)) {
    const textElements = text[selectedCountry]?.split('/') || []

    return textElements.map((item, index) => (
      <Text
        key={index}
        size="xxs"
        variant={textElements.length > 1 ? 'size-variation' : 'cta-primary'}
        sx={styles.sizeButtonText}
      >
        {item}
      </Text>
    ))
  }

  return text
}

export default ProductSizeControlText
