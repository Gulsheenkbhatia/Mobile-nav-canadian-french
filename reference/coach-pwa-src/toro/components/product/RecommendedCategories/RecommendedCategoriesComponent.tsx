import RecommendedCategory from 'toro/components/product/RecommendedCategories/RecommendedCategory'
import { useIntl } from 'react-intl'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import { Collapse } from '@chakra-ui/react'
import Button from 'toro/components/Button'
import { useMemo, useState, useRef, useCallback, type FC } from 'react'
import { NavChevronDownIcon, NavChevronUpIcon } from 'toro/icons'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useAtomValue } from 'jotai/utils'
import isEmpty from 'lodash/isEmpty'
import menuDataAtom from 'store/menu-data.atom'
import pick from 'lodash/pick'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useInView } from 'react-intersection-observer'
import usePageType from 'toro/hooks/usePageType'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import chunk from 'lodash/chunk'
import debounce from 'lodash/debounce'
import get from 'lodash/get'

const COLLAPSIBLE_HEIGHT = '255px'
const COLLAPSIBLE_HEIGHT_WITH_PRODUCTS = '448px'
const ENABLE_COLLAPSIBLE_LENGTH = 4
const MAX_CATEGORIES = 8

type CategoryData = {
  name: string
  navFlyoutImage: string
  navImageUrl: string
  url: string
}

const getRecommendedCategoriesData = (
  categoryId: string,
  categoriesID: string[] = [],
  menuData: object
): CategoryData[] => {
  const categoryProps = ['name', 'url', 'navImageUrl', 'navFlyoutImage', 'searchName']
  const categoriesIDInRightOrder = [...categoriesID]

  if (!!categoryId?.length) {
    if (categoriesIDInRightOrder.indexOf(categoryId) > -1) {
      categoriesIDInRightOrder.splice(categoriesIDInRightOrder.indexOf(categoryId), 1)
      categoriesIDInRightOrder.unshift(categoryId)
    } else {
      categoriesIDInRightOrder.unshift(categoryId)
    }
  }

  return categoriesIDInRightOrder
    .slice(0, MAX_CATEGORIES)
    .map((categoryID: string) => {
      const categoryData = menuData[categoryID]
      if (!isEmpty(categoryData)) {
        return pick(categoryData, categoryProps)
      }
      return null
    })
    .filter((category): category is CategoryData | null => category !== null)
}

interface RecommendedCategoriesProps {
  categoryId?: string
  recommendCategories?: { catIDs: string[]; assetType?: string }
  isComparablePriceEnabledCategory?: boolean
  variant?: string
}

