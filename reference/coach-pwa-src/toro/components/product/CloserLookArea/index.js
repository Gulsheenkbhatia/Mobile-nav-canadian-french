import React, { useState, useCallback } from 'react'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Grid from 'toro/components/Grid'
import Image from 'toro/components/Image'
import Hidden from 'toro/components/Hidden'
import Heading from 'toro/components/Heading'
import useTheme from 'toro/hooks/useTheme'
import useViewportType from 'toro/hooks/useViewportType'
import Skeleton from 'toro/components/Skeleton'
import Center from 'toro/components/Center'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { InView } from 'react-intersection-observer'
import PropTypes from 'prop-types'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'

function CloserLookArea({ cLHeader, cLText, cLImageSuffix, closerLookImageSrc, variant }) {
  const theme = useTheme()
  const themeStyles = useMultiStyleConfig('CloserLookArea', { variant: variant })
  const { isDesktop, isMobile } = useViewportType()
  const closerLookConstraints = !!cLImageSuffix && !!cLHeader && !!cLText && !!closerLookImageSrc
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [errorOnImageLoad, setErrorOnImageLoad] = useState(false)
  const isPdpV3BelowTheFoldExperiment = useExperiment(EXPERIMENTS.PDP_V3_BELOW_THE_FOLD) && isMobile

  const manageSkeleton = () => {
    setShowSkeleton(false)
  }

  const handleError = () => {
    setErrorOnImageLoad(true)
    manageSkeleton()
  }

  const closerlookSection = useCallback((node) => {
    if (node) {
      const config = { childList: true, subtree: true }

      const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
          if (mutation?.type === 'childList') {
            const imgs = node.getElementsByTagName('img')
            for (const img of imgs) {
              if (!img.complete) {
                img.addEventListener('load', manageSkeleton)
                img.addEventListener('error', handleError)
              }
            }
          }
        }
        observer?.disconnect()
      }

      const mutationObserver = new MutationObserver(callback)
      mutationObserver.observe(node, config)
    }
  }, [])

  if (errorOnImageLoad) return null

  return (
    <Box
      id="closerlook-section"
      position="relative"
      ref={closerlookSection}
      sx={themeStyles.mainContainer()}
    >
      <InView rootMargin="710px 0px -100px 0px">
        <Box minH={closerLookConstraints && '500px'}>
          {isDesktop && closerLookConstraints && (
            <Hidden onNonDesktop w="100%">
              <hr />
              <Flex as="div" wrap justify="center">
                <Grid templateColumns="repeat(2, 1fr)" w="70%">
                  <Box w="100%" h="100%">
                    <Box mt="48px" justify="center">
                      <Image
                        src={`${closerLookImageSrc}?$desktopProduct$`}
                        lazy
                        onImageLoad={manageSkeleton}
                      />
                    </Box>
                  </Box>
                  <Box mt="170px" mr="55px">
                    <Heading
                      as="h2"
                      mb="6px"
                      size="2xl"
                      textAlign="center"
                      lineHeight={theme.lineHeights.xl}
                      fontFamily={theme.fontFamily.secondaryNormal}
                      fontWeight="normal"
                      sx={themeStyles.closerLookHeading}
                    >
                      {cLHeader}
                    </Heading>
                    <Box
                      fontSize="sm"
                      size="normal"
                      textAlign="center"
                      fontWeight="normal"
                      lineHeight={theme.lineHeights.sm}
                      sx={themeStyles.closerLookText}
                    >
                      {cLText}
                    </Box>
                  </Box>
                </Grid>
              </Flex>
            </Hidden>
          )}
          {closerLookConstraints && (
            <Hidden onDesktop sx={themeStyles.hiddenWrapperCloserLook}>
              <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD}>
                <hr />
              </Experiment>
              <Flex as="div" wrap justify="center">
                <Box sx={themeStyles.mobileCloserlookWrapper()}>
                  <Box w="100%">
                    <Box sx={themeStyles.mobileCloserlookImageWrapper()} justify="center">
                      <Image
                        src={`${closerLookImageSrc}?${
                          isPdpV3BelowTheFoldExperiment ? '$mobileProductV3$' : '$mobileProduct$'
                        }`}
                        aspectImgRatio={isPdpV3BelowTheFoldExperiment ? 0.8 : 1}
                        pdp={true}
                        lazy
                        onImageLoad={manageSkeleton}
                      />
                    </Box>
                  </Box>
                  <Box
                    className="closerlook-copy-container"
                    mt="30px"
                    mb="20px"
                    sx={themeStyles.closerLookContainer}
                  >
                    <Heading
                      className="closerlook-copy-heading"
                      as="h2"
                      size="2xl"
                      lineHeight={theme.lineHeights.md}
                      fontFamily={theme.fontFamily.secondaryNormal}
                      textAlign="center"
                      sx={themeStyles.mobileCloserlookHeading()}
                    >
                      {cLHeader}
                    </Heading>
                    <Box
                      className="closerlook-copy-body"
                      fontSize="sm"
                      size="normal"
                      textAlign="center"
                      m="15px 24px 0px 22px"
                      fontWeight="normal"
                      sx={themeStyles.mobileCloserlookText()}
                    >
                      {cLText}
                    </Box>
                  </Box>
                </Box>
              </Flex>
            </Hidden>
          )}
        </Box>
      </InView>
      {showSkeleton && closerLookConstraints && (
        <Box>
          <Hidden onDesktop w="100%">
            <Box h="540px">
              <Box mt="56px">
                <Skeleton height="420px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
            </Box>
          </Hidden>
          {isDesktop && (
            <Hidden onNonDesktop w="100%">
              <Box>
                <Center mr="10%" mt="40px" mb="40px" ml="10%">
                  <Grid columnGap="mar" width="100%" templateColumns="repeat(2, 1fr)">
                    <Box>
                      <Skeleton height="462px" width="100%">
                        <Box mb="mar" />
                      </Skeleton>
                    </Box>
                    <Box>
                      <Skeleton
                        height="32px"
                        width="calc(100% - 64px)"
                        mr="32px"
                        ml="32px"
                        mt="200px"
                        mb="40px"
                      >
                        <Box mb="mar" />
                      </Skeleton>
                      <Skeleton height="72px" width="100%">
                        <Box mb="mar" />
                      </Skeleton>
                    </Box>
                  </Grid>
                </Center>
              </Box>
            </Hidden>
          )}
        </Box>
      )}
    </Box>
  )
}

CloserLookArea.propTypes = {
  cLHeader: PropTypes.string,
  cLText: PropTypes.string,
  cLImageSuffix: PropTypes.string,
  closerLookImageSrc: PropTypes.string,
}

CloserLookArea.defaultProps = {
  cLHeader: '',
  cLText: '',
}

export default withErrorBoundaryWrapper(CloserLookArea)
