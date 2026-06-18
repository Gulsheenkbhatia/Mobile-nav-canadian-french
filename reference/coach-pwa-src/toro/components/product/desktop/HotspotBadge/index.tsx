import { FC, useEffect, useRef } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Tooltip from 'toro/components/Tooltip'
import { HotspotBadgeIcon, PlusIcon } from 'toro/icons'
import useDisclosure from 'toro/hooks/useDisclosure'
import { SystemStyleObject } from '@chakra-ui/react'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import useViewportType from 'toro/hooks/useViewportType'

export type HotSpot = {
  x: number | string
  y: number | string
  title: string
  icon: string
  styleVariant?: string
  titleAbove?: boolean
  setCloseTooltip?: (onClose: () => void) => void
  onClick?: (isOpen?: boolean) => void
}

type HotSpotChildProps = {
  title: string
  styles: Record<string, SystemStyleObject | any>
  titleAbove?: boolean
  setCloseTooltip?: (onClose: () => void) => void
  onClick?: (isOpen?: boolean) => void
}

type HotSpotTitleProps = {
  title: string
  styles: Record<string, SystemStyleObject | any>
}

const convertCoordinates = (coordinate: number | string) => {
  return typeof coordinate === 'number' ? `${coordinate}px` : coordinate
}

const HotSpotIconWithTooltip: FC<HotSpotChildProps> = ({
  title,
  styles,
  setCloseTooltip,
  onClick,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const { isMobile } = useViewportType()
  const tooltipWrapperRef = useRef(null)
  useEffect(() => {
    setCloseTooltip?.(onClose)
  }, [setCloseTooltip])

  useOutsideClick({
    enabled: isMobile,
    ref: tooltipWrapperRef,
    handler: onClose,
  })

  const handleClick = () => {
    onToggle()
    onClick?.(isOpen)
  }

  return (
    <Box
      ref={tooltipWrapperRef}
      onClick={handleClick}
      sx={styles.tooltipWrapper}
      className={isOpen ? ' open' : ''}
      onMouseLeave={!isMobile && isOpen ? onToggle : null} // need for correct placing in chain with card hover effect
    >
      <Tooltip
        placement="bottom"
        label={title}
        fontSize="xs"
        hasArrow
        arrowSize={8}
        isOpen={isOpen}
        shouldWrapChildren
        offset={[0, 30]}
        sx={styles.tooltip}
      >
        <PlusIcon />
      </Tooltip>
    </Box>
  )
}

const HotSpotTitle: FC<HotSpotTitleProps> = ({ title, styles }) => {
  return (
    <Box sx={styles.hotspotTitle} className="hotspot-title">
      {title?.replace(/(\d+\.\d{2})\d*/, '$1')}
    </Box>
  )
}

const HotSpotBadge: FC<HotSpotChildProps> = ({ title, styles, titleAbove }) => {
  return (
    <>
      {titleAbove && <HotSpotTitle styles={styles} title={title} />}
      <HotspotBadgeIcon />
      {!titleAbove && <HotSpotTitle styles={styles} title={title} />}
    </>
  )
}

const HotSpotAreaContainer: FC<HotSpot> = ({
  x,
  y,
  title,
  icon,
  styleVariant,
  titleAbove,
  setCloseTooltip,
  onClick,
}) => {
  const styles = useMultiStyleConfig('HotspotBadge', { variant: styleVariant })

  return (
    <Flex
      sx={styles.hotspotWrapper}
      top={convertCoordinates(y)}
      left={convertCoordinates(x)}
      className={`${icon} hotspot-wrapper`}
    >
      {styleVariant === 'tooltip' ? (
        <HotSpotIconWithTooltip
          title={title}
          styles={styles}
          setCloseTooltip={setCloseTooltip}
          onClick={onClick}
        />
      ) : (
        <HotSpotBadge title={title} styles={styles} titleAbove={titleAbove} />
      )}
    </Flex>
  )
}

export default HotSpotAreaContainer
