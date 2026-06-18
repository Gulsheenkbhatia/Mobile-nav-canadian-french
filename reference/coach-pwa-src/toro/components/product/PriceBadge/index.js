import PriceInfo from 'toro/components/product/PriceInfo'
import OneSitePriceInfo from 'toro/components/product/PriceInfo/OneSitePriceInfo'
import withOneSite from 'toro/hocs/withOneSite'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import HtmlContent from 'toro/components/HtmlContent'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import CallOutMessage from 'toro/components/product/CallOutMessage/CallOutMessagePDP'
import KlarnaWidget from 'toro/components/product/KlarnaWidget'
import { useContext, useMemo } from 'react'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import useViewportType from 'toro/hooks/useViewportType'
import get from 'lodash/get'
import usePreference from 'toro/hooks/usePreference'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import PWAContext from 'components/common/PWAContext'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { useAtomValue } from 'jotai/utils'
import {
  isTabbedAdaptivePDPEligibleAtom,
  isTabbedAdaptiveScrolledAtom,
  isPdpV4ATFFullPricingAtom,
} from 'store/pdp.atom'
import SlideFade from 'toro/components/SlideFade'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import useExperiment from 'toro/hooks/useExperiment'
import PaidyWidget from 'toro/components/Paidy/PaidyWidget'
import AfterpayWidget from 'toro/components/AfterPay/AfterpayWidget'
import AffirmWidget from 'toro/components/Affirm/AffirmWidget'
import getPromoByType, { PROMO_TYPES, PROMO_TEMPLATES } from 'toro/helpers/getPromoByType'
import useAffirmEligibility from 'toro/hooks/useAffirmEligibility'

const ConditionalPriceInfo = withOneSite(OneSitePriceInfo, PriceInfo)

const PARALLAX_THRESHOLD = 81

