import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Box from 'toro/components/Box'
import RangeSliderThumb from 'toro/components/RangeSlider/RangeSliderThumb'
import RangeSliderTrackbar from 'toro/components/RangeSlider/RangeSliderTrackbar'
import useDimensions from 'toro/hooks/useDimensions'
import clamp from 'toro/helpers/clamp'
import usePreference from 'toro/hooks/usePreference'
import { mapLinear } from 'toro/helpers/interval-mapping'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import { BIG_NUM } from 'toro/constants/math'
import PWAContext from 'components/common/PWAContext'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'

const THUMB_SIZE = 16
const THUMB_SIZE_ACTIVE = 24
const DESKTOP_PLPv3_THUMB_SIZE = 24
const DESKTOP_PLPv3_THUMB_SIZE_ACTIVE = 26

function RangeSlider({ values, limits, onChange, onEnd, zIndexValues }) {
  const sliderStepSize = usePreference({
    groupId: 'searchRefinements',
    preferenceId: 'sliderStepSize',
  })
  const [positions, setPositions] = useState([0, 0])
  const [mouseStartPosition, setMouseStartPosition] = useState(0)
  const [activeThumbId, setActiveThumbId] = useState(-1) // 0 left, 1 right, -1 inactive
  const [isSliding, setIsSliding] = useState(false)
  const [trackbarLength, setTrackbarLength] = useState(0)
  const [stepValue, setStepValue] = useState(1)
  const hostRef = useRef()
  const hostDimensions = useDimensions(hostRef, true)
  const { appData } = useContext(PWAContext)
  const siteId = useMemo(() => appData?.siteId, [])
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)

  const { thumbSize, thumbSizeActive } = useMemo(
    () => ({
      thumbSize: isCompletePlpV3Desktop ? DESKTOP_PLPv3_THUMB_SIZE : THUMB_SIZE,
      thumbSizeActive: isCompletePlpV3Desktop ? DESKTOP_PLPv3_THUMB_SIZE_ACTIVE : THUMB_SIZE_ACTIVE,
    }),
    [isCompletePlpV3Desktop]
  )

  useEffect(() => {
    const step = getSiteValueFromPref(sliderStepSize, siteId, 1)
    setStepValue(step)
  }, [sliderStepSize, siteId])

  useEffect(() => {
    let width = hostRef.current.getBoundingClientRect().width
    if (width === 0) {
      /*
        Sometimes the element isn't visible at render time (e.g. has 'display: none' because it's
        hidden inside an accordion item), then its width is going to be 0. In this case we start
        checking his parents until we find one that has a width > 0, since that's going to be the
        width of this element as well.
        We only go up until <body> so we don't fall into an infinite loop in case all parents have
        0 width.
       */
      let parent = hostRef.current.parentNode
      while (parent && parent.tagName !== 'BODY' && parent.getBoundingClientRect().width === 0) {
        parent = parent.parentNode
      }
      if (parent) {
        width = parent.getBoundingClientRect().width
      }
    }
    width -= thumbSizeActive

    setPositions([0, width])
    setTrackbarLength(width)
  }, [])

  // for resizing events
  useEffect(() => {
    if (hostDimensions) {
      const width = hostDimensions.borderBox.width
      if (width > 0 && width !== trackbarLength) {
        setTrackbarLength(width - thumbSizeActive)
      }
    }
  }, [hostDimensions])

  useEffect(() => {
    if (trackbarLength === 0) {
      return
    }
    const _values = [parseInt(values[0]), parseInt(values[1])]
    if (isNaN(_values[0]) || isNaN(_values[1])) {
      return
    }
    const _positions = mapValuesToThumbsPosition(_values, mapLinear)
    const _clampedPositions = [
      clamp(_positions[0], ...getThumbMoveLimits(0)),
      clamp(_positions[1], ...getThumbMoveLimits(1)),
    ]
    setPositions(_clampedPositions)
  }, [values, limits, trackbarLength])

  useEffect(() => {
    if (isSliding) {
      registerEventListeners()
    } else {
      unregisterEventListeners()
    }

    return () => {
      unregisterEventListeners()
    }
  }, [isSliding])

  function registerEventListeners() {
    window.addEventListener('mousemove', handleThumbMove)
    window.addEventListener('mouseup', handleThumbRelease)
    window.addEventListener('touchmove', handleThumbMove)
    window.addEventListener('touchend', handleThumbRelease)
    window.addEventListener('touchcancel', handleThumbRelease)
  }

  function unregisterEventListeners() {
    window.removeEventListener('mousemove', handleThumbMove)
    window.removeEventListener('mouseup', handleThumbRelease)
    window.removeEventListener('touchmove', handleThumbMove)
    window.removeEventListener('touchend', handleThumbRelease)
    window.removeEventListener('touchcancel', handleThumbRelease)
  }

  function getClosestStepValue(val, thumbId) {
    val = Math.round(val * BIG_NUM) / BIG_NUM
    if (val <= limits[0] && thumbId === 0) {
      return limits[0]
    } else if (val >= limits[1] && thumbId === 1) {
      return limits[1]
    }
    const bigRemainder = Math.floor(val * BIG_NUM) % Math.floor(stepValue * BIG_NUM)
    const bigClosestLowerVal = Math.floor(val * BIG_NUM - Math.abs(bigRemainder))
    const isCloserToLowerVal = Math.abs(bigRemainder / BIG_NUM) < stepValue / 2
    const closestLowerVal = bigRemainder === 0 ? val : bigClosestLowerVal / BIG_NUM
    let out = Math.round(isCloserToLowerVal ? closestLowerVal : closestLowerVal + stepValue)
    // no overlap
    if (thumbId === 0 && out >= values[1]) {
      out = clamp(values[1] - stepValue, limits[0], values[1])
    } else if (thumbId === 1 && out <= values[0]) {
      out = clamp(values[0] + stepValue, values[0], limits[1])
    }

    return out
  }

  function getThumbMoveLimits(thumbId) {
    if (thumbId === 0) {
      // left thumb
      return [0, positions[1]]
    } else if (thumbId === 1) {
      return [positions[0], trackbarLength]
    }
  }

  function getNextValues(moveDelta, thumbId) {
    if (!isSliding && thumbId === -1) {
      return null
    }
    const _positions = [...positions]
    _positions[thumbId] = clamp(_positions[thumbId] + moveDelta, ...getThumbMoveLimits(thumbId))
    const nextValues = [
      thumbId === 0 ? mapThumbPositionToValue(_positions[0], mapLinear) : values[0],
      thumbId === 1 ? mapThumbPositionToValue(_positions[1], mapLinear) : values[1],
    ]
    return [
      thumbId === 0 ? getClosestStepValue(nextValues[0], 0) : values[0],
      thumbId === 1 ? getClosestStepValue(nextValues[1], 1) : values[1],
    ]
  }

  function mapThumbPositionToValue(pos, mapFn) {
    return mapFn(pos, [0, trackbarLength], limits)
  }

  function mapValuesToThumbsPosition(vals, mapFn) {
    if (limits[1] - limits[0] === 0) {
      // avoid Inifinity in mapping division
      return [0, trackbarLength]
    }
    return [
      mapFn(vals[0], limits, [0, trackbarLength]),
      mapFn(vals[1], limits, [0, trackbarLength]),
    ]
  }

  function isTouchEvent(e) {
    return (e.touches && e.touches.length) || (e.changedTouches && e.changedTouches.length)
  }

  function getMousePosX(e) {
    if (isTouchEvent(e)) {
      return e.touches[0]?.clientX ?? e.changedTouches[0].clientX
    } else {
      return e.clientX
    }
  }

  const handleThumbGrab = (thumbId) => (e) => {
    e.stopPropagation()
    if (!isTouchEvent(e)) {
      e.preventDefault()
    }
    if (thumbId !== 0 && thumbId !== 1) {
      return
    }
    const mouseX = getMousePosX(e)
    setMouseStartPosition(mouseX)
    setActiveThumbId(thumbId)
    setIsSliding(true)
  }

  function handleThumbMove(e) {
    if (!isTouchEvent(e)) {
      e.preventDefault()
    }
    const mouseX = getMousePosX(e)
    const _values = getNextValues(mouseX - mouseStartPosition, activeThumbId)
    if (!_values) {
      return
    }
    onChange && onChange(_values)
  }

  function handleThumbRelease(e) {
    if (!isTouchEvent(e)) {
      e.preventDefault()
    }
    const mouseX = getMousePosX(e)
    const _values = getNextValues(mouseX - mouseStartPosition, activeThumbId)
    if (!_values) {
      return
    }
    onEnd && onEnd(_values)
    setActiveThumbId(-1)
    setIsSliding(false)
  }

  function handleHostMouseDown(e) {
    e.preventDefault()
    if (!hostRef.current || trackbarLength === 0) {
      return
    }

    const rect = hostRef.current.getBoundingClientRect()
    if (!rect || rect.width === 0) {
      return
    }

    const mouseX = getMousePosX(e)
    const targetPos = mouseX - rect.left - thumbSizeActive / 2
    let thumbId = 0
    if (targetPos > trackbarLength / 2) {
      thumbId = 1
    }
    const _values = getNextValues(targetPos - positions[thumbId], thumbId)
    if (!_values) {
      return
    }
    onEnd && onEnd(_values)
  }

  return (
    <Box
      ref={hostRef}
      display="flex"
      w="100%"
      h={`${isCompletePlpV3Desktop ? thumbSizeActive : thumbSize}px`}
      position="relative"
      mt={isCompletePlpV3Desktop ? '28px' : 'l'}
      px={`${thumbSizeActive / 2}px`}
      userSelect="none"
      transform="scale(1)"
      onMouseDown={handleHostMouseDown}
      data-qa="plpfltr_price_slider"
    >
      <RangeSliderTrackbar
        values={positions}
        limits={[0, trackbarLength]}
        thumbSize={thumbSize}
        thumbSizeActive={thumbSizeActive}
      />
      {values.map((value, index) => (
        <RangeSliderThumb
          key={index}
          zIndex={zIndexValues[index]}
          active={activeThumbId === index}
          position={positions[index]}
          aria-valuemin={limits[0]}
          aria-valuemax={limits[1]}
          aria-valuenow={value}
          onGrab={handleThumbGrab(index)}
          thumbSize={thumbSize}
          thumbSizeActive={thumbSizeActive}
        />
      ))}
    </Box>
  )
}

export default memo(RangeSlider)
