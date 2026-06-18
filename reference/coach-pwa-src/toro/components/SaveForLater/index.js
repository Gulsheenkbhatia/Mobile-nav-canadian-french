import { useState } from 'react'
import { useAtomValue } from 'jotai/utils'

import Box from 'toro/components/Box'
import Button from 'toro/components/Button'

import { EXPERIMENTS } from 'toro/constants/experiments'

import useTimeout from 'toro/hooks/useTimeout'
import usePageType from 'toro/hooks/usePageType'
import useExperiment from 'toro/hooks/useExperiment'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

import { wishlistIdsAtom } from 'store/wishlist.atom'

import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import WishlistAnimatedIcon from 'toro/components/SaveForLater/WishlistAnimatedIcon'
import { useSaveForLaterComputed } from 'toro/components/SaveForLater/useSaveForLaterComputed'
import { useSaveForLaterHandlers } from 'toro/components/SaveForLater/useSaveForLaterHandlers'
import { callbackHandler } from 'toro/components/SaveForLater/helpers/callbackHandler'

// TODO: write typescript version of this component
// don't remove the 'name' param
function SaveForLater({
  name,
  pdpQaTag = undefined,
  className = undefined,
  productData = undefined,
  isQuickView = undefined,
  styleVariant,
  selectedColor = undefined,
  wrapperStyles = {},
  selectedVariant,
  isProductHeader = undefined,
  isTangibleeVisible = undefined,
  isNewMegaPDPTurnOn = undefined,
  isRecommendationTile,
  onAddToWishlistSuccess,
  onRemoveFromWishlistSuccess,
}) {
  const { isMobile, isDesktop } = useViewportType()
  const { isPDP, isPLP } = usePageType()

  const wishlistIds = useAtomValue(wishlistIdsAtom)
  const isPDPTemplateV3 = useExperiment(EXPERIMENTS.PDP_V3) && isPDP
  const isPDPTemplateV3Mobile = isPDPTemplateV3 && isMobile

  // TODO: should be segregated DIGIT-8854
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)
  const { start: startIconAnimation, clear: clearIconAnimation } = useTimeout(() => {
    setIsAnimationPlaying(false)
  }, 1850)

  // TODO: should be executed once DIGIT-8854, move to the parent level
  const styles = useMultiStyleConfig('WishlistIcon', {
    variant: isPDPTemplateV3Mobile ? 'pdpRedesign' : styleVariant,
  })

  const {
    wishlistId,
    isInWishlist,
    wishlistFallbackId,
    selectedVariantComputed: { isCustomizedOrMonogrammed, customizationAction },
  } = useSaveForLaterComputed({ productData, selectedVariant, wishlistIds })

  const { handleAddToWishlist, handleRemoveFromWishlist } = useSaveForLaterHandlers()

  async function handleClick(e) {
    e.stopPropagation()
    e.preventDefault()
    if (isInWishlist) {
      await handleRemoveFromWishlist({
        name,
        wishlistId,
        wishlistIds,
        selectedVariant,
        wishlistFallbackId,
        customizationAction,
        isCustomizedOrMonogrammed,
      })
      callbackHandler({
        wishlistId,
        callback: onRemoveFromWishlistSuccess,
        callbackName: 'onRemoveFromWishlistSuccess',
      })
      onWishlistRemoveAnimation()
    } else {
      await handleAddToWishlist({
        name,
        wishlistId,
        wishlistIds,
        productData,
        selectedColor,
        selectedVariant,
        wishlistFallbackId,
        customizationAction,
        isCustomizedOrMonogrammed,
      })
      callbackHandler({
        wishlistId,
        callback: onAddToWishlistSuccess,
        callbackName: 'onAddToWishlistSuccess',
      })
      onWishlistAddAnimation()
    }
  }

  function onWishlistAddAnimation() {
    if (!isPDPTemplateV3) return

    setIsAnimationPlaying(true)
    startIconAnimation()
  }

  function onWishlistRemoveAnimation() {
    if (!isPDPTemplateV3) return

    clearIconAnimation()
    setIsAnimationPlaying(false)
  }

  // TODO: should be segregated DIGIT-8854
  const renderWishlistIcon = () => {
    const dataQaIconWishlist = isInWishlist
      ? isQuickView
        ? 'qv_btn_wshlst_active'
        : 'cm_tile_button_pt_wshlist_active'
      : isQuickView
      ? 'qv_btn_wshlst_inactive'
      : 'cm_tile_button_pt_wshlist_inactive'

    return !isPDPTemplateV3 ? (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        className={
          isInWishlist
            ? 'favorite-fill_svg__icon-navigation-favorite-fill'
            : 'favorite_svg__icon-navigation-favorite'
        }
        data-qa={dataQaIconWishlist}
      >
        <use href={isInWishlist ? '#icon-heart' : '#icon-empty-heart'} />
      </svg>
    ) : (
      <WishlistAnimatedIcon
        isInWishlist={isInWishlist}
        isAnimationPlaying={isAnimationPlaying}
        data-qa={dataQaIconWishlist}
      />
    )
  }

  return (
    <Box
      className={`btn-wishlist-container ${
        isRecommendationTile ? 'btn-wishlist-container-recommend' : ''
      }`}
      as="div"
      width={isPDPTemplateV3 ? '22px' : '16px'}
      height={isPDPTemplateV3 ? '22px' : '16px'}
      right={isMobile ? (isPDP ? 'm' : 'xl') : '19px'}
      top={isTangibleeVisible ? '50px' : isMobile ? (isPDP ? 's' : '0') : 'm'}
      position="absolute"
      data-qa="qv_btn_wshlst"
      sx={{
        // TODO: optimise style spreading during rendering DIGIT-8854
        ...styles?.mainWishlistWrapper?.({ isDesktop, isTangibleeVisible, isPDP, isPDPTemplateV3 }),
        ...styles?.redesignWishlistWrapper?.(isRecommendationTile),
        ...wrapperStyles,
        ...(isPDPTemplateV3 && isProductHeader
          ? styles?.whishlistButtonContainer?.(isNewMegaPDPTurnOn)
          : {}),
      }}
    >
      <Button
        aria-label="wishlist"
        left={isMobile && isPDP && !isRecommendationTile ? 'mar' : ''}
        variant="icon-only-w-focus"
        size="content"
        onClick={handleClick}
        data-qa={
          /* Recommended */
          pdpQaTag === 'pdpQaTagRecomm'
            ? isInWishlist
              ? 'cm_tile_button_pt_wshlist_active' // active
              : 'cm_tile_button_pt_wshlist_inactive' // inactive
            : /* Mobile or desktop */
            pdpQaTag === 'pdpQaTagMobile'
            ? 'm_pdp_btn_pdt_wshlst' // mobile
            : isQuickView
            ? 'qv_btn_wshlst'
            : 'pdp_btn_pdt_wshlst' //desktop
        }
        className={!isQuickView ? className : ''}
        sx={
          isQuickView
            ? { ...styles.whishlistIcon, ...styles.whishlistButton?.(isPLP && isMobile) }
            : { ...styles.whishlistButton?.(!isPDP && isMobile) }
        }
      >
        <Box
          overflow="visible"
          className="wishlist-container"
          width={isPDPTemplateV3 ? '22px' : '16px'}
          height={isPDPTemplateV3 ? '22px' : '16px'}
        >
          {renderWishlistIcon()}
        </Box>
      </Button>
    </Box>
  )
}

export default withErrorBoundaryWrapper(SaveForLater)
