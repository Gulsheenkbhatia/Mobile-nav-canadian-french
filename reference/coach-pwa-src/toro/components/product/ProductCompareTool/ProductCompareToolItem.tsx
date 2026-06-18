import { useState } from 'react'
import { useAtomValue } from 'jotai/utils'
import { selectedSizeAtom, selectedVariantGroupAtom } from 'store/pdp.atom'
import { isOneCoachNAEnabledAtom } from 'store/menu-data.atom'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import {
  DimensionsIcon,
  Stars2Icon,
  WaysToWearItIcon,
  WhatFitsInsideIcon,
  CheckmarkIcon,
  AccountBalanceWalletIcon,
  OccasionIcon,
  AsteriskIcon,
} from 'toro/icons'
import { getProductImageSrc } from 'toro/helpers/productImages'
import { formatPrice } from 'toro/helpers/price-format'
import AddToBagButton from 'toro/components/AddToBagButton'
import ImpressionSensor from 'toro/analytics/ImpressionSensor'
import { HandleProductOnVisiblePayload } from 'toro/components/product/desktop/CompareToolsSection/types'
import Link from 'toro/components/Link'
import getAPIURL from 'helpers/getAPIURL'
import getProductURLHref from 'helpers/getProductURLHref'
import { TemplateName } from 'toro/constants/templates'
import Template from 'toro/components/Template'
import useTemplate from 'toro/hooks/useTemplate'
import { recAITypes } from 'toro/analytics/useRecommAnalytics'
import { useIntl } from 'react-intl'
import { MeasurementSpecLabels } from 'toro/constants/measurementSpecs'
import { HARDWARE_COLOR_ATTR_NAME } from 'toro/helpers/compareAttributesHelper'
import useProductData from 'toro/hooks/useProductData'

type ProductCompareToolItemProps = {
  product: any
  current: boolean
  scheme: string
  experienceId: string
  idx?: number
  onProductVisible?: (payload: HandleProductOnVisiblePayload) => void
  onProductClick?: (product: any, idx: number) => any
  displayAtb?: boolean
  vendor?: keyof typeof recAITypes
}

const getThemeVariant = (
  isPDPV7Enabled: boolean,
  isPDPV6Enabled: boolean,
  isPDPV51Enabled: boolean
) => {
  if (isPDPV7Enabled) {
    return TemplateName.pdpv7
  }
  if (isPDPV6Enabled) {
    return TemplateName.pdpv6
  }
  if (isPDPV51Enabled) {
    return TemplateName.pdpv5_1
  }
  return undefined
}

const getProductUrl = (product, vendor) => {
  if (vendor !== 'certona') {
    return product?.url
  }
  return product?.url && getProductURLHref(product.url)
}

