import get from 'lodash/get'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import {
  TANGIBLEE_MODE,
  TANGIBLEE_EXPERIENCE,
  TANGIBLEE_TEXTS,
  openModal,
} from 'toro/helpers/tangibleeHelper'
import { getFormattedPrices } from 'toro/helpers/skuHelper'
import { useAtomValue } from 'jotai/utils'
import { priceGroupAtom, productPriceGroupAtom } from 'store/pdp.atom'
import usePreference from 'toro/hooks/usePreference_new'
import { useContext, useMemo, useState, useEffect } from 'react'
import PWAContext from 'components/common/PWAContext'
import { useIntl } from 'react-intl'
import { PlusIcon, TangibleeCtaBagSizeIcon, TangibleeCtaHowItFitsIcon } from 'toro/icons'
import { Flex, Text } from '@chakra-ui/react'
import useAnalytics from 'toro/analytics/useAnalytics'
import isCA from 'toro/helpers/isCA'
import isObject from 'lodash/isObject'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import Template from 'toro/components/Template'

const ProductMediaTangibleeControls = ({
  skuId,
  tangibleeData,
  variantData,
  isVisible,
  imageUrl,
  variant,
  hideComparablePriceValue = false,
  productData,
}) => {
  const isPdpV41Enabled = useExperiment(EXPERIMENTS.PDP_V4_1)
  const isBentoCarouselEnabled = useExperiment(EXPERIMENTS.BENTO_BOX_PDP_CAROUSEL)
  const isPdpV5Enabled = useTemplate([TemplateName.pdpv5])
  const isPdpV6Enabled = useTemplate([TemplateName.pdpv6])
  const styles = useMultiStyleConfig('ProductMediaTangibleeControls', {
    variant: variant,
  })

  const [isCollapsed, setIsCollapsed] = useState(false)

  const priceGroup = useAtomValue(priceGroupAtom)
  const productPriceGroup = useAtomValue(productPriceGroupAtom)

  const { formatMessage } = useIntl()
  const { appData, injectScriptOnce } = useContext(PWAContext)
  const analytics = useAnalytics()
  const {
    tangiblee: {
      BRAND_URL,
      TANGIBLEE_INTEGRATION_SCRIPT: scriptSrc,
      strategicTangibleePlacement: tangibleeVariations,
      enableCompareModeOnCTAOne,
      enableViewIn2DContext,
    },
  } = usePreference({
    Tangiblee: [
      'TANGIBLEE_INTEGRATION_SCRIPT',
      'BRAND_URL',
      'strategicTangibleePlacement',
      'enableCompareModeOnCTAOne',
      'enableViewIn2DContext',
    ],
  })

  const defaultVariantId = get(productData, 'defaultVariant.id')
  const locale = get(appData, 'locale')
  const { locale: currentLocale, currencySymbol: currency } = getCurrentLocale(
    locale.replace(/_/g, '-')
  )
  const isCanada = isCA()
  const domain = isObject(BRAND_URL)
    ? BRAND_URL[currentLocale]
    : isCanada
    ? `${BRAND_URL}/${locale}`
    : BRAND_URL

  const {
    mode,
    label,
    experience,
    icon,
    enableCTATabs = false,
  } = useMemo(() => {
    if (!imageUrl) {
      return {}
    }

    if (tangibleeVariations?.tangibleeCTAOne?.split(',').find((key) => imageUrl?.endsWith(key))) {
      return {
        mode: TANGIBLEE_MODE.WILLITFIT,
        experience: TANGIBLEE_EXPERIENCE.WILLITFIT,
        label: formatMessage({
          id: enableCompareModeOnCTAOne
            ? 'pdp.tangiblee.seeHowItFitsMe'
            : 'pdp.tangiblee.whatFitsInside',
          defaultMessage: TANGIBLEE_TEXTS.WILLITFIT,
        }),
        icon: enableCompareModeOnCTAOne ? (
          <TangibleeCtaHowItFitsIcon className="icon-human" style={styles.plusIcon} />
        ) : (
          <TangibleeCtaBagSizeIcon className="icon-bag" style={styles.plusIcon} />
        ),
      }
    }

    if (tangibleeVariations?.tangibleeCTATwo?.split(',').find((key) => imageUrl?.endsWith(key))) {
      return {
        mode: TANGIBLEE_MODE.HUMAN,
        experience: TANGIBLEE_EXPERIENCE.COMPARE,
        label: formatMessage({
          id: enableCompareModeOnCTAOne
            ? 'pdp.tangiblee.whatFitsInside'
            : 'pdp.tangiblee.seeHowItFitsMe',
          defaultMessage: TANGIBLEE_TEXTS.HUMAN,
        }),
        icon: enableCompareModeOnCTAOne ? (
          <TangibleeCtaBagSizeIcon className="icon-bag" style={styles.plusIcon} />
        ) : (
          <TangibleeCtaHowItFitsIcon className="icon-human" style={styles.plusIcon} />
        ),
        enableCTATabs: enableViewIn2DContext,
      }
    }

    return {}
  }, [imageUrl])

  const shouldRender = isVisible && mode

  useEffect(() => {
    if (isPdpV6Enabled && shouldRender) {
      const timer = setTimeout(() => {
        setIsCollapsed(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIsCollapsed(false)
    }
  }, [isPdpV6Enabled, shouldRender])

  const onClick = async () => {
    if (!scriptSrc) {
      return
    }

    await injectScriptOnce(scriptSrc)

    const fallbackPriceGroup =
      productPriceGroup && (productPriceGroup.salePrice || productPriceGroup.listPrice)
        ? productPriceGroup
        : priceGroup
    const priceGroupToUse =
      isPdpV5Enabled || isPdpV6Enabled ? productPriceGroup : fallbackPriceGroup

    const { price, discountedPrice } = getFormattedPrices(priceGroupToUse)

    analytics.send('productInteraction', {
      eventLocation: 'product',
      eventPageLocation: 'product',
      eventAction: 'see what fits inside click',
      eventLabel: variantData?.id || defaultVariantId,
    })

    openModal(tangibleeData, domain, {
      sku: skuId,
      price,
      currency,
      discountedPrice: !hideComparablePriceValue && discountedPrice,
      inStock: variantData?.orderable,
      mode,
      experience,
      enableCTATabs,
    })
  }

  return (
    shouldRender && (
      <Box sx={styles.tangibleeButtonWrapper}>
        <Button
          data-cta-type="tangiblee"
          data-placement="image carousel"
          data-action={`tangiblee-${imageUrl}`}
          sx={{
            ...styles.tangibleeButton,
            ...(isPdpV41Enabled && styles.tangibleeButtonCustomPaginationPosition),
            ...(isBentoCarouselEnabled && styles.bentoCarouselTangibleeButton),
          }}
          onClick={onClick}
        >
          <Flex
            className={`${isCollapsed ? 'collapsed' : 'expanded'} ${
              mode === TANGIBLEE_MODE.HUMAN ? 'has-human-icon' : ''
            }`}
            sx={styles.tangibleeButtonContainer}
          >
            <Template forIDs={[TemplateName.pdpv6]}>{icon}</Template>
            <Text
              data-qa="pdp_alt_img_tangiblee_cta"
              data-cta-title={label.toLowerCase().replaceAll(' ', '_')}
              className={isCollapsed ? 'text-hidden' : ''}
              sx={styles.tangibleeLabel}
            >
              {label}
            </Text>
            <Template notForIDs={[TemplateName.pdpv6]}>
              <PlusIcon style={styles.plusIcon} />
            </Template>
          </Flex>
        </Button>
      </Box>
    )
  )
}

export default ProductMediaTangibleeControls