function PriceBadge({
  productData,
  allLevelsProductsData,
  isQuickView,
  selectedColor,
  apploading,
  selectedVariantData,
  selectedVariant,
  isPDPTemplateV3Mobile,
  variant,
  priceBadgeStyleVariant,
}) {
  const styles = useMultiStyleConfig('PriceBadgeTheme', {
    variant: priceBadgeStyleVariant,
  })
  const { isDesktop } = useViewportType()
  const { appData } = useContext(PWAContext)
  const enablePricingPromoUpdates = get(appData, 'enablePricingPromoUpdates', false)
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2)
  const shouldShowAffirm = useAffirmEligibility()

  const {
    paidy: { paidy_enabled: isPaidyEnabled, show_paidy_pdp: showPaidyOnPdp },
    afterPay: { enableAfterpay },
  } = usePreferenceNew({
    paidy: ['paidy_enabled', 'show_paidy_pdp'],
    afterPay: ['enableAfterpay'],
    affirm: ['AffirmOnline', 'AffirmProductMessage'],
  })

  const swComparablePriceToggle =
    get(productData, 'isComparablePriceEnabledCategory', false) &&
    get(productData, 'isSWOutlet', false)

  const siteId = useMemo(() => get(appData, 'siteId'), [appData])

  const newSelectedVariant = useMemo(
    () => get(allLevelsProductsData, 'newSelectedVariant', null),
    [allLevelsProductsData]
  )
  const newSelectedVariationGroup = useMemo(
    () => get(allLevelsProductsData, 'variationGroupData', null),
    [allLevelsProductsData]
  )

  const badgeAreaPreference = usePreference({ groupId: 'badging', preferenceId: 'badgeAreaJson' })
  const badgeAreaConfig = getSiteValueFromPref(
    badgeAreaPreference,
    siteId,
    get(badgeAreaPreference, 'value', [])
  )?.find((data) => data?.badgeArea === BadgeArea.PROMOTION_AND_SALE)

  const maxPromosDisplay = get(badgeAreaConfig, 'maxDisplay', 1)
  const isBundleProduct = productData?.isBundleProduct
  const masterId = get(productData, 'masterId')
  const isParallaxEffectActive = useAtomValue(isTabbedAdaptiveScrolledAtom)
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const isPdpV4ATFFullPricing =
    useAtomValue(isPdpV4ATFFullPricingAtom) && isTabbedAdaptivePDPEligible

  const promoText = useMemo(() => {
    const selectedVariantDataCallOut = get(
      newSelectedVariant || selectedVariantData,
      'promoPDP.promoCallOut',
      []
    )
    const productDataCallOut = get(
      newSelectedVariationGroup || productData,
      'promoPDP.promoCallOut',
      []
    )

    const promoArr = !!newSelectedVariant ? selectedVariantDataCallOut : productDataCallOut
    let resultPromos = []
    let isCTA = false
    let ipx1WithOTD = null
    const allowedPromoCallOutArray = promoArr.filter((promo) => {
      const text = get(promo, '["call-out-message"].content.text')
      const spanText = get(promo, '["call-out-message"].content.spanText')
      return !!text || !!spanText
    })

    if (isDesktop && enablePricingPromoUpdates) {
      // keep only IPX1 callout message with OTD price
      const ipx1Promo = getPromoByType(
        allowedPromoCallOutArray,
        PROMO_TYPES.IPX1,
        PROMO_TEMPLATES.V3
      )
      const ipx1Slot = !!ipx1Promo?.length
        ? ipx1Promo
        : getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.IPX1)
      const isOTDPricePromo = ipx1Slot?.filter((promo) =>
        get(promo, '[call-out-message].content.promo.hasOTDPrice', false)
      )

      ipx1WithOTD = isOTDPricePromo // IPX1 with OTD

      const ipx2Promo = getPromoByType(
        allowedPromoCallOutArray,
        PROMO_TYPES.IPX2,
        PROMO_TEMPLATES.V3
      )
      const ipx2Slot = !!ipx2Promo?.length
        ? ipx2Promo
        : getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.IPX2)

      const rbPromos = getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.RB)

      resultPromos = [
        ...(!!ipx1Slot?.length && !isOTDPricePromo?.length ? ipx1Slot : []), // IPX1 without OTD
        ...ipx2Slot,
        ...rbPromos,
      ]

      return {
        ipx1WithOTD,
        resultPromos,
        isCTA,
      }
    }

    if (isTabbedAdaptivePDPEligible) {
      if (enablePricingPromoUpdates) {
        const ipx1Promo = getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.IPX1)
        const ipx2Promo = getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.IPX2)
        const uplPromo = getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.UPL)
        const rbPromo = getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.RB)
        if (isPdpV41Enabled) {
          if (isParallaxEffectActive) {
            resultPromos = [ipx1Promo, ipx2Promo].flat()
          } else {
            resultPromos = uplPromo
          }
        } else if (isPdpV42Enabled) {
          if (isParallaxEffectActive) {
            resultPromos = [ipx1Promo].flat()
          } else {
            resultPromos = []
          }
        } else {
          resultPromos = ipx1Promo
        }
        isCTA =
          isPdpV41Enabled &&
          !isParallaxEffectActive &&
          uplPromo.length > 0 &&
          (ipx2Promo.length > 0 || rbPromo.length > 0)
      } else {
        resultPromos = allowedPromoCallOutArray.filter(
          (promo) => !!get(promo, '["call-out-message"].content.isOTD', false)
        )
      }
    } else {
      if (enablePricingPromoUpdates) {
        // keep only IPX1 callout message with OTD price
        const ipxOnePromo = getPromoByType(allowedPromoCallOutArray, PROMO_TYPES.IPX1)
        const isOTDPricePromo = ipxOnePromo?.filter((promo) =>
          get(promo, '[call-out-message].content.promo.hasOTDPrice', false)
        )
        resultPromos = isOTDPricePromo
      } else {
        // first callout message is displayed below the image carousel for PDPV3
        // so we just need to ignore it.
        resultPromos = allowedPromoCallOutArray.slice(
          isPDPTemplateV3Mobile ? 1 : 0,
          maxPromosDisplay
        )
      }
    }

    return {
      resultPromos,
      isCTA,
    }
  }, [
    selectedVariantData,
    newSelectedVariationGroup,
    isTabbedAdaptivePDPEligible,
    enablePricingPromoUpdates,
    isParallaxEffectActive,
    isPdpV41Enabled,
    isPdpV42Enabled,
  ])

  const isTabbedPDPUponLand =
    isTabbedAdaptivePDPEligible && !isParallaxEffectActive && promoText?.resultPromos.length

  const isTabbedPDPParallax =
    isTabbedAdaptivePDPEligible &&
    isPdpV41Enabled &&
    isPdpV42Enabled &&
    isParallaxEffectActive &&
    promoText?.resultPromos.length

  const onPromoClick = () => {
    window.scroll({ top: PARALLAX_THRESHOLD, behavior: 'auto' })
  }

  const isAdaptiveTabbedPDPPricingPromoWrapperClassName =
    enablePricingPromoUpdates &&
    isTabbedAdaptivePDPEligible &&
    promoText?.resultPromos.length &&
    !isPdpV41Enabled &&
    isPdpV42Enabled

  const renderIPX1WithODT = () => {
    return (
      <Box sx={styles.calloutMessageWrapper}>
        <CallOutMessage
          promoText={promoText?.ipx1WithOTD}
          masterId={masterId}
          variant="pdpV3PricingPromo"
        />
      </Box>
    )
  }

  const renderCallOutMessage = () => {
    if (isTabbedPDPUponLand) {
      if (enablePricingPromoUpdates) {
        if (isPdpV41Enabled || isPdpV42Enabled) {
          return (
            <ConditionalWrapper condition={promoText?.isCTA} Wrapper={Box} onClick={onPromoClick}>
              <CallOutMessage
                promoText={promoText?.resultPromos}
                masterId={masterId}
                variant="pdpV41UponLand"
              />
            </ConditionalWrapper>
          )
        }
        return (
          <Box
            sx={styles.calloutMessageWrapper}
            className={isAdaptiveTabbedPDPPricingPromoWrapperClassName && 'ipx1-promo-wrapper'}
          >
            <CallOutMessage
              promoText={promoText?.resultPromos}
              masterId={masterId}
              variant={'adaptiveTabbedPDP'}
            />
          </Box>
        )
      } else {
        if (!isPdpV4ATFFullPricing) {
          return (
            <Box sx={styles.pdpOTDPriceCallout}>
              {get(promoText?.resultPromos, '[0].[call-out-message].content.OTDPrice')}
            </Box>
          )
        }
      }
    }
    if (enablePricingPromoUpdates && isTabbedPDPParallax) {
      return (
        <CallOutMessage
          promoText={promoText?.resultPromos}
          masterId={masterId}
          variant="pdpV41Parallax"
        />
      )
    }
    return (
      <ConditionalWrapper
        condition={isTabbedAdaptivePDPEligible}
        Wrapper={!isPdpV4ATFFullPricing ? SlideFade : Box}
        in={isParallaxEffectActive || isPdpV4ATFFullPricing}
        direction="bottom"
        unmountOnExit
      >
        <Box
          sx={styles.calloutMessageWrapper}
          className={
            isAdaptiveTabbedPDPPricingPromoWrapperClassName && 'ipx1-promo-wrapper-parallax'
          }
        >
          <CallOutMessage
            promoText={promoText?.resultPromos}
            masterId={masterId}
            variant={
              isTabbedAdaptivePDPEligible
                ? 'adaptiveTabbedPDP'
                : enablePricingPromoUpdates && 'pdpV3PricingPromo'
            }
          />
        </Box>
      </ConditionalWrapper>
    )
  }

  const priceBadgeContainerStyles = useMemo(
    () => styles.priceBadgeContainer(isBundleProduct),
    [isBundleProduct]
  )

  return (
    <Flex
      sx={{ ...styles.PriceBadgeWrapper, ...priceBadgeContainerStyles }}
      className="pdp-price-badge-container"
    >
      {(isPdpV41Enabled || isPdpV42Enabled || !isTabbedPDPUponLand || isPdpV4ATFFullPricing) && (
        <ConditionalPriceInfo
          productData={selectedVariantData || newSelectedVariationGroup || productData}
          isServerSide={productData?.isServerSide}
          selectedColor={selectedColor}
          isQuickView={isQuickView}
          h={isDesktop && '38px'}
          variationGroups={productData.variationGroup}
          variants={productData.variant}
          variant={variant}
          defaultVgId={productData?.master?.defaultVariantGroupID}
          defaultVariantID={productData?.master?.defaultVariantID}
          selectedVariant={selectedVariant}
          swComparablePriceToggle={
            apploading ? swComparablePriceToggle : productData?.swComparablePriceToggle
          }
          isAdaptiveTabbedPDP={priceBadgeStyleVariant === 'adaptiveTabbedPDP'}
          {...allLevelsProductsData}
        />
      )}
      {!!promoText?.ipx1WithOTD?.length && renderIPX1WithODT()}
      {isPaidyEnabled && showPaidyOnPdp && (
        <Experiment notForIDs={EXPERIMENTS.TABBED_ADAPTIVE_PDP} alwaysOnForDesktop>
          <PaidyWidget hasPromoOnPDP={promoText?.resultPromos?.length > 0} />
        </Experiment>
      )}
      {!isBundleProduct &&
        promoText?.resultPromos?.length > 0 &&
        isPDPTemplateV3Mobile &&
        priceBadgeStyleVariant !== 'tabbedPDP' &&
        renderCallOutMessage()}
      {!isBundleProduct && (
        <Experiment notForIDs={EXPERIMENTS.PDP_V3_3} alwaysOnForDesktop>
          <KlarnaWidget skeletonProps={{ h: '18px', w: '300px' }} />
          {enableAfterpay && <AfterpayWidget />}
          {shouldShowAffirm && <AffirmWidget />}
        </Experiment>
      )}

      {!isBundleProduct &&
        promoText?.resultPromos?.length > 0 &&
        !isPDPTemplateV3Mobile &&
        priceBadgeStyleVariant !== 'tabbedPDP' &&
        renderCallOutMessage()}
      {isBundleProduct && !!productData?.promoText?.trim() && !isPDPTemplateV3Mobile && (
        <Box>
          <hr />
          <HtmlContent content={productData?.promoText} sx={styles.PromoText} />
        </Box>
      )}
    </Flex>
  )
}

PriceBadge.propTypes = {
  productData: PropTypes.object,
  allLevelsProductsData: PropTypes.object,
  isQuickView: PropTypes.bool,
  variant: PropTypes.string,
  selectedColor: PropTypes.object,
  apploading: PropTypes.bool,
  selectedVariantData: PropTypes.object,
}

PriceBadge.defaultProps = {
  productData: {},
  allLevelsProductsData: {},
  isQuickView: false,
  variant: '',
  apploading: false,
}

export default withErrorBoundaryWrapper(PriceBadge)
