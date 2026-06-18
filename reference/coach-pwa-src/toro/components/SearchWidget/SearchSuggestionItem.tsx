import { useState, useMemo, type ComponentType } from 'react'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Text from 'toro/components/Text'
import Price from 'toro/components/Price'
import PriceDetails from 'toro/components/PriceDetails'
import withOneSite from 'toro/hocs/withOneSite'
import Image from 'toro/components/Image'
import get from 'lodash/get'
import Flex from 'toro/components/Flex'
import Fill from 'toro/components/Fill'
import Hidden from 'toro/components/Hidden'
import ProductTileImageDesktop from 'toro/components/list/ProductTile/ProductTileImageDesktop'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import usePricePreferences, { type PricePreferences } from 'toro/hooks/usePricePreferences'
import usePreference from 'toro/hooks/usePreference_new'
import { MOBILE_VARIANTS } from 'toro/constants/mobileVariants'
import type { SearchWidgetVariant } from 'toro/components/SearchWidget'
import { SystemStyleObject } from '@chakra-ui/react'
import { SearchSuggestionProduct } from 'toro/types/productTypes'

function getMedia(color) {
  return get(color, 'media')
}

type SearchSuggestionPriceProps = {
  product: SearchSuggestionProduct
  variant?: string
  isSearchSuggestionFormat?: boolean
  isComparablePriceValue: boolean
  pricePreferences: PricePreferences
  isSearchSuggestion: boolean
  isRecommendation: boolean
  hideComparablePrice?: unknown
  hideDiscountedRate?: unknown
}

const SearchSuggestionPrice = withOneSite(
  PriceDetails,
  Price
) as ComponentType<SearchSuggestionPriceProps>

