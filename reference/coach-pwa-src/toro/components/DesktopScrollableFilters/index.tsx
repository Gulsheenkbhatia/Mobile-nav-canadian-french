import React, { memo, useState } from 'react'
import Flex from 'toro/components/Flex'
import { NavChevronLeftIcon, NavChevronRightIcon } from 'toro/icons'
import Button from 'toro/components/Button'
import ScrollableContent from 'toro/components/ScrollableContent'

interface DesktopScrollableFiltersProps {
  isDisplayPaginationArrows?: boolean
  [key: string]: any
}

const ARROW_DEFAULTS = {
  variant: 'icon-only',
  p: '0',
  size: 'content',
  zIndex: 2,
}

const DesktopScrollableFilters: React.FC<DesktopScrollableFiltersProps> = ({
  children,
  isDisplayPaginationArrows = false,
  ...rest
}) => {
  const [scrollRef, setScrollRef] = useState(null)
  const [fadingClassNames, setFadingClassNames] = useState('')

  const handleScrollByClick = (direction) => {
    if (!scrollRef) return
    const { scrollLeft } = scrollRef
    let targetScrollLeft = scrollLeft
    const scrollWidth = 150
    if (direction === 'left') {
      targetScrollLeft -= scrollWidth
    } else if (direction === 'right') {
      targetScrollLeft += scrollWidth
    }

    scrollRef.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    })
  }

  return (
    <Flex alignItems="center" position="relative" minWidth="1px">
      {isDisplayPaginationArrows && !fadingClassNames?.includes('leftFadeHidden') && (
        <Button
          {...ARROW_DEFAULTS}
          position="absolute"
          left={0}
          onClick={() => handleScrollByClick('left')}
          data-qa="left_arrow_scrollable_content"
        >
          <NavChevronLeftIcon width="24" height="24" viewBox="0 0 24 24" />
        </Button>
      )}
      <ScrollableContent
        wrapperStyles={{ gap: 'var(--spacing-3)' }}
        fadeColor="var(--color-neutral-light-1)"
        variant="desktopFilterV3"
        setScrollRef={setScrollRef}
        setFadingChildClassNames={setFadingClassNames}
        {...rest}
      >
        {children}
      </ScrollableContent>

      {isDisplayPaginationArrows && !fadingClassNames?.includes('rightFadeHidden') && (
        <Button
          {...ARROW_DEFAULTS}
          position="absolute"
          right={0}
          onClick={() => handleScrollByClick('right')}
          data-qa="right_arrow_scrollable_content"
        >
          <NavChevronRightIcon width="24" height="24" viewBox="0 0 24 24" />
        </Button>
      )}
    </Flex>
  )
}

export default memo(DesktopScrollableFilters)
