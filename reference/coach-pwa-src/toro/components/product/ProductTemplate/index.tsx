import { useEffect } from 'react'
import MainContainer from 'toro/components/MainContainer'
import Hidden from 'toro/components/Hidden'
import Box from 'toro/components/Box'
import AdditionalDetails from 'toro/components/product/ProductMainSection/AdditionalDetails2'
import AdditionalDetailsV3 from 'toro/components/product/ProductMainSection/AdditionalDetailsV3'
import ProductMainSectionDesktop from 'toro/components/product/ProductMainSection/ProductMainSectionDesktop'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import TangibleeAnalytics from 'toro/components/product/Tangiblee/TangibleeAnalytics'
import ProductMainSectionMobile from 'toro/components/product/ProductMainSection/ProductMainSectionMobile'
import ProductMainSectionMobileV3 from 'toro/components/product/ProductMainSection/ProductMainSectionMobileV3'
import TabbedAdaptivePDP from 'toro/components/product/TabbedAdaptivePDP'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import { isQuickViewAtom, isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import { useAtomValue } from 'jotai/utils'
import { type SystemStyleObject } from '@chakra-ui/react'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import Template from 'toro/components/Template'
import { addToBagButtonOnEventAtom } from 'store/global.atom'
import dynamic from 'next/dynamic'
import PdpMobileTemplate from 'toro/components/product/mobile/TemplateContainer'
import PdpMobileTemplateModern from 'toro/components/product/mobile/TemplateContainer/v7'
import useMediaAssetContent from 'toro/hooks/useMediaAssetContent'
import PdpDesktopTemplateV5_1 from 'toro/components/product/desktop/TemplateContainer/v5_1'
import PdpDesktopTemplateModern from 'toro/components/product/desktop/TemplateContainer/v7'
import usePrefetchPdpSimilarOptions from 'toro/hooks/usePrefetchPdpSimilarOptions'
import { resetPdpV7EntranceSequenceDedupe } from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation'

const PdpDesktopTemplateV5 = dynamic(
  () => import('toro/components/product/desktop/TemplateContainer/v5'),
  {
    ssr: true,
  }
)

type ProductTemplateProps = {
  selectedVariantOrVG: any
  styles: Record<string, SystemStyleObject>
  quickViewStyles: Record<string, SystemStyleObject>
  tabbedAdaptiveLowerProps: any
  additionalDetailsProps: any
}

const ProductTemplate = ({
  selectedVariantOrVG,
  styles,
  quickViewStyles,
  tabbedAdaptiveLowerProps,
  additionalDetailsProps,
}: ProductTemplateProps) => {
  const { isMobile } = useViewportType()
  const isQuickView = useAtomValue(isQuickViewAtom)
  const isTabbedAdaptivePDPEligible = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const addToBagButtonOnEvent = useAtomValue(addToBagButtonOnEventAtom)
  const isPDPTemplateV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile
  const isPDPv5Template = useTemplate([TemplateName.pdpv5])
  const isPDPv5_1Template = useTemplate([TemplateName.pdpv5_1])
  const isPdpv7Template = useTemplate([TemplateName.pdpv7])
  useMediaAssetContent()
  usePrefetchPdpSimilarOptions()

  useEffect(() => {
    if (isQuickView) {
      resetPdpV7EntranceSequenceDedupe()
    }
  }, [isQuickView])

  return (
    <Box className={isPDPTemplateV3Mobile ? 'pdpv3' : ''}>
      <TangibleeAnalytics />
      <MainContainer
        sx={{
          ...(isQuickView
            ? quickViewStyles.pdpMainContainerWrapper
            : styles.pdpMainContainerWrapper),
          ...(isPDPv5Template ? { overflowX: 'hidden' } : {}),
        }}
        className={isPDPv5_1Template ? 'pdpv5_1' : isPdpv7Template ? 'pdpv7' : ''}
        w="100%"
        maxWidth={isPDPv5Template ? null : undefined}
      >
        <Hidden onMobile w="100%" sx={isQuickView ? quickViewStyles.pdpMainContent : null}>
          <Template forIDs={[TemplateName.pdpv5_0]}>
            <PdpDesktopTemplateV5 />
          </Template>
          <Template forIDs={[TemplateName.pdpv5_1]}>
            <PdpDesktopTemplateV5_1 />
          </Template>
          <Template forIDs={[TemplateName.pdpv7]}>
            <PdpDesktopTemplateModern />
          </Template>
          <Template forIDs={[TemplateName.default]}>
            <ProductMainSectionDesktop selectedVariantOrVG={selectedVariantOrVG} />
          </Template>
        </Hidden>
      </MainContainer>
      {!isQuickView && (
        <Hidden onNonMobile w="100%">
          <Template forIDs={[TemplateName.pdpv6]}>
            <PdpMobileTemplate />
          </Template>
          <Template forIDs={[TemplateName.pdpv7]}>
            <PdpMobileTemplateModern />
          </Template>
          <Template forIDs={[TemplateName.default]}>
            {isTabbedAdaptivePDPEligible ? (
              <TabbedAdaptivePDP tabbedPDPLower={tabbedAdaptiveLowerProps} />
            ) : (
              <>
                <Experiment forIDs={EXPERIMENTS.PDP_V3}>
                  <ProductMainSectionMobileV3 />
                </Experiment>
                <Experiment notForIDs={EXPERIMENTS.PDP_V3}>
                  <ProductMainSectionMobile />
                </Experiment>
              </>
            )}
          </Template>
        </Hidden>
      )}
      {!isQuickView && !(isTabbedAdaptivePDPEligible && isMobile) && (
        <Template forIDs={[TemplateName.default]}>
          <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
            <AdditionalDetailsV3 {...additionalDetailsProps} />
          </Experiment>
          {/*
            Note that we render AdditionalDetailsV2 with PDP_V3_BELOW_THE_FOLD enabled,
            but the condition is: notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD}
            because: alwaysOnForDesktop is always true,
            so that bypass the notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD}
          */}
          <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
            <AdditionalDetails {...additionalDetailsProps} />
          </Experiment>
        </Template>
      )}
      {addToBagButtonOnEvent}
    </Box>
  )
}

export default ProductTemplate
