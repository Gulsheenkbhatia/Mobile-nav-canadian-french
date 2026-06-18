import React from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Image from 'toro/components/Image'
import SaveForLater from 'toro/components/SaveForLater'
import { getProductImageSrc } from 'toro/helpers/productImages'
import getAPIURL from 'helpers/getAPIURL'
import get from 'lodash/get'
import PopularSearchItemPrice from 'toro/components/NoSearchResultBlock/PopularSearchItemPrice'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function PopularSearchItem({ product }) {
  const { isMobile, isDesktop, viewport } = useViewportType()
  const isPriceShow = get(product, 'isPriceShow')
  const priceData = {
    discountPercentage: get(product, 'c_maxSalePercent'),
    pricesRangeArr: get(product, 'priceRanges'),
    maxRangePrice: get(product, 'priceMax'),
    minRangePrice: get(product, 'price'),
  }
  const styles = useMultiStyleConfig('NoSearchResultBlock')

  return (
    <>
      <Box sx={styles.popularSearchItemContainer({ isDesktop, isMobile })}>
        <Link
          href={product.url}
          prefetchUrl={getAPIURL(product.url)}
          sx={{
            textDecoration: 'none',
          }}
        >
          <Box as="div" w={isMobile ? '131px' : isDesktop ? '200px' : '141px'}>
            <Box bg="#EFEFEF">
              <Image
                src={getProductImageSrc(product?.imageGroups[0]?.images[0]?.link, viewport, 'plp')}
                h={isMobile ? '155px' : isDesktop ? '250px' : '175px'}
                w={isMobile ? '131px' : isDesktop ? '200px' : '141px'}
                objectFit="cover"
              />
            </Box>
          </Box>
        </Link>
        <Link
          href={product.url}
          prefetchUrl={getAPIURL(product.url)}
          sx={{
            textDecoration: 'none',
          }}
        >
          <Text
            mt="mar"
            fontSize="16px"
            color="var(--color-black-base)"
            fontWeight="normal"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            padding="0 4px 0 12px"
            fontFamily="var(--font-face2-normal)"
            w={isMobile ? '131px' : isDesktop ? '200px' : '141px'}
            sx={styles.productName}
          >
            {product.name}
          </Text>
        </Link>
        {isPriceShow && <PopularSearchItemPrice priceData={priceData} styles={styles} />}
        <Box
          right={isMobile ? '-2px' : '0px'}
          top={isMobile ? '-10px' : '-5px'}
          position="absolute"
        >
          <SaveForLater name={product.name} selectedVariant={product} />
        </Box>
      </Box>
    </>
  )
}

export default PopularSearchItem
