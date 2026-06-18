import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import ShopByProductsListing from 'toro/components/list/ProductListingPage/ShopBy/ShopByProductsListing'
import { useMultiStyleConfig } from '@chakra-ui/react'
import { NavChevronDownIcon } from 'toro/icons'
import Button from 'toro/components/Button'
import CircularProgress from 'toro/components/CircularProgress'
import { usePaginatedProducts } from 'toro/components/list/ProductListingPage/ShopBy/helpers'
import HtmlContent from 'toro/components/HtmlContent'
import usePreference from 'toro/hooks/usePreference_new'

const ShopByCategorySection = ({ sectionData, cellStartIndex, onModelPlpSequence }) => {
  const {
    priceType,
    suppressMaterial,
    pageType,
    isSPC,
    isFPC,
    isComparablePriceEnabledCategory,
    enableAddToBag,
    categoryImageSequence,
    sectionTitle = '',
    contentAsset,
    refvalue,
  } = sectionData

  const { products, loadMoreProducts, hasMorePages, isLoading } = usePaginatedProducts(sectionData)

  const styles = useMultiStyleConfig('ShopByProductListingPage', {
    hasContentAsset: !!contentAsset,
  })

  const {
    priceSitePreferences: { isComparablePriceValue },
  } = usePreference({
    priceSitePreferences: ['isComparablePriceValue'],
  })

  return (
    <Box sx={styles.categorySection} id={refvalue}>
      <Text as="h2" sx={styles.sectionTitle}>
        {sectionTitle}
      </Text>

      {contentAsset && <HtmlContent content={contentAsset} />}

      <ShopByProductsListing
        products={products}
        cellStartIndex={cellStartIndex}
        priceType={priceType}
        isComparablePriceValue={isComparablePriceValue}
        suppressMaterial={suppressMaterial}
        pageType={pageType}
        isSPC={isSPC}
        isFPC={isFPC}
        isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
        enableAddToBag={enableAddToBag}
        categoryImageSequence={categoryImageSequence}
        onModelPlpSequence={onModelPlpSequence}
      />

      {hasMorePages && (
        <Box sx={styles.viewMoreContainer}>
          <Button
            sx={styles.viewMoreButton}
            onClick={loadMoreProducts}
            disabled={isLoading}
            data-qa="wayFinderViewMoreCta"
          >
            <Text as="span" sx={styles.viewMoreText}>
              View More {sectionTitle}
            </Text>

            {isLoading ? (
              <Box sx={styles.circularProgressContainer}>
                <CircularProgress
                  isIndeterminate
                  color="var(--color-black-base)"
                  size="var(--spacing-4)"
                />
              </Box>
            ) : (
              <NavChevronDownIcon
                width="24px"
                height="24px"
                data-qa="plpfltr_icon_fltr_acord_down_arrow"
              />
            )}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default ShopByCategorySection
