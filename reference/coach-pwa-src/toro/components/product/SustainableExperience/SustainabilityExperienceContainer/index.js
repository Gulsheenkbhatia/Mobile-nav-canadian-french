import React, { useCallback, useState } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import SustainabilityExperienceModal from 'toro/components/product/SustainableExperience/SustainabilityExperienceModal'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import PropTypes from 'prop-types'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { getProductImageSrc } from 'toro/helpers/productImages'
import useViewportType from 'toro/hooks/useViewportType'
import { useDisclosure } from '@chakra-ui/react'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

function SustainabilityExperienceContainer({
  sustainabilityIconsData,
  onHeroPDP,
  isMobile,
  productData,
}) {
  const styles = useMultiStyleConfig('sustainIcons')
  const { viewport } = useViewportType()
  const { isOpen: isModalOpen, onClose, onOpen } = useDisclosure()
  const [modalData, setModalData] = useState(null)
  const isV3Experience = useExperiment(EXPERIMENTS.PDP_V3_BELOW_THE_FOLD)
  const imgOption = isV3Experience ? { isSwatchImageV3: true } : { isSwatchImage: true }

  const analytics = useAnalytics()
  const handleClick = useCallback(
    (idx) => {
      analytics.send('productInteraction', {
        eventLocation: onHeroPDP ? 'product image' : 'accordion',
        eventAction:
          sustainabilityIconsData?.[idx]?.materialContent?.default?.toLocaleLowerCase() + ' click',
        eventLabel: productData?.masterId,
      })
      onOpen()
      setModalData(sustainabilityIconsData?.[idx])
    },
    [sustainabilityIconsData, productData?.masterId, onHeroPDP]
  )

  const containerStyles = {
    position: onHeroPDP ? 'absolute' : '',
    top: onHeroPDP ? '40px' : '',
    className: `sustain-icons-container ${
      onHeroPDP ? 'sustain-icons-container_heroPDP' : 'sustain-icons-container_productDetails'
    }`,
    marginTop: onHeroPDP ? '10px' : '20px',
    marginLeft: onHeroPDP ? '10px' : '',
    marginBottom: !onHeroPDP ? '10px' : '',
    left: onHeroPDP && !isMobile ? '113px' : '',
  }

  if (!sustainabilityIconsData || sustainabilityIconsData?.length === 0) {
    return null
  }

  return (
    <>
      <Box
        {...containerStyles}
        sx={onHeroPDP ? styles.sustain_heroPDP : styles.sustain_productDetails}
      >
        <Flex flexDirection={onHeroPDP ? 'column' : 'row'} flexWrap={onHeroPDP ? 'nowrap' : 'wrap'}>
          {sustainabilityIconsData?.map?.((sustainabilityIcon, idx) => {
            const viewportSrc = getProductImageSrc(
              sustainabilityIcon?.materialImagePath?.default,
              viewport,
              'pdp',
              imgOption
            )
            return (
              <Box
                className="sustainable-icon-box"
                as="button"
                onClick={() => handleClick(idx)}
                key={idx}
              >
                <Flex display="inline-flex">
                  <Image
                    src={viewportSrc || 'https://images.coach.com/is/image/Coach/coach-brand-image'}
                    className="sustainable-icon"
                  />
                  {!onHeroPDP ? (
                    <Text
                      className="sustain-icons-text"
                      position="relative"
                      sx={styles.sustain_icon_text}
                    >
                      {sustainabilityIcon?.materialContent?.default}
                    </Text>
                  ) : null}
                </Flex>
              </Box>
            )
          })}
        </Flex>
      </Box>
      <SustainabilityExperienceModal
        isOpen={isModalOpen}
        onClose={onClose}
        modalData={modalData}
        isMobile={isMobile}
      />
    </>
  )
}

SustainabilityExperienceContainer.propTypes = {
  sustainabilityIconsData: PropTypes.array,
  onHeroPDP: PropTypes.bool,
  isMobile: PropTypes.bool,
  productData: PropTypes.object,
}

SustainabilityExperienceContainer.defaultProps = {
  sustainabilityIconsData: [],
}

export default withErrorBoundaryWrapper(SustainabilityExperienceContainer)
