import React, { FC } from 'react'
import { useAtomValue } from 'jotai/utils'
import { useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import {
  isPdpV4ATFFullPricingAtom,
  isTabbedAdaptivePDPEligibleAtom,
  isTabbedAdaptiveScrolledAtom,
  productPriceAtom,
  currentProductVerticalAtom,
} from 'store/pdp.atom'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

import useTheme from 'toro/hooks/useTheme'
import useViewportType from 'toro/hooks/useViewportType'
import ComparablePrice from 'toro/components/product/ComparablePrice'
import { isPlpV3Atom } from 'store/plp.atom'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import Experiment from 'toro/components/Experiment'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import SlideFade from 'toro/components/SlideFade'
import Box from 'toro/components/Box'
import { ProductVertical } from 'toro/constants/OneSite'
import { useSyncTangibleePriceGroup } from './useSyncTangibleePriceGroup'

interface OneSitePriceInfoProps {
  isAdaptiveTabbedPDP?: boolean
}

const OneSitePriceInfo: FC<OneSitePriceInfoProps> = ({ isAdaptiveTabbedPDP }) => {
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const { isMobile } = useViewportType()
  const productVertical = useAtomValue(currentProductVerticalAtom)
  const {
    regularPrice,
    salePrice,
    discountPercentageValue,
    isCustomizedProduct,
    hideComparableValueOneSite,
    hideDiscountPercentageOneSite,
  } = useAtomValue(productPriceAtom)

  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const isPdpV4ATFFullPricing = useAtomValue(isPdpV4ATFFullPricingAtom)
  const isTabbedAdaptive = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const isTabbedAdaptiveScrolled = useAtomValue(isTabbedAdaptiveScrolledAtom)

  useSyncTangibleePriceGroup()

  const isPDPV4_1Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const priceInfoStyleVariantV4X =
    isAdaptiveTabbedPDP && (isPDPV4_1Enabled ? 'adaptiveTabbedPDP_1' : 'adaptiveTabbedPDP')
  const priceInfoStyleVariantV3 = isPlpV3 && 'plpV3Pricing'
  const styleVariant = priceInfoStyleVariantV4X || priceInfoStyleVariantV3
  const parallaxEffectWrapper = !isPdpV4ATFFullPricing ? SlideFade : Box

  const styles = useMultiStyleConfig('PriceInfoTheme', { variant: styleVariant }) || {}

  const displayPrice = salePrice || regularPrice
  const isOnSale = salePrice && salePrice !== 'N/A' && regularPrice && salePrice !== regularPrice

  const showDiscountRate = !hideDiscountPercentageOneSite && discountPercentageValue > 0
  const showComparablePrice =
    !isCustomizedProduct &&
    productVertical === ProductVertical.Outlet &&
    !hideComparableValueOneSite &&
    isOnSale

  return (
    <>
      {!isMobile && showComparablePrice && (
        <ComparablePrice variant={styleVariant} listPrice={regularPrice} />
      )}
      <Flex sx={styles.PriceInfoWrapper()}>
        <Flex
          sx={{
            ...styles.PriceInfoBox({
              salePrice,
              isMobile,
            }),
            alignItems: 'center',
            minHeight: isMobile ? '32px' : '38px',
          }}
        >
          <Text
            data-qa="cm_txt_pdt_price"
            sx={{
              ...styles.SalePriceBlackText({ isMobile }),
              fontSize: !isMobile && '28px',
              whiteSpace: isMobile && 'nowrap',
            }}
            variant="secondary"
            className="active-price"
          >
            {displayPrice}
          </Text>
        </Flex>
        {isOnSale && productVertical === ProductVertical.Collection && regularPrice && (
          <Flex sx={styles.ListPriceWrapper({ listPrice: regularPrice })} alignItems="center">
            <Text
              sx={{
                ...styles.ListPriceText({ isMobile }),
                color: theme.colors.neutral.medium,
              }}
              variant="body-text-secondary"
              data-qa={'cm_txt_pdt_price_strthr'}
            >
              {regularPrice}
            </Text>
          </Flex>
        )}
        {showDiscountRate && (
          <Flex
            alignItems="center"
            sx={styles.DisPercentage({ isMobile })}
            className="pdp-price-discount-range-wrapper"
          >
            <Text
              mt="0"
              variant="body-text-secondary"
              className="price-text discount-text"
              size={isMobile ? 'sm' : 'md'}
              data-qa="cm_txt_pdt_price_dpercent"
              sx={{
                ...styles.DisPercentageText({
                  isMobile,
                }),
                color: theme.colors.success.primary,
              }}
            >
              {formatMessage(
                {
                  id: 'pdp.price.discount',
                  defaultMessage: `({discountPercentageValue}% off)`,
                },
                { discountPercentageValue }
              )}
            </Text>
          </Flex>
        )}
        {showComparablePrice && isTabbedAdaptive && (
          <Experiment forIDs={EXPERIMENTS.PDP_V4_2} forMobile>
            <ComparablePrice variant={styleVariant} listPrice={regularPrice} />
          </Experiment>
        )}
      </Flex>
      {showComparablePrice && (
        <Experiment forMobile forIDs={EXPERIMENTS.PDP_V3}>
          <ConditionalWrapper
            condition={isTabbedAdaptive}
            Wrapper={parallaxEffectWrapper}
            in={isTabbedAdaptiveScrolled || isPdpV4ATFFullPricing}
            direction="bottom"
            unmountOnExit
          >
            <ComparablePrice listPrice={regularPrice} variant={styleVariant} />
          </ConditionalWrapper>
        </Experiment>
      )}
    </>
  )
}

export default withErrorBoundaryWrapper(OneSitePriceInfo)
