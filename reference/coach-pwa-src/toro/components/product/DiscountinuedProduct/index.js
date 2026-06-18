import React from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { FormErrorOutlineIcon as ErrorIcon } from 'toro/icons'

function DiscountinuedProduct({ title, recommendedProduct }) {
  const styles = useMultiStyleConfig('DiscountinuedProduct')
  const { formatMessage } = useIntl()
  return (
    <Box sx={styles.discountinuedProductWrapper}>
      <Flex sx={styles.productContentWrapper}>
        <Box sx={styles.productIconErrorWrapper}>
          <ErrorIcon />
        </Box>
        <Box>
          <Text sx={styles.productErrDescription}>
            {formatMessage(
              {
                id: recommendedProduct
                  ? 'pdp.discountinue.DiscountinuedProductWithRecommanded'
                  : 'pdp.discountinue.DiscountinuedProduct',
                defaultMessage: recommendedProduct
                  ? `The ${title} is no longer available but we think you’ll love the`
                  : `The ${title} is no longer available but we think you’ll love`,
              },
              { title }
            )}
            {recommendedProduct && (
              <>
                {' '}
                <Link
                  textDecoration="underline"
                  aria-label={recommendedProduct?.name}
                  href={recommendedProduct?.url}
                  sx={styles.recommendedProductLink}
                >
                  {recommendedProduct?.name}
                </Link>
              </>
            )}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

DiscountinuedProduct.propTypes = {
  title: PropTypes.string,
  recommendedProduct: PropTypes.object,
}

DiscountinuedProduct.defaultProps = {
  title: '',
}

export default withErrorBoundaryWrapper(DiscountinuedProduct)
