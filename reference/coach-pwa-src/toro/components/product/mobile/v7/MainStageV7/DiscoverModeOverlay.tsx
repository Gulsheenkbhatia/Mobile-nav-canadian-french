import { useIntl } from 'react-intl'
import { useAtomValue } from 'jotai/utils'
import Box from 'toro/components/Box'
import Portal from 'toro/components/Portal'
import AngleNavigator from 'toro/components/product/mobile/v7/AngleNavigator'
import ProductGalleryV7 from 'toro/components/product/mobile/v7/ProductGalleryV7'
import ProductPrice from 'toro/components/product/desktop/ProductPrice'
import ProductActionsArea from 'toro/components/product/mobile/v7/ProductActions/ProductActionsArea'
import ProductTitle from 'toro/components/product/mobile/v7/ProductTitle'
import {
  PdpV7EntranceLayer,
  PDP_V7_ENTRANCE_DELAY,
} from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation'
import SpadeMark from '@tapestry-inc/design-tokens/kate-spade/icon/object/spade.svg'
import { CloseIcon } from 'toro/icons'
import useStyles from 'toro/hooks/useStyles'
import { productCarouselActiveIndexAtom } from 'store/pdp.atom'
import useFullProductMedia from 'toro/components/product/mobile/v7/hooks/useFullProductMedia'

export type DiscoverModeOverlayProps = {
  onClose: () => void
  onGalleryClick: (e: React.MouseEvent) => void
  showTapToDiscoverExperience: boolean
}

const DiscoverModeOverlay = ({
  onClose,
  onGalleryClick,
  showTapToDiscoverExperience,
}: DiscoverModeOverlayProps) => {
  const { formatMessage } = useIntl()
  const styles = useStyles()
  const activeIdx = useAtomValue(productCarouselActiveIndexAtom)
  const fullMedias = useFullProductMedia()
  const clampedActiveIdx =
    fullMedias.length === 0 ? 0 : Math.min(Math.max(0, activeIdx), fullMedias.length - 1)
  const activeMedia = fullMedias[clampedActiveIdx]
  const isVideoHeroSlide = activeMedia?.type === 'video'
  const isTapToDiscoverVideoImmersive = showTapToDiscoverExperience && isVideoHeroSlide
  const showPdpTitleAndPrice = !isVideoHeroSlide
  const heroWrapperStyle = {
    ...styles.heroWrapper,
    ...styles.heroWrapperDiscover,
    ...(isTapToDiscoverVideoImmersive ? styles.heroWrapperImmersive : {}),
  }
  const galleryWrapperStyle = {
    ...styles.galleryWrapper,
    ...styles.galleryWrapperDiscover,
    ...(isTapToDiscoverVideoImmersive ? styles.galleryWrapperImmersive : {}),
    ...(isTapToDiscoverVideoImmersive ? styles.galleryWrapperImmersiveDiscover : {}),
  }

  const productInfoContent = (
    <Box sx={styles.productInfoSection}>
      <ProductTitle isDiscoverMode={false} />
      <ProductPrice />
    </Box>
  )

  return (
    <Portal>
      <Box
        role="dialog"
        aria-modal="true"
        aria-label={formatMessage({
          id: 'pdp.tapToDiscover.overlayAria',
          defaultMessage: 'Product gallery',
        })}
        sx={styles.discoverOverlayRoot}
      >
        <Box sx={heroWrapperStyle}>
          <PdpV7EntranceLayer variant="fromTop" delayStep={PDP_V7_ENTRANCE_DELAY.titleAndPrice}>
            <Box sx={styles.discoverKateSpadeTop}>
              <Box sx={styles.discoverSpadeRow} aria-hidden>
                <SpadeMark />
              </Box>
              {showPdpTitleAndPrice && productInfoContent}
            </Box>
          </PdpV7EntranceLayer>

          <PdpV7EntranceLayer
            variant="fromCenter"
            delayStep={PDP_V7_ENTRANCE_DELAY.gallery}
            sx={styles.galleryEntranceLayerDiscover}
          >
            <Box sx={galleryWrapperStyle} onClick={onGalleryClick}>
              <ProductGalleryV7
                isDiscoverMode
                immersiveMediaLayout={isTapToDiscoverVideoImmersive}
                enableTapToDiscover={showTapToDiscoverExperience}
              />
            </Box>
          </PdpV7EntranceLayer>
        </Box>

        <Box sx={styles.closeWrapperDiscover}>
          <Box
            as="button"
            type="button"
            sx={styles.closeButton}
            onClick={onClose}
            aria-label={formatMessage({
              id: 'pdp.tapToDiscover.aria',
              defaultMessage: 'Close discover mode',
            })}
          >
            <CloseIcon aria-hidden />
          </Box>
        </Box>

        <Box sx={styles.angleWrapper}>
          <AngleNavigator isDiscoverMode />
        </Box>

        <Box sx={styles.lowerActionsSlot}>
          <PdpV7EntranceLayer variant="fromBottom" delayStep={PDP_V7_ENTRANCE_DELAY.lowerActions}>
            <ProductActionsArea />
          </PdpV7EntranceLayer>
        </Box>
      </Box>
    </Portal>
  )
}

export default DiscoverModeOverlay
