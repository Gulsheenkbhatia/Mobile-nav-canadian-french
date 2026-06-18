import Box from 'toro/components/Box'
import get from 'lodash/get'
import ProductPromoSlot from 'toro/components/ProductPromoSlot'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useCallOutDrawer from 'toro/cms/hooks/useCallOutDrawer'
import { PromoCallout } from 'toro/components/product/CallOutMessage/types'

type CallOutMessageProps = {
  promoText: PromoCallout[]
  masterId: string
  variant?: string
}

const CallOutMessageWrapper = function (props: CallOutMessageProps) {
  if (!props.promoText || !props.promoText?.length) return null
  return <CallOutMessage {...props} />
}

const CallOutMessage = function ({ promoText, masterId, variant }: CallOutMessageProps) {
  const styles = useMultiStyleConfig('Calloutmessage', { variant })
  const aeDrawerOnClicks = useCallOutDrawer(promoText)
  return (
    <Box
      sx={styles.calloutMessageWrapper}
      data-qa="cm_body_pdt_pomocallout"
      className="callout-message-container"
    >
      {promoText?.map((promo, index) => {
        return (
          <Box
            key={`promo-${index}`}
            sx={styles.pdpCalloutmessage()}
            className="pdpCallloutMessage"
          >
            <ProductPromoSlot
              scriptContent={get(promo, '[call-out-message].content.scriptContent')}
              content={get(
                promo,
                '[call-out-message].content.mainHtml',
                get(promo, '[call-out-message].content.spanText')
              )}
              masterId={masterId}
              isPromoModal={get(promo, '[call-out-message].content.isPromoModal')}
              shouldInjectJquery={get(promo, '[call-out-message].content.shouldInjectJquery')}
              onClick={aeDrawerOnClicks[index]}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default withErrorBoundaryWrapper(CallOutMessageWrapper)
