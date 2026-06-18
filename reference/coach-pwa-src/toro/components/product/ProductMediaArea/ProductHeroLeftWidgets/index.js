import MonogrammImage from 'toro/components/MonogrammImage.js'
import Box from 'toro/components/Box'
import { useState } from 'react'
import Image from 'toro/components/Image'
import OnPurposePopOver from '../../OnPurposePopOver'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import dynamic from 'next/dynamic'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useHeaderHeight from 'toro/hooks/useHeaderHeight'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import usePageType from 'toro/hooks/usePageType'

const SustainibilityExperienceContainer = dynamic(() =>
  import('toro/components/product/SustainableExperience/SustainabilityExperienceContainer')
)

function ProductHeroLeftWidgets({
  imageBadges,
  selectedColor,
  productData,
  activeIdx,
  isSustainabilityIconExpEnabled,
  sustainabilityIconsData,
  isMobile,
  isOnPurposeEnabled,
  onPurposeMaterials,
  onPurposeBadgeImage,
}) {
  const { isTransparentStickyHeader } = useHeaderPositionPref()
  const { isPDP } = usePageType()
  const isPDPV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile && isPDP
  const headerHeight = useHeaderHeight()
  const styles = useMultiStyleConfig('ProductImage')
  const [isOnPurposeOpen, setIsOnPurposeOpen] = useState(false)

  function handleOnPurposeEnter() {
    setIsOnPurposeOpen(true)
  }

  function handleOnPurposeLeave() {
    setIsOnPurposeOpen(false)
  }

  const onPurposeImageProps = { src: onPurposeBadgeImage, ...styles.productImageOnPurposeBadge }
  const onPurposePopOverProps = { className: 'tooltip-content tooltip-content--mobile' }
  const renderImage = (onPurposeImageProps) => <Image {...onPurposeImageProps} />

  const renderPopOver = (onPurposePopOverProps) => {
    if (isOnPurposeOpen && onPurposeMaterials && isMobile) {
      return (
        <div dangerouslySetInnerHTML={{ __html: onPurposeMaterials }} {...onPurposePopOverProps} />
      )
    }
  }

  return (
    <>
      {imageBadges}
      {selectedColor?.isMonogrammed &&
        selectedColor?.monogram?.monogramPlacementCode === 'hangtag' &&
        activeIdx === 0 && (
          <Box w="100%" position="absolute">
            <MonogrammImage
              src={selectedColor?.monogramPreviewUrl}
              h="160px"
              w="160px"
              position="absolute"
              top="0px"
              left={isMobile ? '0px' : '113px'}
              zIndex="10"
              className="customization_monogram customization_monogram--stamp"
            />
          </Box>
        )}
      {isSustainabilityIconExpEnabled && (
        <SustainibilityExperienceContainer
          sustainabilityIconsData={sustainabilityIconsData}
          onHeroPDP={true}
          isMobile={isMobile}
          productData={productData}
        />
      )}
      {isOnPurposeEnabled && (
        <OnPurposePopOver
          sx={{
            ...styles.productImageOnPurposeBadgeContainer,
            top:
              isPDPV3Mobile && isTransparentStickyHeader
                ? `${headerHeight + 36}px`
                : styles.productImageOnPurposeBadgeContainer.top,
          }}
          onMouseEnter={handleOnPurposeEnter}
          onMouseLeave={handleOnPurposeLeave}
          onClick={handleOnPurposeEnter}
          onBlur={handleOnPurposeLeave}
        >
          {renderImage(onPurposeImageProps)}
          {renderPopOver(onPurposePopOverProps)}
        </OnPurposePopOver>
      )}
    </>
  )
}

export default ProductHeroLeftWidgets
