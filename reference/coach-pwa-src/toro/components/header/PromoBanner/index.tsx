import { useEffect, useState, useRef, FunctionComponent, useMemo } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import Center from 'toro/components/Center'
import HtmlContent from 'toro/components/HtmlContent'
import Box from 'toro/components/Box'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import { PromoBannerData } from 'toro/components/header/PromoBanner/parser'
import SplideSlider, { Arrow } from 'toro/components/SplideSlider'

const JQUERY_FN_PATTERN = '$('
const PROMO_BANNER_CLASS = 'promo-item-wrapper'
const SVG_REGEX = /<svg[^>]*>|<\/svg>/g

// Inline SVG icon components to allow CSS color styling
const NavChevronIcon = ({ svgContent, className }: { svgContent: string; className?: string }) => {
  const cleanedContent = svgContent.replace(SVG_REGEX, '')
  return <svg className={className} dangerouslySetInnerHTML={{ __html: cleanedContent }} />
}

const createArrowsConfig = ({ formatMessage, styles, ChevronLeft, ChevronRight }) => {
  const arrowProps = {
    next: {
      'aria-label': formatMessage({
        id: 'header.promoBanner.next',
        defaultMessage: 'Next',
      }),
      'data-qa': 'hdr_btn_promo_banner_next',
    },
    prev: {
      'aria-label': formatMessage({
        id: 'header.promoBanner.previous',
        defaultMessage: 'Previous',
      }),
      'data-qa': 'hdr_btn_promo_banner_prev',
    },
  }

  const sliderStyles = {
    container: styles.bannerContainer,
    arrows: styles.bannerArrows,
  }

  const LeftArrow = (
    <Arrow
      styles={sliderStyles}
      arrowProps={arrowProps}
      isArrowVisible={true}
      leftArrowIcon={() => <NavChevronIcon svgContent={ChevronLeft} />}
    />
  )

  const RightArrow = (
    <Arrow
      isNext
      styles={sliderStyles}
      arrowProps={arrowProps}
      isArrowVisible={true}
      rightArrowIcon={() => <NavChevronIcon svgContent={ChevronRight} />}
    />
  )

  return { LeftArrow, RightArrow, arrowProps, sliderStyles }
}

const PromoBanner: FunctionComponent<PromoBannerData> = ({ items = [], scriptContents }) => {
  const { isMobile } = useViewportType()
  const { formatMessage } = useIntl()
  const rootBannerNode = useRef(null)
  const { contentUpdated, onClick } = useCmsAnalytics(rootBannerNode)
  const styles = useMultiStyleConfig('PromoBanner', undefined)
  const { ChevronLeftRaw, ChevronRightRaw } = useMultiStyleConfig('Icons')
  const { LeftArrow, RightArrow, arrowProps, sliderStyles } = useMemo(
    () =>
      createArrowsConfig({
        formatMessage,
        styles,
        ChevronLeft: ChevronLeftRaw,
        ChevronRight: ChevronRightRaw,
      }),
    [formatMessage, styles, ChevronLeftRaw, ChevronRightRaw]
  )

  // due to delay between page loading and slider displaying we added a plug to avoid blinking
  const [isMounted, setIsMounted] = useState(false)

  const options = {
    type: 'loop',
    pagination: false,
    interval: 4000,
    width: '100vw',
    autoplay: true,
    pauseOnHover: true,
    arrows: items?.length > 1,
  }

  useEffect(() => contentUpdated())

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (scriptContents && scriptContents.length > 0) {
      scriptContents.forEach((script) => {
        // prevent injecting of jQuery scripts
        if (script.includes(JQUERY_FN_PATTERN)) return

        const scriptEl = document.createElement('script')
        scriptEl.innerHTML = script
        document.head.appendChild(scriptEl)
      })
    }
  }, [scriptContents])

  if (items.length === 0) return null

  const containerMinHeight = isMobile ? '76px' : '37px'

  return (
    <Box
      sx={{ ...styles.bannerMainWrapper, ...styles.containerMaxHeight }}
      minHeight={containerMinHeight}
      className="header-promo-banner"
      position="relative"
      onClick={onClick}
      ref={rootBannerNode}
      data-qa="promo_banner_header"
    >
      <Center w="100%" className="header-banner">
        {isMounted ? (
          <SplideSlider
            options={options}
            arrowProps={arrowProps}
            styles={sliderStyles}
            modifiedThumbnailsArrows={{
              prevCustomArrow: LeftArrow,
              nextCustomArrow: RightArrow,
            }}
          >
            {items.map((item, idx) => (
              <HtmlContent key={idx} className={PROMO_BANNER_CLASS} {...item} />
            ))}
          </SplideSlider>
        ) : (
          <Box
            sx={{
              ...styles.bannerTemplateWrapper,
              ...styles.bannerArrows,
              ...styles.bannerTemplateArrows,
            }}
          >
            <NavChevronIcon svgContent={ChevronLeftRaw} className="left-arrow" />
            <HtmlContent className={PROMO_BANNER_CLASS} {...items[0]} />
            <NavChevronIcon svgContent={ChevronRightRaw} className="right-arrow" />
          </Box>
        )}
      </Center>
    </Box>
  )
}

export default withErrorBoundaryWrapper(PromoBanner)