const ProductCompareToolItem = ({
  product,
  current,
  scheme,
  experienceId,
  idx,
  onProductVisible,
  onProductClick,
  displayAtb,
  vendor = 'certona',
}: ProductCompareToolItemProps) => {
  const [isATBButtonDisabled, setIsATBButtonDisabled] = useState(false)
  const isPDPV51Enabled = useTemplate([TemplateName.pdpv5_1])
  const isPDPV6Enabled = useTemplate([TemplateName.pdpv6])
  const isPDPV7Enabled = useTemplate([TemplateName.pdpv7])
  const { formatMessage } = useIntl()
  const style = useStyleConfig('ProductCompareTool', {
    variant: getThemeVariant(isPDPV7Enabled, isPDPV6Enabled, isPDPV51Enabled),
  })
  const pdpUrl = getProductUrl(product, vendor)
  const isOneCoachNAEnabled = useAtomValue(isOneCoachNAEnabledAtom)
  const selectedSize = useAtomValue(selectedSizeAtom)
  const selectedVariantGroup = useAtomValue(selectedVariantGroupAtom)

  // Determine if size is already selected for this specific product
  const selectedVariantGroupId = selectedVariantGroup?.id
  const selectedVariantGroupMasterId = selectedVariantGroup?.masterId
  const isSizeAlreadySelected =
    current &&
    product?.SizeFlag &&
    selectedSize &&
    (selectedVariantGroupId === product?.ID || selectedVariantGroupMasterId === product?.ID)

  const productWithQuickAdd = {
    ...product,
    is_quick_add: displayAtb && !isATBButtonDisabled ? '1' : '0',
  }

  const imageSrcSwatch = getProductImageSrc(product?.colorSwatch?.src, 'mobile', 'pdp', {
    isCompareToolSwatch: true,
  })

  const imageSrcMaterial = getProductImageSrc(product?.colorSwatch?.src, 'mobile', 'pdp', {
    isCompareToolMaterial: true,
  })

  const imageSrc = getProductImageSrc(product?.image?.src, 'mobile', 'pdp')

  const formattedPrice = formatPrice(product?.price?.value)

  const hardwareColorTitle = formatMessage({
    id: 'pdp.product.compareTool.hardware',
    defaultMessage: 'Hardware',
  })

  const classification = useProductData('custom.c_classification')

  const whatFitsInsideIcon =
    classification === 'Wallets' ? (
      <AccountBalanceWalletIcon width="23px" height="23px" />
    ) : (
      <WaysToWearItIcon width="27px" height="26px" />
    )

  const renderProductImage = () => (
    <>
      <Template forIDs={[TemplateName.pdpv6]}>
        <Image
          src={imageSrc}
          alt={product?.image?.alt}
          aspectRatio={1.24}
          sx={{
            width: '100%',
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            },
          }}
          lazy={true}
          lazyOffset={200}
        />
      </Template>
      <Template notForIDs={[TemplateName.pdpv6]}>
        <Image
          src={product?.image?.src}
          alt={product?.image?.alt}
          className="product-image"
          aspectRatio={1.24}
          width="100%"
          lazy={true}
          lazyOffset={200}
        />
      </Template>
    </>
  )

  const renderProductName = () => <Text sx={style.productName}>{product?.name}</Text>

  const renderProductPrice = () => <Text sx={style.prictText}>{formattedPrice}</Text>

  const renderColorSwatch = () => (
    <Flex alignItems="center" sx={style.colorSwatchWrapper}>
      <Image
        alt={product?.colorSwatch?.alt}
        src={imageSrcSwatch}
        sx={style.productColorImage}
        fetchpriority="low"
        lazy={true}
      />
      {!!product?.availableColorsNumber && (
        <Text sx={style.colorText}>{`+${product?.availableColorsNumber} color${
          product?.availableColorsNumber > 1 ? 's' : ''
        }`}</Text>
      )}
    </Flex>
  )

  const renderAddToBagButton = () =>
    displayAtb ? (
      <Box sx={style.addToBagButtonWrapper}>
        <AddToBagButton
          variantId={product?.VariationIdV2}
          variantGroupId={product?.ID}
          isSizedProduct={product?.SizeFlag}
          styles={style.addToBagButton}
          isSizeAlreadySelected={isSizeAlreadySelected}
          analyticsData={{
            eventLocation: scheme,
            experienceId,
            recAIType: vendor,
          }}
          setIsATBButtonDisabled={setIsATBButtonDisabled}
          hideIcon={isOneCoachNAEnabled}
        />
      </Box>
    ) : null

  const productItem = (
    <>
      <Template forIDs={[TemplateName.pdpv6, TemplateName.pdpv5_1]}>
        <Box
          sx={current && style.currentProductItem ? style.currentProductItem : style.productItem}
        >
          <Box position="relative" data-qa="compareTool-current-img">
            {renderProductImage()}
            {renderProductName()}
            {renderProductPrice()}
            {renderColorSwatch()}
            {renderAddToBagButton()}
            {current && <Text sx={style.currentProductBadge}>Current</Text>}
          </Box>
        </Box>
      </Template>
      <Template notForIDs={[TemplateName.pdpv6, TemplateName.pdpv5_1]}>
        <Box sx={style.productItem}>
          <Box position="relative" data-qa="compareTool-current-img">
            {renderProductImage()}
            {renderProductName()}
            {renderColorSwatch()}
            {renderProductPrice()}
            {renderAddToBagButton()}
            {current && <Text sx={style.currentProductBadge}>Current</Text>}
          </Box>
        </Box>
      </Template>
    </>
  )

  const productItemWrapper = (
    <>
      {productItem}
      {!!product?.material?.length && (
        <Box sx={style.productMaterialWrapper} data-qa="compareTool-material-section">
          <Image
            alt={product?.colorSwatch?.alt}
            src={imageSrcMaterial}
            sx={style.productMaterialImage}
            fetchpriority="low"
            lazy={true}
          />
          <Box textAlign="center">
            <Text sx={style.productMaterialTitle}>Material</Text>
            <Box>
              {product?.material?.map((material) => (
                <Text sx={style.productMaterialItem} key={material}>
                  {material.replace(`{${HARDWARE_COLOR_ATTR_NAME}}`, `${hardwareColorTitle}: `)}
                </Text>
              ))}
            </Box>
          </Box>
        </Box>
      )}
      {!!product?.measurementSpecs?.length && (
        <Box sx={style.productMeasurementSpecsWrapper} data-qa="compareTool-measurementSpecs">
          <Text sx={style.productMeasurementSpecsTitle}>
            <DimensionsIcon width="24px" height="17px" />
            {formatMessage({
              id: 'pdp.product.compareTool.dimensions',
              defaultMessage: 'Dimensions',
            })}
          </Text>
          <Box>
            {product.measurementSpecs.map((spec, index) => (
              <Text key={`${spec.label}-${index}`} sx={style.productMeasurementSpecsItem}>
                {`${formatMessage({
                  id: `pdp.product.compareTool.measurement.${spec.label}`,
                  defaultMessage: MeasurementSpecLabels[spec.label] || spec.label,
                })}: ${spec.value}`}
              </Text>
            ))}
          </Box>
        </Box>
      )}
      {!!product?.whatFitsInside?.length && (
        <Flex sx={style.producWhatFitsInsideWrapper} data-qa="compareTool-whatFitsInside">
          {whatFitsInsideIcon}
          <Text sx={style.productWhatFitsInsideTitle}>What fits inside</Text>

          <Template forIDs={[TemplateName.pdpv6]}>
            {product.whatFitsInside.map((item) => (
              <Flex key={item} sx={style.productWhatFitsInsideItemWrapper}>
                <Box>
                  <CheckmarkIcon height="12px" width="12px" />
                </Box>
                <Text sx={style.productWhatFitsInsideItem}>{item}</Text>
              </Flex>
            ))}
          </Template>
          <Template notForIDs={[TemplateName.pdpv6]}>
            {product.whatFitsInside.map((item) => (
              <Text key={item} sx={style.productWhatFitsInsideItem}>
                {item}
              </Text>
            ))}
          </Template>
        </Flex>
      )}
      {!!product?.features?.length && (
        <Flex sx={style.featuresWrapper} data-qa="compareTool-features-section">
          {product?.SizeFlag ? (
            <AsteriskIcon width="22px" height="22px" />
          ) : (
            <Stars2Icon width="22px" height="22px" />
          )}
          <Text sx={style.featuresTitle}>Features</Text>
          <Flex sx={style.featuresItems}>
            {product?.features.map((item) => (
              <Text sx={style.featuresItem} key={item} data-qa="compareTool-features-item">
                {item}
              </Text>
            ))}
          </Flex>
        </Flex>
      )}
      {!!product?.occasion?.length && (
        <Flex sx={style.occasionWrapper} data-qa="compareTool-occasion-section">
          <OccasionIcon width="22px" height="22px" />
          <Text sx={style.occasionTitle}>Occasion</Text>
          <Flex sx={style.occasionItems}>
            {product?.occasion.map((item) => (
              <Text sx={style.occasionItem} key={item} data-qa="compareTool-occasion-item">
                {item}
              </Text>
            ))}
          </Flex>
        </Flex>
      )}

      {!!product?.waysToWearIt?.length && (
        <Flex sx={style.producWhatFitsInsideWrapper} data-qa="compareTool-ways_to_wear_section">
          <WhatFitsInsideIcon width="34px" height="33px" />
          <Text sx={style.productWhatFitsInsideTitle}>Ways to wear it</Text>

          {product.waysToWearIt.map((item) => (
            <Text
              key={item}
              sx={style.productWhatFitsInsideItem}
              data-qa="compareTool-ways_to_wear_description"
            >
              {item}
            </Text>
          ))}
        </Flex>
      )}
    </>
  )

  const handleProductOnVisible = () => {
    onProductVisible?.({ product: productWithQuickAdd, idx })
  }

  const handleProductOnClick = () => {
    onProductClick?.(productWithQuickAdd, idx)
  }

  if (current) {
    return productItemWrapper
  }

  return (
    <Link
      href={pdpUrl}
      prefetchUrl={getAPIURL(pdpUrl)}
      prefetch={true}
      sx={style.linkWrapper}
      key={product.name}
      onClick={handleProductOnClick}
    >
      <ImpressionSensor
        onVisible={handleProductOnVisible}
        payload={
          {
            product: productWithQuickAdd,
            idx,
          } as HandleProductOnVisiblePayload
        }
        threshold={0.2}
        rootMargin="0px"
      >
        {productItemWrapper}
      </ImpressionSensor>
    </Link>
  )
}

export default ProductCompareToolItem
