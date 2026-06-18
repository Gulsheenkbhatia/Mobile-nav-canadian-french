import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useTheme from 'toro/hooks/useTheme'
import { useState, useEffect } from 'react'
import Lazy from 'toro/components/Lazy'
import useViewportType from 'toro/hooks/useViewportType'
import Skeleton from 'toro/components/Skeleton'
import isMobileDevice from 'toro/helpers/isMobileDevice'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import SustainabilityAsset from '../SustainabilityContentAsset'
import { Container } from '@chakra-ui/react'
import { InView } from 'react-intersection-observer'
import PropTypes from 'prop-types'

const SustainableExperienceSlider = function ({
  sustainabilityIconsData,
  sustainableHeaderContent,
}) {
  const theme = useTheme()
  const { isDesktop } = useViewportType()
  const styles = useMultiStyleConfig('PDPRecommendations')
  const styleCard = useMultiStyleConfig('sustainIcons')
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [sustainabilityInViewport, setSustainabilityInViewport] = useState(false)

  const manageVisibility = (visible) => {
    if (visible) {
      setSustainabilityInViewport(true)
    }
  }
  useEffect(() => {
    if (sustainabilityIconsData && sustainabilityInViewport) {
      setShowSkeleton(false)
    }
  }, [sustainabilityInViewport, sustainabilityIconsData])

  let margin = 'initial'
  let flexBasic = 'auto'
  let height = '273px'
  if (!isMobileDevice()) {
    switch (sustainabilityIconsData?.length) {
      case 1:
        margin = 'auto'
        break
      case 5:
        height = isDesktop ? '353px' : height
        break
      case 2:
      case 3:
      case 4:
        flexBasic = 100 / sustainabilityIconsData.length + '%'
        break
    }
  }

  const flex = '0 1 ' + flexBasic
  const marginRight =
    isMobileDevice() && sustainabilityIconsData?.length === 1 ? '' : 'var(--spacing-6)'

  const productItems = sustainabilityIconsData?.map?.((sustainabilityIcon) => {
    return (
      <Box
        key="sustainabilityItem"
        sx={{ ...styleCard.sustainable_card, flex, height, marginRight }}
        minW={isDesktop ? '20%' : '249px'}
      >
        <Flex>
          <Image
            h="50px"
            w="50px"
            key="sustainabilityIcon"
            src={
              sustainabilityIcon?.materialImagePath?.default ||
              'https://images.coach.com/is/image/Coach/coach-brand-image'
            }
          />
        </Flex>
        <Box className="sustain-icons-text_modal" mt="40px" mb="20px" fontSize={theme.fontSizes.md}>
          {sustainabilityIcon?.materialContent?.default}
        </Box>
        <Box fontSize={theme.fontSizes.sm} sx={{ margin }}>
          <SustainabilityAsset html={sustainabilityIcon && sustainabilityIcon.markup} />
        </Box>
      </Box>
    )
  })

  if (productItems?.length > 5) {
    productItems.length = 5
  }
  return (
    <>
      {!!productItems?.length && (
        <Container
          id="sustainability-section"
          maxW="100%"
          m={isDesktop ? '20px 0' : '40px 0'}
          sx={{ overflowX: 'hidden' }}
        >
          <Box minH="260px">
            <Lazy onVisible={manageVisibility}>
              {sustainabilityIconsData && (
                <Box
                  style={{ minHeight: isDesktop ? '233px' : '316px' }}
                  m={'0 auto 32px'}
                  className="content-divider"
                >
                  {sustainabilityIconsData?.length > 0 && (
                    <Flex flexDirection="column" w="100%">
                      <Box
                        as="div"
                        pt={isDesktop ? '25px' : ''}
                        mt="24px"
                        sx={{ ...styles.recommendationSliderWrapper }}
                      >
                        <Flex flexDirection={productItems?.length > 1 ? 'column' : 'row'} w="100%">
                          <Box minW={productItems?.length > 1 ? '249px' : '35%'} sx={{ margin }}>
                            <SustainabilityAsset html={sustainableHeaderContent} />
                          </Box>
                          {!isMobileDevice() &&
                            (productItems?.length > 1 ? (
                              <Flex
                                flexDirection="row"
                                w={productItems?.length > 4 ? '90%' : '100%'}
                                sx={{
                                  '::-webkit-scrollbar': {
                                    display: 'none',
                                  },
                                }}
                              >
                                {productItems}
                              </Flex>
                            ) : (
                              productItems?.[0]
                            ))}
                        </Flex>
                      </Box>

                      {isMobileDevice() && (
                        <Box
                          maxW="100vw"
                          className="mob-recommend"
                          sx={styles.mobileRecommendationWrapper}
                        >
                          <Flex
                            maxWidth="100vw"
                            sx={styles.mobileRecommendationItems}
                            className="mob-recommend-items"
                          >
                            {productItems}
                          </Flex>
                        </Box>
                      )}
                    </Flex>
                  )}
                </Box>
              )}{' '}
            </Lazy>
            {showSkeleton && (
              <InView onChange={manageVisibility} rootMargin="355px 0px -100px 0px">
                <>
                  {!isDesktop ? (
                    <Box w="100%">
                      <Box>
                        <Skeleton height="23px" width="60%" m="22px auto">
                          <Box mb="mar" />
                        </Skeleton>
                      </Box>
                      <Box
                        m="20px"
                        minH="200px"
                        display="flex"
                        flexDirection="row"
                        alignItems="end"
                      >
                        <Box width="40%" mr="20px" display="flex" flexDirection="column">
                          <Skeleton height="160px" width="100%">
                            <Box mb="mar" />
                          </Skeleton>
                        </Box>

                        <Box width="40%" mr="20px" display="flex" flexDirection="column">
                          <Skeleton height="160px" width="100%">
                            <Box mb="mar" />
                          </Skeleton>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box w="100%" maxWidth="1280px" m="auto">
                      <Box>
                        <Skeleton height="14px" width="40%" m="22px auto 13px 20px">
                          <Box mb="mar" />
                        </Skeleton>
                      </Box>
                      <Box>
                        <Skeleton height="68px" width="40%" m="10px auto 32px 20px">
                          <Box mb="mar" />
                        </Skeleton>
                      </Box>
                      <Box
                        m="20px"
                        minH="273px"
                        display="flex"
                        flexDirection="row"
                        alignItems="end"
                      >
                        <Box width="424px" mr="20px" display="flex" flexDirection="column">
                          <Skeleton height="273px" width="100%">
                            <Box mb="mar" />
                          </Skeleton>
                        </Box>

                        <Box width="424px" mr="20px" display="flex" flexDirection="column">
                          <Skeleton height="273px" width="100%">
                            <Box mb="mar" />
                          </Skeleton>
                        </Box>

                        <Box width="424px" mr="20px" display="flex" flexDirection="column">
                          <Skeleton height="273px" width="100%">
                            <Box mb="mar" />
                          </Skeleton>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </>
              </InView>
            )}
          </Box>
        </Container>
      )}
    </>
  )
}

SustainableExperienceSlider.propTypes = {
  productData: PropTypes.object,
}

SustainableExperienceSlider.defaultProps = {
  productData: {},
}

export default withErrorBoundaryWrapper(SustainableExperienceSlider)