const RecommendedCategories: FC<RecommendedCategoriesProps> = ({
  categoryId,
  recommendCategories,
  variant,
  isComparablePriceEnabledCategory,
}) => {
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const { isPLP, isPDP } = usePageType()
  const tileImpressionsToSend = useRef([])

  const isExperimentDisplayProductsEnabledOnPLP = useExperiment(
    EXPERIMENTS.RECOMMENDED_CATEGORIES_DISPLAY_PRODUCTS_PLP
  )
  const isExperimentDisplayProductsEnabledOnPDP = useExperiment(
    EXPERIMENTS.RECOMMENDED_CATEGORIES_DISPLAY_PRODUCTS_PDP
  )

  const assetType = get(recommendCategories, 'assetType', '_a0')

  const isExperimentDisplayProductsEnabled =
    (isPDP && isExperimentDisplayProductsEnabledOnPDP) ||
    (isPLP && isExperimentDisplayProductsEnabledOnPLP)

  const styles = useMultiStyleConfig('RecommendedCategories', {
    variant,
  })
  const menuData = useAtomValue(menuDataAtom)
  const categoriesData = useMemo(() => {
    return getRecommendedCategoriesData(categoryId, recommendCategories?.catIDs, menuData)
  }, [categoryId, recommendCategories, menuData])
  const [isViewedMore, setIsViewedMore] = useState(false)
  const MenuButtonIcon = useMemo(
    () => (isViewedMore ? NavChevronUpIcon : NavChevronDownIcon),
    [isViewedMore]
  )
  const openCategoriesState = useState(
    categoriesData.reduce((accumulator, _, index) => {
      return {
        ...accumulator,
        [index]: index === 0,
      }
    }, {})
  )

  const areAllCategoriesCollapsed = Object.values(openCategoriesState[0]).every((isOpen) => !isOpen)

  const startingHeight = isExperimentDisplayProductsEnabled
    ? areAllCategoriesCollapsed
      ? COLLAPSIBLE_HEIGHT
      : COLLAPSIBLE_HEIGHT_WITH_PRODUCTS
    : COLLAPSIBLE_HEIGHT

  const title = formatMessage({
    id: 'pdp.product.recommendedCategories.label',
    defaultMessage: 'More Categories',
  })

  const showLessButtonText = formatMessage({
    id: 'pdp.product.recommendedCategories.showLess',
    defaultMessage: 'Show Less',
  })

  const showMoreButtonText = formatMessage({
    id: 'pdp.product.recommendedCategories.showMore',
    defaultMessage: 'See More Categories',
  })

  const viewMoreButtonText = isViewedMore ? showLessButtonText : showMoreButtonText

  const handleViewMoreButtonOnClick = () => {
    setIsViewedMore((previousState) => !previousState)

    analytics.send(isPLP ? 'listInteraction' : 'productInteraction', {
      eventAction: isExperimentDisplayProductsEnabled
        ? 'recommended category module dropdown click'
        : 'recommended category module click',
      eventLabel: `${title}: ${viewMoreButtonText}`,
    })
  }

  const [inViewRef] = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (inView) {
        analytics.send(isPLP ? 'listInteraction' : 'productInteraction', {
          eventAction: 'recommended category module impression',
          eventLabel: title,
          eventLocation: 'recommended category module',
        })
      }
    },
  })

  const sendTileImpressions = useCallback(
    debounce(() => {
      const visibilityChunks = chunk(tileImpressionsToSend.current, 3)
      visibilityChunks.forEach((visibilityChunk) => {
        analytics.send('viewItemListCategory', {
          items: [...visibilityChunk],
          eventLocation: 'recommended category module',
        })
      })
      tileImpressionsToSend.current = []
    }, 300),
    [analytics]
  )

  if (!categoriesData.length) {
    return null
  }

  const shouldBeCollapsible = categoriesData.length > ENABLE_COLLAPSIBLE_LENGTH

  const handleClick = (buttonText: string, isOpen: boolean) => {
    const eventType = isPLP ? 'listInteraction' : 'productInteraction'
    const eventAction = isExperimentDisplayProductsEnabled
      ? 'recommended category module dropdown click'
      : 'recommended category module click'

    if (!isExperimentDisplayProductsEnabled || !isOpen) {
      analytics.send(eventType, {
        eventAction,
        eventLabel: `${title}: ${buttonText}`,
        eventLocation: 'recommended category module',
      })
    }
  }

  const onProductVisible = (product) => {
    tileImpressionsToSend.current.push({
      ...product,
      item_list_name: title,
      item_list_id: categoryId,
    })

    sendTileImpressions()
  }

  return (
    <Flex
      ref={inViewRef}
      sx={styles.recommendedCategoriesWrapper}
      id={isPLP ? 'recommended-categories-plp' : 'recommended-categories-pdp'}
    >
      <Text sx={styles.recommendedCategoriesLabel}>{title}</Text>
      <>
        <ConditionalWrapper
          condition={shouldBeCollapsible}
          Wrapper={Collapse}
          startingHeight={startingHeight}
          in={isViewedMore}
        >
          <Flex sx={styles.recommendedCategoriesInnerContainer}>
            {categoriesData.map((category, index) => (
              <RecommendedCategory
                categoryData={category}
                styles={styles}
                key={`${category?.name}-${index}`}
                handleClick={handleClick}
                openCategoriesState={openCategoriesState}
                index={index}
                isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
                isExperimentDisplayProductsEnabled={isExperimentDisplayProductsEnabled}
                onVisible={onProductVisible}
                title={title}
                assetType={assetType}
              />
            ))}
          </Flex>
        </ConditionalWrapper>
        {shouldBeCollapsible && (
          <Button onClick={handleViewMoreButtonOnClick} sx={styles.recommendedCategoriesMenuButton}>
            {viewMoreButtonText}
            <MenuButtonIcon width="24px" height="24px" />
          </Button>
        )}
      </>
    </Flex>
  )
}

export default RecommendedCategories
