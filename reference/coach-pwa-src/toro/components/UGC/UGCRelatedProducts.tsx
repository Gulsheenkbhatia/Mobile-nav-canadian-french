import type { UGCItem, UGCActivateUnit } from 'toro/components/UGC/types'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useTheme from 'toro/hooks/useTheme'
import useViewportType from 'toro/hooks/useViewportType'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import Box from 'toro/components/Box'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { SystemStyleObject } from '@chakra-ui/react'

interface UGCRelatedProductsProps {
  item: UGCItem
}

const UGCRelatedProducts = ({ item }: UGCRelatedProductsProps) => {
  const styles = useMultiStyleConfig('UGCStyling')
  const theme = useTheme()
  const { isDesktop } = useViewportType()
  const { formatMessage } = useIntl()

  return (
    <Box ml={isDesktop ? '24px' : '16px'} mt={!isDesktop ? '24px' : '0'}>
      <Text fontSize={theme.fontSizes.md} mb="15px" data-qa="ugc_txt_image_container_shop_the_look">
        {formatMessage({ id: 'pdp.product.wyngShopTheLook', defaultMessage: 'Shop The Look' })}
      </Text>
      <Box overflow="scroll" sx={styles.productSlider(isDesktop)}>
        {item?.activate_units.map((unit) => (
          <RelatedUnit key={unit?.id} unit={unit} sx={styles.unitText} />
        ))}
      </Box>
    </Box>
  )
}

interface RelatedUnitProps {
  unit: UGCActivateUnit
  sx?: SystemStyleObject
}

const RelatedUnit = ({ unit, sx }: RelatedUnitProps) => {
  const analytics = useAnalytics()
  const relativeURL = unit?.click_through_url.split('/').splice(3).join('/')

  const onClick = useCallback(() => {
    analytics.send('UGCUgcInteraction', {
      eventLocation: 'product tile',
      eventAction: 'ugc product click',
      eventLabel: unit?.external_id,
    })
  }, [unit?.external_id])

  return (
    <Link
      key={unit.id}
      variant="unstyled"
      href={`/${relativeURL}`}
      onClick={onClick}
      sx={{ display: 'flex', flexDirection: 'column', width: '115px', marginBottom: '16px' }}
      data-qa="ugc_link_image_container_shop_the_look_product"
    >
      <Box
        height="143px"
        width="115px"
        background={`url(${unit?.image_url}) center`}
        backgroundSize="cover"
      ></Box>
      <Text sx={sx}>{unit?.name}</Text>
    </Link>
  )
}

export default UGCRelatedProducts