type SearchSuggestionItemProps = {
  product: SearchSuggestionProduct
  styleVariant: SearchWidgetVariant
  isComparablePriceValue: boolean
  onClick: () => void
  onVisible: () => void
  styles: Record<string, SystemStyleObject>
}
function SearchSuggestionItem({
  product,
  styleVariant,
  isComparablePriceValue,
  onClick,
  onVisible,
  styles,
}: SearchSuggestionItemProps) {
  const { defaultColor, url: activeUrl } = product
  const name = get(product, 'name', '')

  const pricePreferences = usePricePreferences()
  const {
    searchSuggestions: { enableAltImages: isEnabledAltImages = false },
  } = usePreference({
    SearchSuggestions: ['enableAltImages'],
  })

  const isBundleProduct =
    get(product, 'hitType') === 'set' || get(product, 'productType.set', false)

  const hideComparablePrice = get(
    product,
    'hideComparablePriceValue',
    get(product, 'custom.c_hideComparablePriceValue')
  )
  const hideDiscountedRate = get(
    product,
    'hideDiscountedRate',
    get(product, 'custom.c_hideDiscountRate')
  )

  const activeMedia = useMemo(
    () => (isBundleProduct ? getMedia(product) : getMedia(defaultColor)),
    [defaultColor, product, isBundleProduct]
  )

  const variant = useMemo(() => {
    if (styleVariant === 'mobileV2') {
      return 'searchSuggestionsMobileV2'
    }

    if (MOBILE_VARIANTS.includes(styleVariant)) {
      return 'searchSuggestionsExposed'
    }

    return 'searchSuggestions'
  }, [styleVariant])

  const isSearchSuggestion = ![...MOBILE_VARIANTS, 'mobileV2'].includes(styleVariant)

  const imageSrc = isBundleProduct
    ? get(product, 'media.thumbnails.0.src')
    : get(product, 'defaultColor.media.thumbnail.src') || get(product, 'media.thumbnail.src')
  const imageAlt = get(product, 'thumbnail.alt')
  const [isParentHovered, setIsParentHovered] = useState(false)
  const [isParentFocused, setIsParentFocused] = useState(false)

  function handleMouseOverParent() {
    setIsParentHovered(true)
  }

  function handleMouseOutParent() {
    setIsParentHovered(false)
  }

  function handleFocusParent() {
    setIsParentFocused(true)
  }

  function handleBlurParent() {
    setIsParentFocused(false)
  }

  return (
    <>
      <Hidden onNonDesktop flexGrow="1" flexBasis="0" maxWidth="194">
        <ImpressionSensor onVisible={onVisible}>
          <Box position="relative" mr="12px" data-qa="cm_hs_bsp_tile">
            <Box
              name="searchSuggestionItemWrapper"
              sx={styles.searchSuggestionItemWrapper}
              position="relative"
              onMouseOver={handleMouseOverParent}
              onMouseOut={handleMouseOutParent}
              data-qa={styleVariant === 'footer' ? 'cm_sugg_tile_pdtimg' : 'd_hs_sugg_tile_pdtimg'}
            >
              <Link
                href={activeUrl}
                onClick={onClick}
                onFocus={handleFocusParent}
                onBlur={handleBlurParent}
              >
                <Fill height="125%">
                  {isEnabledAltImages ? (
                    <ProductTileImageDesktop
                      displayedThumbnails={activeMedia?.thumbnails}
                      isParentHovered={isParentHovered}
                      isParentFocused={isParentFocused}
                      color={defaultColor}
                      height="228px"
                      width="182px"
                    />
                  ) : (
                    <Box>
                      <Image
                        name="searchSuggestionItemLinkImage"
                        sx={styles.searchSuggestionItemLinkImage}
                        lazy
                        src={imageSrc}
                      />
                    </Box>
                  )}
                </Fill>
              </Link>
            </Box>
            <Box p="s">
              <Link href={activeUrl} onClick={onClick}>
                <Text
                  name="searchSuggestionItemText"
                  sx={styles.searchSuggestionItemText}
                  variant="body-text-secondary"
                  size="md"
                  data-qa={
                    styleVariant === 'footer' ? 'cm_sugg_tile_pdtname' : 'd_hs_sugg_tile_pdtname'
                  }
                >
                  {name}
                </Text>
              </Link>
            </Box>
            <Box
              name="searchSuggestionItemPriceWrapper"
              sx={styles.searchSuggestionItemPriceWrapper}
              data-qa="cm_txt_finalprice"
            >
              <SearchSuggestionPrice
                product={product}
                variant="searchSuggestions"
                isSearchSuggestionFormat
                isComparablePriceValue={isComparablePriceValue}
                pricePreferences={pricePreferences}
                isSearchSuggestion
                isRecommendation={true}
                hideComparablePrice={hideComparablePrice}
                hideDiscountedRate={hideDiscountedRate}
              />
            </Box>
          </Box>
        </ImpressionSensor>
      </Hidden>
      <Hidden onDesktop>
        <ImpressionSensor onVisible={onVisible}>
          <Link href={activeUrl} onClick={onClick}>
            <Flex
              name="searchSuggestionItemFooterWrapper"
              sx={styles.searchSuggestionItemFooterWrapper}
            >
              <Box
                name="searchSuggestionItemFooterImage"
                sx={styles.searchSuggestionItemFooterImage}
                width="64px"
                minWidth="64px"
                data-qa={
                  styleVariant === 'footer' ? 'cm_sugg_tile_pdtimg' : 'm_hs_sugg_tile_pdtimg'
                }
              >
                <Image
                  sx={{
                    minHeight: '80px',
                    ...(styles.searchSuggestionItemFooterImageElement || {}),
                  }}
                  imgResponsive={{ minHeight: '80px' }}
                  src={imageSrc}
                  alt={imageAlt}
                />
              </Box>
              <Flex
                name="searchSuggestionItemFooterProductName"
                sx={styles.searchSuggestionItemFooterProductName}
              >
                <Text
                  name="searchSuggestionItemFooterProductText"
                  sx={styles.searchSuggestionItemFooterProductText}
                  variant="body-text-secondary"
                  size="md"
                  data-qa={
                    styleVariant === 'footer' ? 'cm_sugg_tile_pdtname' : 'm_hs_sugg_tile_pdtname'
                  }
                >
                  {product?.name}
                </Text>
                <Box
                  name="searchSuggestionItemFooterPrice"
                  sx={styles.searchSuggestionItemFooterPrice}
                >
                  <Price
                    product={product}
                    isSearchSuggestionFormat
                    variant={variant}
                    isComparablePriceValue={isComparablePriceValue}
                    pricePreferences={pricePreferences}
                    isSearchSuggestion={isSearchSuggestion}
                    isRecommendation={true}
                    hideComparablePrice={hideComparablePrice}
                    hideDiscountedRate={hideDiscountedRate}
                  />
                </Box>
              </Flex>
            </Flex>
          </Link>
        </ImpressionSensor>
      </Hidden>
    </>
  )
}

export default SearchSuggestionItem
