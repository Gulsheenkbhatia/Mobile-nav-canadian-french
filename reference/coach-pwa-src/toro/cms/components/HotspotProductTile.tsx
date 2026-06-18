import React from 'react'
import { Box, Link, Text, Img } from '@chakra-ui/react'
import { HotspotProductData } from 'toro/cms/helpers/productDataToHotspotHTML'

type HotspotProductTileProps = {
  productData: HotspotProductData
}

const HotspotProductTile = ({ productData }: HotspotProductTileProps) => {
  const { prodName, relativeProdUrl, ID, formattedPrice, defaultImage } = productData

  return (
    <Box data-pid={ID}>
      <Box className="cms-product-tile-3">
        <Box className="product-tile">
          {defaultImage.src && (
            <Box>
              <Link
                data-event="internal_promotion"
                data-location-id="hotspot"
                data-creative-slot="1"
                href={relativeProdUrl}
                className="product-tile__image-wrapper"
              >
                <Box className="product-tile__image">
                  <Img src={defaultImage.src} alt={defaultImage.alt} />
                </Box>
              </Link>
            </Box>
          )}
          <Box className="product-tile__lower-section">
            <Box className="product-tile__title pdp-link" data-qa="masl_link_prodHeart">
              <Link
                href={relativeProdUrl}
                data-qa="cm_pdt_link_pt_title"
                title={prodName}
                data-location="title-hotspot"
                data-custom-link="true"
              >
                {prodName}
              </Link>
            </Box>
            <Box className="product-tile__price" data-qa="product_tile_pricing_wrapper">
              <Box className="price">
                <Box
                  className="price-container"
                  data-final-sale-text="Final Sale"
                  data-qa="cm_txt_finalprice"
                >
                  {formattedPrice.salePrice ? (
                    <Text className="sales" as="span">
                      <Text
                        className="value"
                        as="span"
                        data-sale-indicator="productNotOnSale"
                        data-qa="cm_txt_pdt_price"
                      >
                        {formattedPrice.salePrice}
                      </Text>
                    </Text>
                  ) : (
                    <Text
                      className="sales"
                      as="span"
                      data-final-sale-text="Final Sale"
                      data-qa="cm_txt_finalprice"
                    >
                      <Text
                        className="sales lower-rangelimit"
                        as="span"
                        data-sale-indicator="productNotOnSale"
                        data-qa="cm_txt_pdt_price_lower_rl"
                      >
                        {formattedPrice.min}
                      </Text>
                      -
                      <Text
                        className="sales upper-rangelimit"
                        as="span"
                        data-sale-indicator="productNotOnSale"
                        data-qa="cm_txt_pdt_price_upper_rl"
                      >
                        {formattedPrice.max}
                      </Text>
                    </Text>
                  )}
                </Box>
              </Box>
            </Box>
            <Box data-show-atb="true" data-atb-pid={ID}></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HotspotProductTile
