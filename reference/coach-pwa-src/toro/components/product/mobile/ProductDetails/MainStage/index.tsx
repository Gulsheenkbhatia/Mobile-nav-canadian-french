import { useMemo } from 'react'
import PromoCallout from 'toro/components/product/PromoCallout'
import { PROMO_TYPES } from 'toro/helpers/getPromoByType'
import CustomizeAndMonogram from 'toro/components/product/mobile/CustomizeAndMonogram'
import ProductCarouselWithZoom from 'toro/components/product/mobile/ProductCarouselWithZoom'
import OnImageBadge from 'toro/components/product/mobile/Badges/OnImageBadge'
import InventoryCalloutBadge from 'toro/components/product/mobile/Badges/InventoryCalloutBadge'
import ProductDetails from 'toro/components/product/mobile/ProductDetails'
import AddToBagAreaWrapper from 'toro/components/product/mobile/AddToBagArea/AddToBagAreaWrapper'
import PDPColorSwatches from 'toro/components/product/desktop/PDPColorSwatches'
import SizeSelector from 'toro/components/product/desktop/StickyBar/SizeSelector'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { MIN_MEDIA_ITEMS_REQUIRED } from 'toro/components/product/mobile/BentoBoxCarousel/constants'
import BentoBoxCarousel from 'toro/components/product/mobile/BentoBoxCarousel'
import { useAtomValue } from 'jotai/utils'
import { isSizedProductAtom } from 'store/pdp.atom'
import Experiment from 'toro/components/Experiment'
import ProductCarouselWithThumbnails from 'toro/components/product/mobile/ProductCarouselWithThumbnails'
import PaidyWidget from 'toro/components/Paidy/PaidyWidget'

import usePreference from 'toro/hooks/usePreference_new'

const MainStage = () => {
  const {
    paidy: { paidy_enabled: isPaidyEnabled, show_paidy_pdp: showPaidyOnPdp },
  } = usePreference({
    paidy: ['paidy_enabled', 'show_paidy_pdp'],
  })
  const showPaidyBelowCtaPdpV6 = isPaidyEnabled && showPaidyOnPdp

  const isSizedProduct = useAtomValue(isSizedProductAtom)
  const isBentoBoxCarouselEnabled = useExperiment(EXPERIMENTS.BENTO_BOX_PDP_CAROUSEL)
  const mediaItems = useSelectedColorData('media.full')
  const shouldShowBentoBoxCarousel =
    isBentoBoxCarouselEnabled && mediaItems?.length >= MIN_MEDIA_ITEMS_REQUIRED

  const {
    pdpPreferences: { enableThumbnailCarouselOnPDP = false, enableZoomImageModalOnPDP = false },
  } = usePreference({
    PDPPreferences: ['enableThumbnailCarouselOnPDP', 'enableZoomImageModalOnPDP'],
  })

  const shouldShowThumbnailCarousel = enableThumbnailCarouselOnPDP || enableZoomImageModalOnPDP

  const productCarousel = useMemo(() => {
    if (shouldShowBentoBoxCarousel) {
      return <BentoBoxCarousel data={mediaItems} />
    }

    if (shouldShowThumbnailCarousel) {
      return (
        <ProductCarouselWithThumbnails
          enableThumbnails={enableThumbnailCarouselOnPDP}
          enableZoomModal={enableZoomImageModalOnPDP}
        />
      )
    }

    return <ProductCarouselWithZoom />
  }, [
    shouldShowBentoBoxCarousel,
    shouldShowThumbnailCarousel,
    mediaItems,
    enableThumbnailCarouselOnPDP,
    enableZoomImageModalOnPDP,
  ])

  return (
    <>
      {shouldShowBentoBoxCarousel && (
        <style global jsx>
          {'header { --header-background-color: var(--color-neutral-light) }'}
        </style>
      )}
      {!shouldShowBentoBoxCarousel && <OnImageBadge />}
      {productCarousel}
      <Experiment
        notForIDs={`${EXPERIMENTS.SOCIAL_PROOF_MESSAGE_PDP}-${EXPERIMENTS.LOW_INVENTORY_ABOVE_ATB}`}
      >
        <InventoryCalloutBadge />
      </Experiment>

      <ProductDetails />
      <PDPColorSwatches fadeColor="null" hideArrows />
      <CustomizeAndMonogram type="links" />
      {isSizedProduct && <SizeSelector />}
      <AddToBagAreaWrapper />
      {showPaidyBelowCtaPdpV6 && <PaidyWidget isBelowAtcPlacement />}
      <PromoCallout promoType={PROMO_TYPES.IPX2} variant="underATBPromo" />
    </>
  )
}

export default MainStage
