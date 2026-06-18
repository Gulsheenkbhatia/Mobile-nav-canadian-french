import { useState, useEffect, useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'

interface AnimationState {
  active: boolean
  complete: boolean
  sliding: boolean
}

interface UseAddToBagAnimationProps {
  isPDPv6: boolean
  isAtbDisabled: boolean
  addToCart: (e?: React.MouseEvent<HTMLButtonElement>) => Promise<void>
}

interface UseAddToBagAnimationReturn {
  animationState: AnimationState
  addToCartWithAnimation: (e?: React.MouseEvent<HTMLButtonElement>) => Promise<void>
  progressClassName: string
  textSliderClassName: string
  progressText: string
  isAnimating: boolean
}

const useAddToBagAnimation = ({
  isPDPv6,
  isAtbDisabled,
  addToCart,
}: UseAddToBagAnimationProps): UseAddToBagAnimationReturn => {
  const { formatMessage } = useIntl()

  // Consolidated animation state
  const [animationState, setAnimationState] = useState<AnimationState>({
    active: false,
    complete: false,
    sliding: false,
  })

  // Handle animation states
  useEffect(() => {
    if (!isPDPv6) return

    if (animationState.active) {
      setAnimationState((prev) => ({ ...prev, sliding: true }))
    }
    if (animationState.complete) {
      const timeoutId = setTimeout(() => {
        setAnimationState({ active: false, complete: false, sliding: false })
        // 150ms we use to make the completion animation match the speed of the process animation.
      }, 150)
      return () => clearTimeout(timeoutId)
    }
  }, [animationState.active, animationState.complete, isPDPv6])

  // Enhanced addToCart function with animation
  const addToCartWithAnimation = useCallback(
    async (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (isPDPv6 && !isAtbDisabled) {
        setAnimationState({ active: true, complete: false, sliding: false })
        try {
          await addToCart(e)
          setAnimationState((prev) => ({ ...prev, active: false, complete: true }))
        } catch (error) {
          setAnimationState({ active: false, complete: false, sliding: false })
          throw error
        }
      } else {
        await addToCart(e)
      }
    },
    [isPDPv6, isAtbDisabled, addToCart]
  )

  // Memoize progress class name
  const progressClassName = useMemo(
    () =>
      `progress ${animationState.active ? 'active' : animationState.complete ? 'complete' : ''}`,
    [animationState.active, animationState.complete]
  )

  // Memoize text slider class name
  const textSliderClassName = useMemo(
    () => `text-slider ${animationState.sliding ? 'sliding' : ''}`,
    [animationState.sliding]
  )

  // Memoize progress text
  const progressText = useMemo(
    () =>
      formatMessage({
        id: 'pdp.product.addToBagProgressMobile',
        defaultMessage: 'Adding to Bag...',
      }),
    [formatMessage]
  )

  // Helper to check if animation is in progress
  const isAnimating = useMemo(
    () => animationState.active || animationState.sliding,
    [animationState.active, animationState.sliding]
  )

  return {
    animationState,
    addToCartWithAnimation,
    progressClassName,
    textSliderClassName,
    progressText,
    isAnimating,
  }
}

export default useAddToBagAnimation
