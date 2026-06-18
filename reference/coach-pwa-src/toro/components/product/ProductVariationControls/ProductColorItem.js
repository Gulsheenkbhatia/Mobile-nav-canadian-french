import { Box, Flex } from '@chakra-ui/react'
import React, { memo, useContext, useCallback } from 'react'
import ProductImageControl from './ProductImageControl'
import ProductImagesControlContext from './ProductImagesControlContext'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useAnalytics from 'toro/analytics/useAnalytics'
import useStyles from 'toro/hooks/useStyles'
import { getId } from 'toro/helpers/productVariations'
import useViewportType from 'toro/hooks/useViewportType'

function ProductColorItem({ item, selected, isSameParent, idx }) {
  const { isMobile } = useViewportType()
  const styles = useStyles()
  const analytics = useAnalytics()
  const {
    setCustomizerVariants,
    isQuickView,
    isMegaPDPEligible,
    onClick,
    handleRemove,
    maxSwatch,
    isShowMore,
    masterId,
  } = useContext(ProductImagesControlContext)

  const handleClick = useCallback(() => {
    if (!selected) {
      if ((isMegaPDPEligible && isSameParent) || !isMegaPDPEligible) {
        onClick(item)
      } else {
        analytics.send('swatchInteraction', {
          eventAction: 'swatch click',
          eventLabel: item?.vgId,
          eventLocation: 'mega product',
          swatchType: 'color',
          swatchValue: item?.text || 'undefined',
          swatchVariant: item?.vgId || 'undefined',
        })
      }
    }
  }, [item, selected, isMegaPDPEligible, isSameParent, onClick, analytics.send])

  const onRemove = useCallback(() => {
    handleRemove?.(item)
  }, [item])

  return (
    <Flex
      key={item?.vgId}
      position="relative"
      data-qa={isMobile ? 'variant_color_images_swatches' : undefined}
      className={item?.isCustomized || item?.isMonogrammed ? 'customization_tile' : ''}
    >
      <ProductImageControl
        key={getId(item)}
        onClick={handleClick}
        selected={selected}
        labelValue={get(item, 'text', '')}
        isItemHidden={isMobile || !isShowMore ? false : maxSwatch <= idx + 1}
        disabled={!get(item, 'orderable', false)}
        isQuickView={isQuickView}
        masterId={get(item, 'masterId') || masterId}
        isCustomizer={!!(item?.isCustomized || item?.isMonogrammed)}
        setCustomizerVariants={setCustomizerVariants}
        src={get(item, 'media.thumbnail.src')}
        alt={get(item, 'media.thumbnail.alt')}
        qvImageSrc={get(item, 'image.src')}
        id={get(item, 'id', '')}
        monogramFontName={get(item, 'monogram.monogramFontName')}
        monogramInitialsHtml={get(item, 'monogram.monogramInitialsHtml')}
      />

      {item?.isCustomized || item?.isMonogrammed ? (
        <Box as="span" position="absolute" onClick={onRemove} sx={styles.closeIconContainer}>
          x
        </Box>
      ) : null}
    </Flex>
  )
}

ProductColorItem.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  isSameParent: PropTypes.bool,
  idx: PropTypes.number,
}

export default memo(withErrorBoundaryWrapper(ProductColorItem))
