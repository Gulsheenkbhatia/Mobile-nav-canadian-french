import Link from 'toro/components/Link'
import Image from 'toro/components/Image'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import get from 'lodash/get'
import { NavChevronRightIcon, NavChevronDownIcon, NavChevronUpIcon } from 'toro/icons'
import { useCallback, useEffect, useState } from 'react'
import fetch from 'helpers/fetch'
import dynamic from 'next/dynamic'
import useAnalytics from 'toro/analytics/useAnalytics'

const RecommendedCategoryProduct = dynamic(
  () => import('toro/components/product/RecommendedCategories/RecommendedCategoryProduct'),
  { ssr: false }
)

const RecommendedCategoryProductsSkeleton = dynamic(
  () => import('toro/components/product/RecommendedCategories/RecommendedCategoryProductsSkeleton'),
  { ssr: false }
)

type CategoryData = {
  name: string
  navFlyoutImage: string
  navImageUrl: string
  url: string
  searchName?: string
}

const RecommendedCategory = ({
  categoryData,
  styles,
  handleClick: handleClickFromParent,
  openCategoriesState,
  index,
  isComparablePriceEnabledCategory,
  isExperimentDisplayProductsEnabled,
  onVisible,
  title,
  assetType,
}: {
  categoryData: CategoryData
  styles: {
    [key: string]: any
  }
  handleClick: (buttonText: string, isOpen: boolean) => void
  defaultOpen?: boolean
  openCategoriesState: any
  index: number
  isComparablePriceEnabledCategory?: boolean
  isExperimentDisplayProductsEnabled: boolean
  onVisible: (product: any) => void
  title: string
  assetType?: string
}) => {
  const analytics = useAnalytics()
  const { name, navFlyoutImage, navImageUrl, url, searchName } = categoryData
  const displayName = searchName || name
  const imageSrc = `${navFlyoutImage || navImageUrl}?$mobileThumbnail$`
  const [openCategories, setOpenCategories] = openCategoriesState
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const isOpen = openCategories[index]
  const Wrapper = isExperimentDisplayProductsEnabled ? Box : Link

  const Chevron = isExperimentDisplayProductsEnabled
    ? isOpen
      ? NavChevronUpIcon
      : NavChevronDownIcon
    : NavChevronRightIcon

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api${url}`).then((response) => response.json())
      setProducts(get(response, 'pageData.products').slice(0, 3))
    } catch (errorFetchingRecommendedCategoryProducts) {
      console.error(errorFetchingRecommendedCategoryProducts)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    const closedCategories = Object.keys(openCategories).reduce((accumulator, categoryIndex) => {
      return {
        ...accumulator,
        [categoryIndex]: false,
      }
    }, {})
    setOpenCategories((previouslyOpenedCategories) => ({
      ...closedCategories,
      [index]: !previouslyOpenedCategories[index],
    }))
    handleClickFromParent(displayName, isOpen)
  }

  useEffect(() => {
    if (isOpen && products.length === 0 && !isLoading && isExperimentDisplayProductsEnabled) {
      fetchProducts()
    }
  }, [isOpen, products.length, isLoading, isExperimentDisplayProductsEnabled])

  const handleProductClick = useCallback(
    (product) => {
      analytics.send('selectItem', {
        product,
        eventLocation: 'recommended category module',
        itemListName: title,
      })
    },
    [title]
  )

  return (
    <Wrapper href={url} className="recommended-category" onClick={handleClick}>
      <Flex sx={styles.recommendedCategoryWrapper}>
        <Flex alignItems="center">
          <Box sx={styles.recommendedCategoryImageWrapper}>
            <Image src={imageSrc} alt={displayName} />
          </Box>
          <Text sx={styles.recommendedCategoryTitle}>{displayName}</Text>
        </Flex>
        <Chevron width="16px" height="16px" />
      </Flex>
      {isOpen && isExperimentDisplayProductsEnabled && (
        <>
          {isLoading ? (
            <RecommendedCategoryProductsSkeleton styles={styles} />
          ) : (
            <Box sx={styles.recommendedProducts}>
              {products.map((product) => (
                <RecommendedCategoryProduct
                  product={product}
                  isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
                  key={`recommended-category-product-${product.id}`}
                  styles={styles}
                  onVisible={onVisible}
                  onProductClick={handleProductClick}
                  assetType={assetType}
                />
              ))}
              <Link href={url} sx={styles.recommendedCategoryFinalProductLink}>
                {displayName}
              </Link>
            </Box>
          )}
        </>
      )}
    </Wrapper>
  )
}

export default RecommendedCategory
