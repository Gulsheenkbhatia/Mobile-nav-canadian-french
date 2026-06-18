import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'
import get from 'lodash/get'
import CustomSlot from 'toro/cms/components/CustomSlot'
import CallOutCmsSlot from 'toro/components/product/CallOutMessage/CallOutCmsSlot'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { PromoCallout } from 'toro/components/product/CallOutMessage/types'
import { useAtomValue } from 'jotai/utils'
import { isPlpV3Atom } from 'store/plp.atom'

const CallOutMessageWrapper = function ({ promoText }: { promoText: PromoCallout[] }) {
  if (!promoText || !promoText?.length) return null
  return <CallOutMessage promoText={promoText} />
}

const CallOutMessage = function ({ promoText }: { promoText: PromoCallout[] }) {
  const { isMobile } = useViewportType()
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const styles = useMultiStyleConfig('Calloutmessage', { variant: isPlpV3 && 'plpV3' })
  const qaTag = 'cm_tile_txt_pt_lower_promobadges'

  return (
    <Box
      height={isMobile ? '100%' : ''}
      width={isMobile ? '100%' : ''}
      sx={styles.calloutMessageWrapper}
      data-qa="cm_body_pdt_pomocallout"
      className="callout-message-container"
    >
      {promoText?.map((promo, index) => {
        return (
          <Box
            key={`promo-${index}`}
            className="callout-message-container-content"
            sx={{ ...styles.plpCalloutmessage, width: 'auto' }}
          >
            <CustomSlot
              content={get(promo, 'call-out-message')}
              Component={CallOutCmsSlot}
              ignoreHidden={true}
              qaTag={qaTag}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default withErrorBoundaryWrapper(CallOutMessageWrapper)
