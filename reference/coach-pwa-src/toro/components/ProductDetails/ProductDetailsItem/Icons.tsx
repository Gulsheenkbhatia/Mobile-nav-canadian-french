import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'

export const PaidSocialLandingIcon = ({
  isExpanded,
  getDataQA,
}: {
  isExpanded: boolean
  getDataQA: (productDetailsDataQa: string, editorsNotesDataQa: string) => string
}) => {
  const { AccordionIcon, AccordionIconExpanded, PlusIcon, MinusIcon } = useMultiStyleConfig('Icons')

  return (
    <>
      <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
        {isExpanded ? (
          <AccordionIconExpanded
            data-qa={getDataQA(
              'pdp_icon_pdtls_acord_up_arrow',
              'pdp_icon_edtrs_nts_acord_up_arrow'
            )}
          />
        ) : (
          <AccordionIcon
            data-qa={getDataQA(
              'pdp_icon_pdtls_acord_down_arrow',
              'pdp_icon_edtrs_nts_acord_down_arrow'
            )}
          />
        )}
      </Experiment>
      <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
        {isExpanded ? (
          <MinusIcon
            width="12px"
            height="12px"
            data-qa={getDataQA(
              'pdp_icon_pdtls_acord_up_arrow',
              'pdp_icon_edtrs_nts_acord_up_arrow'
            )}
          />
        ) : (
          <PlusIcon
            width="12px"
            height="12px"
            data-qa={getDataQA(
              'pdp_icon_pdtls_acord_down_arrow',
              'pdp_icon_edtrs_nts_acord_down_arrow'
            )}
          />
        )}
      </Experiment>
    </>
  )
}
