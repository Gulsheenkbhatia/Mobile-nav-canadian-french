import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import Image from 'toro/components/Image'
import Link from 'toro/components/Link'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import {
  loveAtFirstSwipeProductsAtom,
  loveAtFirstSwipeStatsAtom,
  loveAtFirstSwipeSourcePageAtom,
  loveAtFirstSwipeRecommendationAtom,
} from 'store/love-at-first-swipe.atom'
import { useAtom } from 'jotai'
import { useAtomValue, useUpdateAtom, useResetAtom } from 'jotai/utils'
import RecommendationPrice from 'toro/components/Certona/RecommendationPrice'
import { LoveAtFirstSwipeGridSkeleton } from 'toro/components/LoveAtFirstSwipe/skeleton'
import { useIntl } from 'react-intl'
import LoveAtFirstSwipeMessage from 'toro/components/LoveAtFirstSwipe/message'
import { useMemo } from 'react'
import useRecommAnalytics from 'toro/analytics/useRecommAnalytics'
import useAnalytics from 'toro/analytics/useAnalytics'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import { useLoveAtFirstSwipeRecommendations } from 'toro/hooks/useLoveAtFirstSwipeRecommendations'
import type { LoveAtFirstSwipeProduct } from 'toro/components/LoveAtFirstSwipe/types'
import { XgenContainerID } from 'lib/xgen'
import { RecommendationVendors } from 'lib/vendorProductsAdapter/recommendations/configurations'

export default function LoveAtFirstSwipeGrid() {
  const style = useStyleConfig('LoveAtFirstSwipe')
  const analytics = useAnalytics()
  const [{ playedCount }, setStats] = useAtom(loveAtFirstSwipeStatsAtom)
  const productDirections = useAtomValue(loveAtFirstSwipeProductsAtom)
  const resetProducts = useResetAtom(loveAtFirstSwipeProductsAtom)
  const setSourcePage = useUpdateAtom(loveAtFirstSwipeSourcePageAtom)
  const setLoveAtFirstRecommendation = useUpdateAtom(loveAtFirstSwipeRecommendationAtom)
  const { formatMessage } = useIntl()
  const { isLoading, data: recommender } = useLoveAtFirstSwipeRecommendations()

  const recommenderProducts = recommender?.items ?? []

  const recommenderAnalytics = useRecommAnalytics({
    products: recommenderProducts,
    certonaData: recommender,
  })

  const handleStartOver = () => {
    setStats({
      playedCount: 1,
      lastInteractionTime: Date.now(),
      isPersistentExperienceComplete: false,
    })

    resetProducts()
    setSourcePage('')
    setLoveAtFirstRecommendation(null)

    const prefix = formatMessage({
      id: 'loveAtFirstSwipe.heading',
      defaultMessage: 'Get style recs',
    }).toLowerCase()
    const suffix = formatMessage({
      id: 'loveAtFirstSwipe.buttonStartOver',
      defaultMessage: 'Start over',
    }).toLowerCase()
    analytics.send('loveAtFirstSwipeCTA', {
      eventLabel: `${prefix}:${suffix}`,
      eventLocation: XgenContainerID.sm_el_sitewide2,
    })
  }

  const gridItemCountPerRow = !isLoading ? Math.ceil(recommenderProducts.length / 2) : 4

  const [likedProducts, newProducts] = useMemo(() => {
    const likedProducts: LoveAtFirstSwipeProduct[] = []
    const newProducts: LoveAtFirstSwipeProduct[] = []

    recommenderProducts.forEach((product) => {
      if (!productDirections.left.length || productDirections.right.includes(product.ID)) {
        likedProducts.push(product)
      } else {
        newProducts.push(product)
      }
    })

    return [likedProducts, newProducts]
  }, [recommenderProducts, productDirections])

  const heading = formatMessage({
    id: 'loveAtFirstSwipe.gridHeading',
    defaultMessage: 'You have a great taste!',
  })

  const handleOnClick = (product, idx) => () =>
    recommenderAnalytics.selectRecommItem({
      listName: heading,
      product,
      idx,
      eventLocation: XgenContainerID.sm_el_sitewide2,
      recAIType: RecommendationVendors.XGEN,
    })

  const handleOnVisible = ({ product, idx }) => {
    recommenderAnalytics.addImpression({
      listName: heading,
      product,
      idx,
      certonaScheme: XgenContainerID.sm_el_sitewide2,
      recAIType: RecommendationVendors.XGEN,
      sendOnceInViewport: true,
    })
  }

  if (!isLoading && recommenderProducts.length === 0) {
    const message = formatMessage({
      id: 'loveAtFirstSwipe.messageError',
      defaultMessage: 'Oops... We’re not able to load any products',
    })
    return <LoveAtFirstSwipeMessage message={message} onStartOver={handleStartOver} />
  }

  const renderItemGrid = (recommendedProducts: LoveAtFirstSwipeProduct[], countPerRow: number) => (
    <Box
      sx={style.grid}
      style={{ gridTemplateColumns: `repeat(${Math.max(countPerRow, 2)}, 41vw)` }}
    >
      {isLoading ? (
        <LoveAtFirstSwipeGridSkeleton style={style} />
      ) : (
        recommendedProducts.map((item, idx) => (
          <ImpressionSensor
            key={`love-at-first-swipe-grid-${item.ID}`}
            onVisible={handleOnVisible}
            payload={{ product: item, idx }}
          >
            <Link href={item.detailURL} onClick={handleOnClick(item, idx)}>
              <Box sx={style.gridItem}>
                <Image src={item.imageURL} sx={style.gridItemImage} alt={item.name} />
              </Box>
              <RecommendationPrice
                product={item}
                hidePrice={false}
                scheme={XgenContainerID.sm_el_sitewide2}
                variant="loveAtFirstSwipe"
              />
            </Link>
          </ImpressionSensor>
        ))
      )}
    </Box>
  )

  const shouldRenderGrid =
    (!likedProducts.length || !newProducts.length) && recommenderProducts.length >= 6

  return (
    <Box sx={style.gridContainer} style={{ minHeight: 0 }}>
      <Box sx={style.gridHeader}>
        <Text sx={style.gridHeading}>{heading}</Text>
        <Text sx={style.gridSubHeading}>
          {formatMessage({
            id: 'loveAtFirstSwipe.gridSubHeading',
            defaultMessage: 'Explore these handpicked bags, curated just for you!',
          })}
        </Text>
      </Box>
      {shouldRenderGrid ? (
        renderItemGrid(recommenderProducts, gridItemCountPerRow)
      ) : (
        <>
          {!!likedProducts.length && (
            <>
              <Text sx={style.listHeading}>
                {formatMessage({
                  id: 'loveAtFirstSwipe.listHeadingLikedByYou',
                  defaultMessage: 'Liked by you',
                })}
              </Text>
              {renderItemGrid(likedProducts, likedProducts.length)}
            </>
          )}
          {!!newProducts.length && (
            <>
              <Text sx={style.listHeading}>
                {formatMessage({
                  id: 'loveAtFirstSwipe.listHeadingRecommendedForYou',
                  defaultMessage: 'Recommended for you',
                })}
              </Text>
              {renderItemGrid(newProducts, newProducts.length)}
            </>
          )}
        </>
      )}

      {!isLoading && playedCount === 0 && (
        <Box sx={style.gridControls}>
          <Button sx={style.startOverButton} onClick={handleStartOver}>
            {formatMessage({
              id: 'loveAtFirstSwipe.buttonStartOver',
              defaultMessage: 'Start over',
            })}
          </Button>
        </Box>
      )}
    </Box>
  )
}
