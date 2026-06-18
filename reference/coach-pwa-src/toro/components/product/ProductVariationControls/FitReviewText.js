import { memo, useMemo } from 'react'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue } from 'jotai/utils'
import { fitReviewAtom } from 'store/pdp.atom'

const FitReviewText = ({ label, variantType, isSticky, styleVariant }) => {
  const styles = useMultiStyleConfig('ProductVariationCSS', { variant: styleVariant })
  const fitReviewText = useAtomValue(fitReviewAtom)
  const fitReviewTextStyles = useMemo(() => styles.fitReviewText(isSticky), [isSticky])
  if (isEmpty(fitReviewText)) {
    return null
  }
  return (
    <Flex
      flexDirection="column-reverse"
      data-qa={
        label == 'size' ? 'cm_txt_pdt_label_fitreviewsize' : 'cm_txt_pdt_label_fitreviewwidth'
      }
      sx={fitReviewTextStyles}
      className="fit-review-text-container"
    >
      {fitReviewText && (
        <Text variant="body-primary" textAlign="right" sx={styles?.fitReviewTextStyle}>
          {fitReviewText[variantType]}
        </Text>
      )}
    </Flex>
  )
}

FitReviewText.propTypes = {
  label: PropTypes.string,
  variantType: PropTypes.string,
  isSticky: PropTypes.bool,
  styleVariant: PropTypes.string,
}

FitReviewText.defaultProps = {
  lable: '',
  variantType: '',
  isSticky: false,
  styleVariant: '',
}

export default memo(FitReviewText)
