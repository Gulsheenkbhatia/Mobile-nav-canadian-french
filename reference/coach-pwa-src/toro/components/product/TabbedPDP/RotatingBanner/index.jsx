import React, { useState, useEffect, useReducer, useRef } from 'react'
import { useMultiStyleConfig, useSafeLayoutEffect } from '@chakra-ui/react'
import Box from 'toro/components/Box'

const messageReducer = (state, action) => {
  switch (action.type) {
    case 'remove':
      state.splice(action?.index, 1)
      return state
    case 'reset':
      return [...action.messages]
    default:
      return state
  }
}

const RotatingBanner = ({
  rotationMessages,
  isPaused,
  variant = '',
  setShiftSlideMethod = undefined,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const directionRef = useRef('right')
  const styles = useMultiStyleConfig('RotatingBanner', { variant })
  const [messages, dispatch] = useReducer(messageReducer, rotationMessages)

  const shiftSlide = (newDirection) => {
    directionRef.current = newDirection
    if (newDirection === 'right') {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length)
    } else {
      setCurrentMessageIndex((prevIndex) => (prevIndex === 0 ? messages.length - 1 : prevIndex - 1))
    }
  }

  useEffect(() => {
    if (setShiftSlideMethod) {
      setShiftSlideMethod(shiftSlide)
    }
  }, [setShiftSlideMethod, shiftSlide])

  useSafeLayoutEffect(() => {
    const handleSlideRemoval = ({ detail }) => {
      dispatch({ type: 'remove', index: detail?.index ?? 0 })
      setCurrentMessageIndex(0)
    }

    window.addEventListener('toro:on-remove-callout-slide', handleSlideRemoval)

    return () => {
      window.removeEventListener('toro:on-remove-callout-slide', handleSlideRemoval)
    }
  }, [])

  useEffect(() => {
    dispatch({ type: 'reset', messages: rotationMessages })
  }, [rotationMessages])

  useEffect(() => {
    let intervalId = null

    if (!isPaused && messages.length > 1) {
      intervalId = setInterval(() => {
        shiftSlide('right')
      }, 4000) // 4 seconds interval
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isPaused, messages])

  const getSlideStyles = (index) => {
    if (directionRef.current === 'right') {
      if (index === currentMessageIndex) {
        return styles.slideActive
      }
      if (
        index === currentMessageIndex - 1 ||
        (currentMessageIndex === 0 && index === messages.length - 1)
      ) {
        return styles.slidePrev
      }
    } else {
      if (index === currentMessageIndex) {
        return styles.slideActiveLeft
      }
      if (
        index === currentMessageIndex + 1 ||
        (currentMessageIndex === messages.length - 1 && index === 0)
      ) {
        return styles.slidePrevRight
      }
    }
    return {}
  }

  if (!messages.length) {
    return null
  }

  return (
    <Box sx={styles.rotatingBannerContainer} className="rotating-banner">
      {messages.map((message, index) => (
        <Box key={index} sx={{ ...styles.slide, ...getSlideStyles(index) }}>
          {message}
        </Box>
      ))}
    </Box>
  )
}

export default RotatingBanner
