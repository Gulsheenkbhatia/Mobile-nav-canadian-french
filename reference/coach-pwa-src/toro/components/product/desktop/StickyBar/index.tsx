import { FC, memo, useEffect, useState } from 'react'
import { useStickyBarScroll } from 'toro/hooks/useStickyBarScroll'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import { getStickyBarStateClassName } from 'toro/components/product/desktop/StickyBar/stickyBarStates'
import EvergreenBar from 'toro/components/product/desktop/EvergreenBar'
import ProductThumbnail from 'toro/components/product/desktop/StickyBar/ProductThumbnail'
import PromoRotationBanner from 'toro/components/product/desktop/PromoRotationBanner'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ProductPrice from 'toro/components/product/desktop/ProductPrice'
import StylesProvider from 'toro/components/StylesProvider'
import { useStyles } from '@chakra-ui/react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  rotationPromoMessagesAtom,
  isSizedProductAtom,
  isStickyBarMinimizedAtom,
  isStickyBarScrolledAtom,
} from 'store/pdp.atom'
import AddToBagArea from 'toro/components/product/desktop/AddToBagArea'
import SizeSelector from 'toro/components/product/desktop/StickyBar/SizeSelector'
import PDPColorSwatches from 'toro/components/product/desktop/PDPColorSwatches'
import { useAtom } from 'jotai'

const PARALLAX_THRESHOLD = 0

const Divider = () => {
  const styles = useStyles()
  return <Box className="sticky-bar-divider" sx={styles.stickyBarDivider} />
}

const StickyBar: FC = () => {
  const [isHovered, setIsHovered] = useState(false)
  const isScrolled = useStickyBarScroll(PARALLAX_THRESHOLD)
  const promoArr = useAtomValue(rotationPromoMessagesAtom)
  const rotationPromosEnabled = !!promoArr.length
  const styles = useMultiStyleConfig('StickyBar')
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  const [isStickyBarMinimized, setIsStickyBarMinimized] = useAtom(isStickyBarMinimizedAtom)
  const setIsStickyBarScrolled = useUpdateAtom(isStickyBarScrolledAtom)
  const stickyBarStateClassName = getStickyBarStateClassName(isStickyBarMinimized)

  const isSizedProduct = useAtomValue(isSizedProductAtom)

  useEffect(() => {
    setIsStickyBarMinimized(isScrolled && !isHovered)
    setIsStickyBarScrolled(isScrolled)
  }, [isScrolled && !isHovered])

  return (
    <StylesProvider value={styles}>
      <Box
        sx={styles.stickyBar}
        className={stickyBarStateClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Flex sx={styles.stickyBarTop} className={`${stickyBarStateClassName} sticky-bar--top`}>
          <ProductThumbnail />
          <Divider />
          <ProductPrice />
          <Divider />
          <PDPColorSwatches showInventoryBadge />
          <Divider />
          {isSizedProduct && (
            <>
              <SizeSelector />
              <Divider />
            </>
          )}
          {rotationPromosEnabled && (
            <>
              <PromoRotationBanner />
              <Divider />
            </>
          )}
          <AddToBagArea isMinimized={isStickyBarMinimized} />
        </Flex>
        <Box
          sx={styles.stickyBarBottomWrapper}
          className={`${stickyBarStateClassName} sticky-bar--bottom`}
        >
          <Flex
            sx={styles.stickyBarBottom}
            data-qa={isHovered || !isScrolled ? 'Subbar_Active' : 'Subbar_Inactive'}
          >
            <Flex sx={styles.stickyBarBottomContentWrapper}>
              <EvergreenBar />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </StylesProvider>
  )
}

export default memo(StickyBar)
