import { memo } from 'react'
import DrawerOverlay from 'toro/components/DrawerOverlay'
import DrawerContent from 'toro/components/DrawerContent'
import DrawerHeader from 'toro/components/DrawerHeader'
import DrawerBody from 'toro/components/DrawerBody'
import Drawer from 'toro/components/Drawer'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import StylesProvider from 'toro/components/StylesProvider'
import {
  isMegaPDPEligibleAtom,
  isNewMegaPDPEligibleAtom,
  promoCalloutsPDPAtom,
} from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import { useIntl } from 'react-intl'
import useDisclosure from 'toro/hooks/useDisclosure'
import { NavChevronRightBoldIcon } from 'toro/icons'
import { getAllValidTypePromos } from 'toro/helpers/getPromoByType'
import PromoItem from 'toro/components/product/mobile/v7/ViewMorePromoDrawer/PromoItem'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'
import useSwipeDown from 'toro/hooks/useSwipeDown'

function ViewMorePromoDrawer() {
  const styles = useMultiStyleConfig('ViewMorePromoDrawer')
  const promoArr = useAtomValue(promoCalloutsPDPAtom)
  const productId = useProductData('id')
  const analytics = useAnalytics()
  const isMegaPDPEligible = useAtomValue(isMegaPDPEligibleAtom)
  const isNewMegaPDPEligible = useAtomValue(isNewMegaPDPEligibleAtom)
  const { isOpen, onOpen, onClose } = useDisclosure({
    onOpen: () => {
      analytics.send('productInteraction', {
        event: 'product_interaction',
        eventAction: 'promotion drawer open',
        eventLocation: isMegaPDPEligible || isNewMegaPDPEligible ? 'mega product' : 'product',
        eventLabel: productId,
      })
    },
  })
  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeDown({
    onSwipeDown: onClose,
  })
  const { formatMessage } = useIntl()

  const defaultFreeShipping = formatMessage({
    id: 'pdp.freeShipping.fulltext',
    defaultMessage: 'Free Shipping over $75',
  })

  const DEFAULT_PROMO = {
    type: 'FREE_SHIPPING_RETURN',
    text: defaultFreeShipping,
  }

  const promos = getAllValidTypePromos(promoArr)

  promos.push(DEFAULT_PROMO)

  return (
    <>
      <Box sx={styles.viewMorePromoWrapper}>
        <Button onClick={onOpen} sx={styles.viewMorePromoButton} variant="unstyled">
          <Text sx={styles.viewMorePromoText}>
            {formatMessage({
              id: 'pdp.product.viewMorePromoCta',
              defaultMessage: 'View More Promos',
            })}
          </Text>
          <NavChevronRightBoldIcon width="18" height="18" viewBox="0 0 18 18" />
        </Button>

        <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
          <DrawerOverlay sx={styles.drawerOverlay} />

          <DrawerContent
            sx={styles.drawerContent}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <Flex sx={styles.grabHandleWrapper}>
              <Box sx={styles.grabHandle} />
            </Flex>
            <DrawerHeader sx={styles.drawerHeader}>
              <Text sx={styles.drawerHeaderTitle}>
                {formatMessage({
                  id: 'pdp.product.availablePerks',
                  defaultMessage: 'Available Perks',
                })}
              </Text>
            </DrawerHeader>
            <DrawerBody sx={styles.drawerBody}>
              <Box sx={styles.promoListContainer}>
                <Flex sx={styles.promoList}>
                  <StylesProvider value={styles}>
                    {promos.map((promo, index) => (
                      <PromoItem key={index} label={promo.text} />
                    ))}
                  </StylesProvider>
                </Flex>

                <Button onClick={onClose} sx={styles.closeButton}>
                  <Text sx={styles.closeButtonText}>
                    {formatMessage({
                      id: 'pdp.product.closeText',
                      defaultMessage: 'Close',
                    })}
                  </Text>
                </Button>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  )
}

export default memo(ViewMorePromoDrawer)
