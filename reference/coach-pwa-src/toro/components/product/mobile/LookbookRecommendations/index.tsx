import { type FC, type ReactEventHandler, useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai/utils'

import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import { useLookbookRecommendations } from 'toro/components/product/mobile/LookbookRecommendations/hooks'
import LookbookRecommendationsSkeleton from 'toro/components/product/mobile/LookbookRecommendations/LookbookRecommendationsSkeleton'
import LookbookRecommendationItem from 'toro/components/product/mobile/LookbookRecommendations/LookbookRecommendationItem'
import StylesProvider from 'toro/components/StylesProvider'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { CaretDownIcon, CaretUpIcon } from 'toro/icons'
import { isOneCoachNAEnabledAtom } from 'store/menu-data.atom'

const LOOKBOOK_PRODUCT_LIMIT = 5

const LookbookRecommendations: FC = () => {
  const styles = useMultiStyleConfig('LookbookRecommendations')
  const { isLoading, data } = useLookbookRecommendations()
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollYBeforeExpandRef = useRef<number | null>(null)
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)

  useEffect(() => {
    if (isExpanded) return
    const y = scrollYBeforeExpandRef.current
    if (!y) return

    scrollYBeforeExpandRef.current = null
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: 'smooth' })
    })
  }, [isExpanded])

  if (isLoading)
    return (
      <StylesProvider value={styles}>
        <LookbookRecommendationsSkeleton />
      </StylesProvider>
    )

  const limit = isExpanded ? data.items.length : LOOKBOOK_PRODUCT_LIMIT
  const recommendationItems = data.items.slice(0, limit)
  const isExpandable = LOOKBOOK_PRODUCT_LIMIT < data.items.length

  const expandedButtonClickHandler: ReactEventHandler<HTMLButtonElement> = () => {
    if (!isExpanded) {
      scrollYBeforeExpandRef.current = window.scrollY
      setIsExpanded(true)
      return
    }

    setIsExpanded(false)
  }

  return (
    <StylesProvider value={styles}>
      <Box sx={styles.rootWrapper}>
        <Text as="h2" sx={styles.sectionTitle}>
          {data.containerDisplayName}
        </Text>
        <Box as="ul" sx={styles.itemList}>
          {recommendationItems.map((item) => {
            return (
              <Box as="li" key={item.id} sx={styles.itemListItem}>
                <LookbookRecommendationItem
                  data={item}
                  vendor={data.vendor}
                  containerId={data.containerId}
                  containerLabel={data.containerDisplayName}
                  strategyId={data.strategyId}
                  hideATBIcon={isOneCoachNAEnabled}
                />
              </Box>
            )
          })}
        </Box>
        {isExpandable && (
          <Button onClick={expandedButtonClickHandler} sx={styles.expandableButton}>
            {isExpanded ? 'View Less' : 'View More'}
            {isExpanded ? <CaretUpIcon /> : <CaretDownIcon />}
          </Button>
        )}
      </Box>
    </StylesProvider>
  )
}

export default LookbookRecommendations
