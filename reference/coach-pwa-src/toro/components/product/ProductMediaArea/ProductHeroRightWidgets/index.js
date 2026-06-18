import React, { memo } from 'react'
import SaveForLater from 'toro/components/SaveForLater'
import Tangiblee from 'toro/components/product/Tangiblee'
import Box from 'toro/components/Box'
import CustomSlot from 'toro/cms/components/CustomSlot'
import MemberExclusive from 'toro/components/list/MemberExclusive'
import get from 'lodash/get'
import { useAtomValue } from 'jotai/utils'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePreference from 'toro/hooks/usePreference_new'
import useExperiment from 'toro/hooks/useExperiment'
import { isSWOutletAtom } from 'store/global.atom'

function ProductHeroRightWidgets({
  selectedVariant,
  isGuestUser,
  membershipExclusiveProduct,
  currentVariationGroupId,
  onAddToWishlistSuccess,
  onRemoveFromWishlistSuccess,
  tangibleeWidgetProps,
  selectedColor,
  productData,
  isQuickView,
  membershipContent,
  isMobile,
}) {
  const {
    tangiblee: { TANGIBLEE_CTA_ON_HERO_IMAGE: onHeroImage, enableStrategicTangiblee },
  } = usePreference({
    Tangiblee: ['TANGIBLEE_CTA_ON_HERO_IMAGE', 'enableStrategicTangiblee'],
  })
  const isOnlyColor = Object.keys(get(selectedVariant, 'variationValues', {})).every(
    (item) => item === 'color'
  )
  const isSWOutlet = useAtomValue(isSWOutletAtom)
  const isPDPTemplateV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile
  const isVisible = onHeroImage && tangibleeWidgetProps?.isVisible

  return (
    <Box>
      {!isSWOutlet && !isPDPTemplateV3Mobile && (
        <SaveForLater
          name={productData.name}
          selectedColor={selectedColor}
          productData={productData}
          selectedVariant={
            selectedColor?.isCustomized || selectedColor?.isMonogrammed
              ? { ...selectedColor, productId: selectedColor?.id }
              : !isOnlyColor
              ? selectedVariant
              : {
                  ...selectedColor,
                  productId: currentVariationGroupId,
                }
          }
          onAddToWishlistSuccess={onAddToWishlistSuccess}
          onRemoveFromWishlistSuccess={onRemoveFromWishlistSuccess}
          isTangibleeVisible={isVisible}
          className="wishlist-btn js-wishlist-btn"
          isQuickView={isQuickView}
          pdpQaTag={isMobile ? 'pdpQaTagMobile' : 'pdpQaTag'}
        />
      )}
      {isVisible && (!enableStrategicTangiblee || !isMobile) && (
        <Tangiblee.OnHeroImage {...tangibleeWidgetProps} />
      )}
      {membershipExclusiveProduct && (
        <CustomSlot
          content={membershipContent}
          Component={MemberExclusive}
          isGuestUser={isGuestUser}
          isTangibleeVisible={isVisible}
          isQuickView={isQuickView}
        />
      )}
    </Box>
  )
}

export default memo(ProductHeroRightWidgets)
