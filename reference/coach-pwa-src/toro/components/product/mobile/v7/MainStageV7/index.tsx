import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import ProductGalleryV7 from 'toro/components/product/mobile/v7/ProductGalleryV7'
import ProductImageSwatchesV7Container from 'toro/components/product/mobile/v7/ProductImageSwatchesV7Container'
import useFullProductMedia from 'toro/components/product/mobile/v7/hooks/useFullProductMedia'
import useAnalytics from 'toro/analytics/useAnalytics'
import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

import TouchIcon from 'toro/icons/touch-icon.svg'

import {
  isPdpV7TapToDiscoverImmersiveAtom,
  promoCalloutsPDPAtom,
  productCarouselActiveIndexAtom,
  productCarouselGoToSlideRequestAtom,
} from 'store/pdp.atom'
import {
  getFirstHeroGalleryMediaIndex,
  getHeroGalleryMediaIndices,
  useHeroGalleryEntries,
} from 'toro/components/product/mobile/v7/helpers/heroGallery'
import StylesProvider from 'toro/components/StylesProvider'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useProductData from 'toro/hooks/useProductData'
import ProductPrice from 'toro/components/product/desktop/ProductPrice'
import ProductActionsArea from 'toro/components/product/mobile/v7/ProductActions/ProductActionsArea'
import ProductTitle from 'toro/components/product/mobile/v7/ProductTitle'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import {
  PdpV7EntranceLayer,
  PDP_V7_ENTRANCE_DELAY,
} from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation'
import DiscoverModeOverlay from 'toro/components/product/mobile/v7/MainStageV7/DiscoverModeOverlay'
import ViewMorePromoDrawer from 'toro/components/product/mobile/v7/ViewMorePromoDrawer'
import FinalSaleProductMessage from 'toro/components/product/mobile/v7/FinalSaleProductMessage'
import getPromoByType, { PROMO_TYPES } from 'toro/helpers/getPromoByType'

