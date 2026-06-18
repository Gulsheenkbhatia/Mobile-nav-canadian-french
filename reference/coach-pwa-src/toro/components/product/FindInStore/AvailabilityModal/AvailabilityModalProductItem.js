import Image from 'toro/components/Image'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import { useTheme } from '@chakra-ui/system'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PropTypes from 'prop-types'

const AvailabilityModalProductItem = ({ item, containerProps }) => {
  const { space, fontFamily, colors } = useTheme()
  const { name, imageUrl, id, variationAttributes } = item || {}
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('FindInStoreWidgetTheme')

  return (
    <Flex {...containerProps}>
      <Flex flex="0 0 25%" maxWidth="25%" pr={space.m}>
        <Image src={imageUrl} alt={name} data-qa="bm_img_pt_img" />
      </Flex>
      <Flex flex="0 0 75%" maxWidth="75%" direction="column">
        <Text
          variant="body-primary"
          size="lg"
          mb="s"
          fontFamily={fontFamily.secondaryNormal}
          sx={styles.ProductTitle}
          data-qa="bm_img_pt_title"
        >
          {name}
        </Text>
        <Text variant="eyebrow-primary" size="md" color={colors.main.gray}>
          <Text
            mr="5px"
            variant="eyebrow-primary"
            color="inherit"
            data-qa="bm_img_pt_styleid_title"
            as="span"
            sx={styles.ProductInfoStyle}
          >
            {formatMessage({
              id: 'pdp.product.styleID',
              defaultMessage: 'STYLE ID:',
            })}
          </Text>
          <Text
            variant="eyebrow-primary"
            color="inherit"
            data-qa="bm_img_pt_styleid_detail"
            as="span"
            sx={styles.ProductInfoStyle}
          >
            {id}
          </Text>
        </Text>
        {variationAttributes?.map?.(({ attributeId, displayName, displayValue }, index) => (
          <Text
            key={`variation-attr-${attributeId}-${index}`}
            variant="eyebrow-primary"
            size="md"
            color={colors.main.gray}
          >
            <Text
              mr="5px"
              variant="eyebrow-primary"
              as="span"
              color="inherit"
              sx={styles.ProductInfoStyle}
              data-qa={`bm_img_pt_${displayName}_title`}
            >
              {displayName}:
            </Text>
            <Text
              variant="eyebrow-primary"
              as="span"
              color="inherit"
              sx={styles.ProductInfoStyle}
              data-qa={`bm_img_pt_${displayName}_detail`}
            >
              {displayValue}
            </Text>
          </Text>
        ))}
      </Flex>
    </Flex>
  )
}

AvailabilityModalProductItem.propTypes = {
  item: PropTypes.object,
  containerProps: PropTypes.object,
}

AvailabilityModalProductItem.defaultProps = {
  item: {},
  containerProps: {},
}

export default AvailabilityModalProductItem
