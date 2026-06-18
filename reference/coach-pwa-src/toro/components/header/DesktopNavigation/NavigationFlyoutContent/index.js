import React, { useState, useCallback } from 'react'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import HtmlContent from 'toro/components/HtmlContent'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const NavigationFlyoutContent = (content) => {
  const themeStyles = useMultiStyleConfig('DesktopNavigationFlyoutContentPage')
  const { title, pictureHtml } = content
  const [isHovered, setIsHovered] = useState(false)
  const onMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])
  const onMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])
  return (
    <Flex sx={themeStyles.navigationFlyoutContentContainer}>
      <Box onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {title && isHovered && (
          <>
            <Text
              variant="body-primary"
              size="lg"
              sx={themeStyles.navigationFlyoutContentText}
              position="absolute"
              bottom="5%"
              right="5%"
              zIndex={1}
            >
              {title}
            </Text>
            <Box
              w="100%"
              h="auto"
              position="absolute"
              sx={themeStyles.navigationFlyoutContentBox}
            />
          </>
        )}
        <HtmlContent content={pictureHtml} sx={{ img: { width: 'auto' } }} />
      </Box>
    </Flex>
  )
}

export default withErrorBoundaryWrapper(NavigationFlyoutContent)
