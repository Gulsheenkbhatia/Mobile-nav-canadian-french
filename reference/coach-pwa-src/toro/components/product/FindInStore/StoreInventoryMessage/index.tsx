import { useIntl } from 'react-intl'
import useExperiment from 'toro/hooks/useExperiment'
import usePreference from 'toro/hooks/usePreference_new'
import Text from 'toro/components/Text'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useStyleConfig from 'toro/hooks/useStyleConfig'

interface StoreInventoryMessageProps {
  storeAvailability: {
    ATS: number
  }
  variant?: 'default' | 'availabilityModal'
  altVersion?: 'default' | 'withUrgency'
}

export const StoreInventoryMessage = ({
  storeAvailability,
  variant = 'default',
  altVersion = 'default',
}: StoreInventoryMessageProps) => {
  const { formatMessage } = useIntl()

  const isScarcityMessageExperimentEnabled = useExperiment(EXPERIMENTS.STORE_INVENTORY_SCARCITY)

  const {
    pdpPreferences: { bopisInventoryScarcity, scarcityMessageIcon = 0x1f4cd },
  } = usePreference({
    PDPPreferences: ['bopisInventoryScarcity', 'scarcityMessageIcon'],
  })

  const {
    pdp: { enableBopisInventoryScarcity = false, bopisInventoryLowStockThreshold = 0 } = {},
  } = bopisInventoryScarcity || {}

  const styles = useStyleConfig('StoreInventoryMessage', {
    variant,
  })

  const { ATS: ats = 0 } = storeAvailability || {}

  const scarcityMessage =
    altVersion === 'withUrgency'
      ? formatMessage(
          {
            id: 'pdp.product.storeInventoryScarcityWithUrgency',
            defaultMessage: 'Only {count} in stock - order soon!',
          },
          { count: ats }
        )
      : formatMessage(
          {
            id: 'pdp.product.storeInventoryScarcity',
            defaultMessage: '{icon}Popular in stores - only {count} left!',
          },
          { count: ats, icon: String.fromCodePoint(scarcityMessageIcon) }
        )

  const showScarcityMessage =
    enableBopisInventoryScarcity &&
    isScarcityMessageExperimentEnabled &&
    ats > 0 &&
    ats <= bopisInventoryLowStockThreshold

  if (!showScarcityMessage) return null
  return (
    <Text as="span" data-qa="bm_txt_scarcity_msg" sx={styles}>
      {scarcityMessage}
    </Text>
  )
}
