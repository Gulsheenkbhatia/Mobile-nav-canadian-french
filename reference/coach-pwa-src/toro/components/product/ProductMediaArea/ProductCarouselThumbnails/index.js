import { useEffect, useMemo, useState, memo, useCallback } from 'react'
import useTheme from 'toro/hooks/useTheme'
import ProductCarouselThumbnail from 'toro/components/product/ProductMediaArea/ProductCarouselThumbnail'
import Button from 'toro/components/Button'
import Chevron from 'toro/components/Chevron'
import Box from 'toro/components/Box'
import { get } from 'react-hook-form'
import { getFileBaseName } from 'toro/components/product/ProductMediaArea/helpers'
import SplideSlider from 'toro/components/SplideSlider'
import PropTypes from 'prop-types'
import memoize from '@formatjs/fast-memoize'
import useHasMounted from 'toro/hooks/useHasMounted'

const PER_PAGE = 3

export const Arrow = ({ isNext = false, onSwatchInteraction, activeIdx, thumbnails }) => {
  const theme = useTheme()
  const colorBlack = '#000000'
  const onClick = useCallback(() => {
    const imageSrc = getFileBaseName(thumbnails[activeIdx]?.src)
    onSwatchInteraction?.(imageSrc, 'scroll view', activeIdx)
  }, [thumbnails[activeIdx]?.src, onSwatchInteraction])

  return (
    <Button
      variant="unstyled"
      h="100%"
      w="100%"
      zIndex="1"
      className={`splide__arrow splide__arrow--${isNext ? 'next' : 'prev'}`}
      sx={{
        borderStyle: 'none',
        '&:focus': {
          boxShadow: 'none',
        },
      }}
      data-qa={
        isNext ? 'pdp_icon_carousel_img_nav_down_arrow' : 'pdp_icon_carousel_img_nav_up_arrow'
      }
      onClick={onClick}
    >
      <Chevron
        borderColor={theme.colors.main.secondary}
        styles={{
          transform: `rotate(${isNext ? '135' : '315'}deg)`,
          top: isNext ? '15px' : '6px',
          width: 18,
          height: 18,
          borderColor: colorBlack,
          borderWidth: '2px 2px 0 0',
        }}
        data-qa={
          isNext ? 'qv_icon_carousel_img_nav_down_arrow' : 'qv_icon_carousel_img_nav_up_arrow'
        }
      />
    </Button>
  )
}

/**
 * PDP media carousel thumbnails. Scrollable and selectable
 *
 * @param  {Array} thumbnails contains thumbnails data items (src, alt, type)
 * @param  {number} activeIdx currently selected item index
 * @param  {Function} setActiveIdx method to set selected item index
 */