const MainStageV7 = () => {
  const { formatMessage } = useIntl()
  const setTapToDiscoverImmersive = useUpdateAtom(isPdpV7TapToDiscoverImmersiveAtom)
  const [isDiscoverMode, setIsDiscoverMode] = useState(false)
  const [activeIdx, setActiveIdx] = useAtom(productCarouselActiveIndexAtom)
  const setGoToSlideRequest = useUpdateAtom(productCarouselGoToSlideRequestAtom)
  const analytics = useAnalytics()
  const fullMedias = useFullProductMedia()
  const heroGalleryEntries = useHeroGalleryEntries()
  const selectedVariantId = useSelectedVariantData('id') || ''
  const masterId = useProductData('masterId')
  const promoCallouts = useAtomValue(promoCalloutsPDPAtom)
  const ipxPromotions = useMemo(
    () => [
      ...getPromoByType(promoCallouts, PROMO_TYPES.IPX1),
      ...getPromoByType(promoCallouts, PROMO_TYPES.IPX2),
    ],
    [promoCallouts]
  )

  const [enableTapToDiscoverMaster, enableTapToDiscoverVariant] = useProductData([
    'custom.c_enableTapToDiscover',
    'defaultVariant.customAttributes.c_enableTapToDiscover',
  ])

  const enableTapToDiscoverFromProduct = Boolean(
    enableTapToDiscoverMaster || enableTapToDiscoverVariant
  )

  const showTapToDiscoverExperience = useMemo(() => {
    if (!enableTapToDiscoverFromProduct) return false
    return getHeroGalleryMediaIndices(fullMedias, heroGalleryEntries).length > 1
  }, [enableTapToDiscoverFromProduct, fullMedias, heroGalleryEntries])

  const showHeroColorSwatches = !isDiscoverMode

  const styles = useMultiStyleConfig('ProductMainStageV7')
  const mainContentStyle = {
    ...styles.mainContent,
    ...(isDiscoverMode ? styles.mainContentHidden : {}),
  }

  useEffect(() => {
    toggleBodyScroll(!isDiscoverMode)
    return () => {
      toggleBodyScroll(true)
    }
  }, [isDiscoverMode])

  useEffect(() => {
    return () => setTapToDiscoverImmersive(false)
  }, [setTapToDiscoverImmersive])

  const handleGalleryClick = useCallback(
    (e: React.MouseEvent) => {
      if (!showTapToDiscoverExperience || isDiscoverMode || activeIdx !== 0) return

      const target = e.target as HTMLElement
      if (
        target.closest('.splide__arrow') ||
        target.closest('.splide__pagination') ||
        target.closest('video')
      )
        return

      const firstMedia = fullMedias[0]
      const mediaSrc =
        firstMedia?.type === 'video'
          ? firstMedia?.poster || firstMedia?.src || ''
          : firstMedia?.src || ''

      if (selectedVariantId && mediaSrc) {
        analytics.send('swatchInteraction', {
          eventAction: `P${activeIdx + 1}:product image navigator click`,
          eventLabel: selectedVariantId,
          swatchType: 'product image',
          swatchValue: `${selectedVariantId}:tap to discover`,
          swatchVariant: selectedVariantId,
        })
      }

      const firstTabMediaIdx = getFirstHeroGalleryMediaIndex(fullMedias, heroGalleryEntries)
      setActiveIdx(firstTabMediaIdx)
      setGoToSlideRequest(firstTabMediaIdx)
      setTapToDiscoverImmersive(true)
      setIsDiscoverMode(true)
    },
    [
      activeIdx,
      analytics,
      showTapToDiscoverExperience,
      fullMedias,
      heroGalleryEntries,
      isDiscoverMode,
      selectedVariantId,
      setActiveIdx,
      setGoToSlideRequest,
      setTapToDiscoverImmersive,
    ]
  )

  const handleCloseDiscover = useCallback(() => {
    setTapToDiscoverImmersive(false)
    setIsDiscoverMode(false)
    setActiveIdx(0)
  }, [setActiveIdx, setTapToDiscoverImmersive])

  const productInfoContent = (
    <Box sx={styles.productInfoSection}>
      <ProductTitle isDiscoverMode={false} />
      <ProductPrice />
      {ipxPromotions.length > 0 && (
        <Box sx={styles.pricePromotionsRow}>
          {ipxPromotions.map((promo, index) => (
            <Box key={`v7-promo-${index}`} sx={styles.pricePromotionItem}>
              <CallOutMessage promoText={[promo]} masterId={masterId} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )

  return (
    <StylesProvider value={styles}>
      {isDiscoverMode && (
        <DiscoverModeOverlay
          onClose={handleCloseDiscover}
          onGalleryClick={handleGalleryClick}
          showTapToDiscoverExperience={showTapToDiscoverExperience}
        />
      )}
      <Box sx={styles.container}>
        <Box sx={mainContentStyle} aria-hidden={isDiscoverMode}>
          <Box sx={styles.heroWrapper}>
            <PdpV7EntranceLayer variant="fromTop" delayStep={PDP_V7_ENTRANCE_DELAY.titleAndPrice}>
              {productInfoContent}
            </PdpV7EntranceLayer>

            <PdpV7EntranceLayer
              variant="fromCenter"
              delayStep={PDP_V7_ENTRANCE_DELAY.gallery}
              sx={styles.galleryEntranceLayer}
            >
              <Box sx={styles.galleryWrapper} onClick={handleGalleryClick}>
                <ProductGalleryV7
                  isDiscoverMode={false}
                  immersiveMediaLayout={false}
                  enableTapToDiscover={showTapToDiscoverExperience}
                />
                {showTapToDiscoverExperience && activeIdx === 0 && (
                  <Box
                    sx={styles.tapWrapper}
                    aria-label={formatMessage({
                      id: 'pdp.tapToDiscover.aria',
                      defaultMessage: 'Tap to discover',
                    })}
                  >
                    <Flex sx={styles.tapFlex}>
                      <Box sx={styles.tapTextContainer}>
                        <Box sx={styles.tapText}>
                          {formatMessage({
                            id: 'pdp.tapToDiscover.tapTo',
                            defaultMessage: 'TAP TO',
                          })}
                        </Box>
                        <Box sx={styles.tapText}>
                          {formatMessage({
                            id: 'pdp.tapToDiscover.discover',
                            defaultMessage: 'DISCOVER',
                          })}
                        </Box>
                      </Box>

                      <Box sx={styles.tapDivider} />

                      <Box sx={styles.tapIconContainer}>
                        <TouchIcon />
                      </Box>
                    </Flex>
                  </Box>
                )}
              </Box>
            </PdpV7EntranceLayer>
          </Box>

          {showHeroColorSwatches && (
            <PdpV7EntranceLayer variant="fromBottom" delayStep={PDP_V7_ENTRANCE_DELAY.swatches}>
              <Box sx={styles.swatchWrapper}>
                <ProductImageSwatchesV7Container />
              </Box>
            </PdpV7EntranceLayer>
          )}
          <Box sx={styles.lowerActionsSlot}>
            <PdpV7EntranceLayer variant="fromBottom" delayStep={PDP_V7_ENTRANCE_DELAY.lowerActions}>
              <ProductActionsArea />
              <FinalSaleProductMessage />
              <ViewMorePromoDrawer />
            </PdpV7EntranceLayer>
          </Box>
        </Box>
      </Box>
    </StylesProvider>
  )
}

export default MainStageV7
