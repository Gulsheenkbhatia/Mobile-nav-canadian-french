import React, { useContext, useRef } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import Text from 'toro/components/Text'
import Slider from 'toro/components/Slider'
import Box from 'toro/components/Box'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import NextArrow from 'toro/components/Certona/Arrows/Right'
import PrevArrow from 'toro/components/Certona/Arrows/Left'
import useTheme from 'toro/hooks/useTheme'
import PopularSearchItem from './PopularSearchItem'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import PWAContext from 'components/common/PWAContext'
import { getSliderSettings } from 'toro/constants/sliderConstants'
import get from 'lodash/get'
import useAnalytics from 'toro/analytics/useAnalytics'

function PopularSearchBlock({ popularSearchesProducts }) {
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const { isMobile, isDesktop, isTablet } = useViewportType()
  const theme = useTheme()
  const sliderRef = useRef()
  const styles = useMultiStyleConfig('NoSearchResultBlock')
  const { appData } = useContext(PWAContext)
  const locale = get(appData, 'locale')
  const POPULAR_SEARCHES_TITLE = formatMessage({
    id: 'search.noSearchresultBlock.populerSearchesTitle',
    defaultMessage: 'Popular Searches',
  })

  const arrowProps = {
    fill: theme.colors.main.black,
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    '&:hover': {
      cursor: 'pointer',
    },
  }

  const sliderSettings = getSliderSettings(isMobile, locale)

  const onArrowClick = ({ currentSlide, type }) => {
    if (type === 'next') {
      sliderRef.current.slickGoTo(currentSlide + 1)
    } else {
      sliderRef.current.slickGoTo(currentSlide - 1)
    }
  }

  const onProductVisible = ({ idx, product }) => {
    analytics.addImpression('viewItemListCategory', [{ ...product, index: idx }])
  }

  return (
    <>
      <Text
        as="h2"
        sx={{
          textAlign: isMobile ? 'none' : 'center',
          fontSize: isMobile ? '20px' : '30px',
          fontFamily: 'var(--font-face1-bold)',
          mb: 8,
          ...styles.searchTitle,
        }}
      >
        {POPULAR_SEARCHES_TITLE}
      </Text>
      <Box
        as="div"
        maxWidth={isMobile ? '375px' : '952px'}
        minWidth={isDesktop ? '952px' : isTablet && '768px'}
        mx="auto"
        px={isMobile ? '10px' : '24px'}
        m="0"
        sx={styles.popularSearchesWrapper}
      >
        <Slider
          ref={sliderRef}
          {...sliderSettings}
          nextArrow={
            <NextArrow
              click={onArrowClick}
              arrowProps={{ marginRight: '-44px', right: '-20px', ...arrowProps }}
              slidesToShow={sliderSettings.slidesToShow}
            />
          }
          prevArrow={
            <PrevArrow click={onArrowClick} arrowProps={{ paddingRight: '9px', ...arrowProps }} />
          }
        >
          {popularSearchesProducts?.map((product, idx) => {
            return (
              <ImpressionSensor
                key={product?.id}
                payload={{ idx, product }}
                onVisible={onProductVisible}
              >
                <PopularSearchItem product={product} />
              </ImpressionSensor>
            )
          })}
        </Slider>
      </Box>
    </>
  )
}

export default PopularSearchBlock