function ProductCarouselThumbnails({
  thumbnails,
  activeIdx,
  setActiveIdx,
  isQuickView,
  isModalOpened,
  onSwatchInteraction,
  label,
  modalActiveIndex,
  brand,
}) {
  const thumbsOptions = {
    type: 'loop',
    direction: 'ttb',
    pagination: false,
    gap: isQuickView ? '8px' : '15px',
    width: '100%',
    height: isQuickView ? '255px' : '400px',
    cover: true,
    perPage: PER_PAGE,
    isNavigation: true,
  }

  const [uniqueKey, setUniqueKey] = useState('1')
  const hasMounted = useHasMounted()

  const customizedArrows = useMemo(
    () => ({
      nextCustomArrow: (
        <Arrow
          thumbnails={thumbnails}
          activeIdx={activeIdx}
          onSwatchInteraction={onSwatchInteraction}
        />
      ),
      prevCustomArrow: (
        <Arrow
          isNext
          thumbnails={thumbnails}
          activeIdx={activeIdx}
          onSwatchInteraction={onSwatchInteraction}
        />
      ),
    }),
    [thumbnails, activeIdx, onSwatchInteraction]
  )

  const onThumbnailClick = useCallback(
    memoize((idx) => () => {
      setActiveIdx(idx)
      const imageSrc = getFileBaseName(thumbnails?.[idx]?.src)
      onSwatchInteraction?.(imageSrc, isModalOpened ? 'zoom click' : 'click', idx)
    }),
    []
  )

  useEffect(() => {
    if (isModalOpened) {
      setActiveIdx(modalActiveIndex)
      const imageSrc = getFileBaseName(thumbnails?.[modalActiveIndex]?.src)
      onSwatchInteraction?.(imageSrc, 'zoom', modalActiveIndex)
    }
  }, [isModalOpened])

  useEffect(() => {
    setUniqueKey(thumbnails[0]?.src)
  }, [thumbnails])

  const fitOneSlide = (thumbnails?.length || 0) <= PER_PAGE

  return (
    <Box maxHeight={isQuickView ? '400px' : '527px'} key={uniqueKey} h="100%">
      {!fitOneSlide && hasMounted ? (
        <SplideSlider
          options={{
            ...thumbsOptions,
            start: isModalOpened ? modalActiveIndex : activeIdx,
            type: thumbnails?.length > 2 ? 'loop' : 'slide',
            arrows: thumbnails?.length > 2,
          }}
          styles={{
            container: {
              marginTop: thumbnails?.length > 3 ? 'var(--spacing-12)' : '0',
            },
          }}
          onIndexChange={setActiveIdx}
          modifiedThumbnailsArrows={customizedArrows}
        >
          {thumbnails.map((data, idx) => (
            <ProductCarouselThumbnail
              key={get(data, 'src')}
              src={get(data, 'src')}
              data={data}
              variant="common"
              onClick={onThumbnailClick(idx)}
              label={label}
              isQuickView={isQuickView}
              isFirstThumbnail={idx === 0}
              isLastThumbnail={idx === thumbnails.length - 1}
            />
          ))}
        </SplideSlider>
      ) : (
        <Box pt={fitOneSlide ? '0' : '29px'}>
          {!fitOneSlide && (
            <Box position="relative" left="-10px" top="-10px">
              {customizedArrows.nextCustomArrow}
            </Box>
          )}
          {thumbnails.slice(0, PER_PAGE).map((data, idx) => (
            <Box mb={fitOneSlide ? '8px' : '29px'} ml="3px" key={get(data, 'src')}>
              <ProductCarouselThumbnail
                src={get(data, 'src')}
                data={data}
                variant={activeIdx === idx ? 'carouselDisabled' : 'common'}
                onClick={onThumbnailClick(idx)}
                isQuickView={isQuickView}
              />
            </Box>
          ))}
          {!fitOneSlide && (
            <Box position="relative" left="13px" top="-22px">
              {customizedArrows.prevCustomArrow}
            </Box>
          )}
        </Box>
      )}
      {thumbnails?.length === 0 && (
        <ProductCarouselThumbnail
          data={{ src: '', alt: `${brand} Brand Image`, type: 'image' }}
          variant="active"
          onClick={onThumbnailClick(0)}
          label={label}
          isQuickView={isQuickView}
        />
      )}
    </Box>
  )
}

ProductCarouselThumbnails.propTypes = {
  thumbnails: PropTypes.array,
  activeIdx: PropTypes.number,
  setActiveIdx: PropTypes.func,
  isQuickView: PropTypes.bool,
  isModalOpened: PropTypes.bool,
  onSwatchInteraction: PropTypes.func,
  label: PropTypes.string,
  modalActiveIndex: PropTypes.number,
  onThumbnailChange: PropTypes.func,
  brand: PropTypes.string,
  siteId: PropTypes.string,
}
ProductCarouselThumbnails.defaultProps = {
  setActiveIdx: () => {},
  onSwatchInteraction: () => {},
  modalActiveIndex: 0,
  thumbnails: [],
  onThumbnailChange: () => {},
}

export default memo(ProductCarouselThumbnails)
