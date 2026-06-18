import { ComponentType, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import LoveAtFirstSwipeCard from 'toro/components/LoveAtFirstSwipe/card'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import LoveAtFirstSwipeGrid from 'toro/components/LoveAtFirstSwipe/grid'
import Button from 'toro/components/Button'
import LoveAtFirstSwipeMessage from 'toro/components/LoveAtFirstSwipe/message'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import get from 'lodash/get'
import {
  loveAtFirstSwipeProductsAtom,
  loveAtFirstSwipeStatsAtom,
  loveAtFirstSwipeSourcePageAtom,
  loveAtFirstSwipeRecommendationAtom,
} from 'store/love-at-first-swipe.atom'
import { isGoingBackAtom } from 'store/going-back.atom'
import { useAtom } from 'jotai'
import { useAtomValue, useResetAtom } from 'jotai/utils'
import { useIntl } from 'react-intl'
import {
  LoveAtFirstSwipeStackCountSkeleton,
  LoveAtFirstSwipeStackSkeleton,
} from 'toro/components/LoveAtFirstSwipe/skeleton'
import { EXPIRATION_TIME } from 'toro/components/LoveAtFirstSwipe/constants'
import { useInView } from 'react-intersection-observer'
import useAnalytics from 'toro/analytics/useAnalytics'
import usePageType from 'toro/hooks/usePageType'
import { useRouter } from 'next/router'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import { getUrlParts } from 'toro/helpers/url'
import usePreference from 'toro/hooks/usePreference_new'
import { SwipeDirection } from 'toro/hooks/useSwipe'
import { useLoveAtFirstSwipeRecommendations } from 'toro/hooks/useLoveAtFirstSwipeRecommendations'
import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'
import { XgenContainerID } from 'lib/xgen'

const LOVE_AT_FIRST_SWIPE_MAX_STACK_ITEMS = 8

type MultiStyleIcon = Record<string, ComponentType<any>>

type HighlightLikeState = {
  left: number
  right: number
}

const LoveAtFirstSwipe = () => {
  const { isPDP } = usePageType()
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const { ThumbUp, ThumbDown } = useStyleConfig('Icons') as MultiStyleIcon
  const style = useStyleConfig('LoveAtFirstSwipe')
  const [{ lastInteractionTime, isPersistentExperienceComplete }, setStats] =
    useAtom(loveAtFirstSwipeStatsAtom)
  const [productDirections, setProductDirections] = useAtom(loveAtFirstSwipeProductsAtom)
  const [sourcePage, setSourcePage] = useAtom(loveAtFirstSwipeSourcePageAtom)
  const [loveAtFirstRecommendation, setLoveAtFirstRecommendation] = useAtom(
    loveAtFirstSwipeRecommendationAtom
  )
  const resetStats = useResetAtom(loveAtFirstSwipeStatsAtom)
  const resetProducts = useResetAtom(loveAtFirstSwipeProductsAtom)
  const cardsSwiped = productDirections.left.length + productDirections.right.length
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const isGoingBack = useAtomValue(isGoingBackAtom)
  const { asPath } = useRouter()
  const {
    adaptiveExperience: { loveAtFirstSwipe },
  } = usePreference({
    adaptiveExperience: ['loveAtFirstSwipe'],
  })
  const [alphaChannel, setAlphaChannel] = useState<HighlightLikeState>({ left: 0, right: 0 })

  const { data } = useLoveAtFirstSwipeRecommendations({
    enabled: !loveAtFirstRecommendation?.items?.length,
  })

  const maxCards = get(loveAtFirstSwipe, 'maxCards', LOVE_AT_FIRST_SWIPE_MAX_STACK_ITEMS)

  const heading = formatMessage({
    id: 'loveAtFirstSwipe.heading',
    defaultMessage: 'Get style recs',
  })

  const recommender = loveAtFirstRecommendation ? loveAtFirstRecommendation : data
  const cards = useMemo(
    () => recommender?.items?.slice(0, maxCards),
    [recommender?.items, maxCards]
  )
  const recommenderAnalytics = useRecommAnalytics({
    products: cards || [],
    certonaData: recommender,
  })

  const [inViewRef, isInView] = useInView({
    triggerOnce: true,
  })

  const isLoaded = !!recommender

  const isComplete = cards?.length <= cardsSwiped

  const didDislikeAllItems = useMemo(() => {
    if (!recommender) return false
    return isComplete && productDirections.left.length === recommender.items.length
  }, [productDirections, isComplete, recommender])

  useEffect(() => {
    if (lastInteractionTime && Date.now() - lastInteractionTime > EXPIRATION_TIME) {
      resetStats()
      resetProducts()
    }
  }, [])

  useEffect(() => {
    const isSourcePageMatch = getUrlParts(sourcePage)[0] === getUrlParts(asPath)[0]

    if (isGoingBack && isSourcePageMatch && !isPersistentExperienceComplete) {
      wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    if (isPersistentExperienceComplete || isSourcePageMatch || isGoingBack) {
      return
    }

    if (isGoingBack === false && isPDP && sourcePage) {
      return
    }
    resetStats()
    resetProducts()
    setLoveAtFirstRecommendation(null)
  }, [])

  const hasTrackedInitialImpression = useRef(false)

  useEffect(() => {
    if (isInView && cards && !hasTrackedInitialImpression.current) {
      const product = cards?.[cardsSwiped]
      if (!product) return
      hasTrackedInitialImpression.current = true
      recommenderAnalytics.addImpression({
        listName: heading.toLowerCase(),
        product,
        idx: cardsSwiped,
        certonaScheme: XgenContainerID.sm_el_sitewide2,
        recAIType: RecommendationVendors.XGEN,
        sendOnceInViewport: true,
      })
    }
  }, [isInView, cards, recommenderAnalytics])

  useEffect(() => {
    if (isInView && data?.items) {
      setLoveAtFirstRecommendation(data)
    }
  }, [isInView, data])

  const dislikeButtonStyle = useMemo(
    () => ({
      backgroundImage: `
              linear-gradient(rgba(194, 33, 33, ${alphaChannel.left}), rgba(194, 33, 33, ${alphaChannel.left})),
              linear-gradient(#000, #000)
              `,
    }),
    [alphaChannel.left]
  )

  const likeButtonStyle = useMemo(
    () => ({
      backgroundImage: `
              linear-gradient(rgba(5, 117, 80, ${alphaChannel.right}), rgba(5, 117, 80, ${alphaChannel.right})), 
              linear-gradient(#000, #000)
              `,
    }),
    [alphaChannel.right]
  )

  const handleOnSwiped = (direction: 'left' | 'right', index: number) => {
    if (cardsSwiped >= recommender.items?.length - 1) {
      setStats((previousStats) => ({
        ...previousStats,
        lastInteractionTime: Date.now(),
        isPersistentExperienceComplete: true,
      }))
      setSourcePage('')
    }

    setProductDirections((previousDirections) => ({
      ...previousDirections,
      [direction]: [...previousDirections[direction], recommender.items[index].ID],
    }))

    const product = recommender.items[index + 1]
    if (!product) return
    recommenderAnalytics.addImpression({
      listName: heading.toLowerCase(),
      product,
      idx: index,
      certonaScheme: XgenContainerID.sm_el_sitewide2,
      recAIType: RecommendationVendors.XGEN,
      sendOnceInViewport: true,
    })
  }

  const handleOnViewItem = (idx) => () => {
    setSourcePage(asPath)
    const product = cards?.[idx]
    recommenderAnalytics.selectRecommItem({
      listName: heading.toLowerCase(),
      product,
      idx,
      eventLocation: XgenContainerID.sm_el_sitewide2,
      recAIType: RecommendationVendors.XGEN,
    })
  }

  const handleOnStartOver = (message) => () => {
    analytics.send('loveAtFirstSwipeCTA', {
      eventLabel: message.toLowerCase(),
    })
    resetProducts()
    setLoveAtFirstRecommendation(null)
  }

  const handleLike = () => {
    handleOnSwiped('right', cardsSwiped)
  }

  const handleDislike = () => {
    handleOnSwiped('left', cardsSwiped)
  }

  const handleHighlightLikeButton = useCallback(
    ({ value, direction }: { value: number; direction: SwipeDirection }) => {
      setAlphaChannel((prevState) => ({
        ...prevState,
        [direction]: value,
      }))
    },
    []
  )

  if (recommender && (!recommender.display || cards?.length === 0)) {
    return null
  }

  if (didDislikeAllItems) {
    const message = formatMessage({
      id: 'loveAtFirstSwipe.messageDislikedAll',
      defaultMessage: 'It looks like these weren’t your style. Stay tuned for new arrivals.',
    })
    const suffix = formatMessage({
      id: 'loveAtFirstSwipe.buttonStartOver',
      defaultMessage: 'Start over',
    })
    return (
      <LoveAtFirstSwipeMessage
        message={message}
        onStartOver={handleOnStartOver(`${message}:${suffix}`)}
      />
    )
  }

  if (isComplete) {
    return <LoveAtFirstSwipeGrid />
  }

  return (
    <Box ref={inViewRef} sx={style.container}>
      <Box sx={style.header} ref={wrapperRef}>
        <Text sx={style.heading}>{heading}</Text>
        <Text sx={style.subHeading}>
          {formatMessage({
            id: 'loveAtFirstSwipe.subHeading',
            defaultMessage: 'Swipe left to discard, swipe right to love',
          })}
        </Text>
      </Box>
      <Box sx={style.stack}>
        {cards?.map((item, index) => (
          <LoveAtFirstSwipeCard
            key={`love-at-first-swipe-${index}-${item.ID}`}
            index={index}
            position={index - cardsSwiped}
            onSwiped={handleOnSwiped}
            product={item}
            style={style}
            onClick={handleOnViewItem(index)}
            onHighlightLikeButton={handleHighlightLikeButton}
          />
        ))}

        {!isLoaded && <LoveAtFirstSwipeStackSkeleton style={style} />}
      </Box>

      <Box sx={style.footer}>
        <Box sx={style.clear}>
          {isLoaded ? (
            <Text sx={style.counter}>
              {cardsSwiped + 1} / {cards.length}
            </Text>
          ) : (
            <LoveAtFirstSwipeStackCountSkeleton style={style} />
          )}
        </Box>
        <Box sx={style.buttonThumbs}>
          <Button
            onClick={handleDislike}
            sx={{
              ...style.thumb,
              ...style.thumbDisLike,
            }}
            style={dislikeButtonStyle}
          >
            <ThumbDown />
          </Button>
          <Button
            onClick={handleLike}
            sx={{
              ...style.thumb,
              ...style.thumbLike,
            }}
            style={likeButtonStyle}
          >
            <ThumbUp />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default LoveAtFirstSwipe
