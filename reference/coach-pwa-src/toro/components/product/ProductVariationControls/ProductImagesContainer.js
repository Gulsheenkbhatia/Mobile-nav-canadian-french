import dynamic from 'next/dynamic'
import { useState, memo, useCallback, useMemo } from 'react'

import useStyles from 'toro/hooks/useStyles'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePreference from 'toro/hooks/usePreference_new'

import Flex from 'toro/components/Flex'
import Hidden from 'toro/components/Hidden'
import ProductImagesControl from 'toro/components/product/ProductVariationControls/ProductImagesControl'
import ProductImagesControlContext from 'toro/components/product/ProductVariationControls/ProductImagesControlContext'

import { parseProductId } from 'toro/helpers/productVariations'

const CustomizeRemovalModal = dynamic(
  () => import('toro/components/product/CustomizeRemovalModal'),
  {
    ssr: false,
  }
)

function ProductImagesContainer({
  items = [],
  onClick = () => {},
  masterId = '',
  isQuickView = false,
  selectedItem = {},
  productData = {},
  setFilterItems,
  setSelectedColor,
  isMegaPDPEligible,
  setCustomizerVariants,
}) {
  const styles = useStyles()
  const analytics = useAnalytics()
  const [isShowMore, setShowMore] = useState(true)

  const [customizeModal, setCustomizeModal] = useState({
    item: undefined,
    value: false,
  })

  const {
    toggleSiteFeatures: { maxSwatchImagesVisible: maxSwatch = 10 },
  } = usePreference({
    ToggleSiteFeatures: ['maxSwatchImagesVisible'],
  })

  const handleRemove = useCallback(
    (selectedColor) => {
      setCustomizeModal({
        item: selectedColor,
        value: true,
      })

      selectedColor?.isMonogrammed &&
        analytics.send('customization', {
          eventLocation: 'monogram',
          eventAction: 'customization cancel', //event_action
          eventLabel: 'customization close click', // event_label
          customization_step: 'cancel', //customization_step
          customized_recipe_id: selectedColor?.id, // customized_recipe_id
          customized_item_parent_id: parseProductId(selectedColor?.baseProductId)?.masterId, // customized_item_parent_id
          customized_item_category:
            productData?.pickedProps?.promotionData?.item_category || productData?.category_id, //customized_item_category
          custom_color: parseProductId(selectedColor?.baseProductId)?.colorId, //custom_color
          embellish_type: selectedColor?.embellishment?.embellish_type, // embellish_type
          embellish_pattern: selectedColor?.embellishment?.embellish_pattern, // embellish_pattern
          monogram_placement: selectedColor?.monogram?.monogramPlacementCode, // monogram_placement
          monogram_details: selectedColor?.monogram?.monogramInitials, // monogram_details
        })
    },
    [analytics.send, setCustomizeModal]
  )

  const productImagesControlProps = useMemo(
    () => ({
      items,
      selectedItem,
      isMegaPDPEligible,
      isQuickView,
      onClick,
      handleRemove,
      isShowMore,
      setShowMore,
      maxSwatch,
      masterId,
    }),
    [
      items,
      selectedItem,
      isMegaPDPEligible,
      isQuickView,
      onClick,
      handleRemove,
      isShowMore,
      setShowMore,
      maxSwatch,
      masterId,
    ]
  )

  return (
    <ProductImagesControlContext.Provider value={productImagesControlProps}>
      <Hidden onDesktop onTablet isFragment>
        <Flex w="100%" sx={styles.productImagesInnerContainer}>
          <ProductImagesControl />
        </Flex>
      </Hidden>

      {customizeModal?.value && (
        <CustomizeRemovalModal
          items={items}
          masterId={masterId}
          productData={productData}
          selectedColor={selectedItem}
          customizeModal={customizeModal}
          setFilterItems={setFilterItems}
          setSelectedColor={setSelectedColor}
          setCustomizeModal={setCustomizeModal}
          setCustomizerVariants={setCustomizerVariants}
          onClose={() => setCustomizeModal({ item: undefined, value: false })}
        />
      )}

      <Hidden onMobile isFragment>
        <Flex flexWrap="wrap" w="100%" alignItems="center">
          <ProductImagesControl />
        </Flex>
      </Hidden>
    </ProductImagesControlContext.Provider>
  )
}

export default memo(ProductImagesContainer)
