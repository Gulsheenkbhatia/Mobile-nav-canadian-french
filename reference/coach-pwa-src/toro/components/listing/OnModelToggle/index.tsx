import { useAtom } from 'jotai'
import {
  isOnModelPlp2UpAtom,
  ModelToggleView,
  modelToggleViewAtom,
  onModelAtom,
} from 'store/plp.atom'
import Box from 'toro/components/Box'
import { Switch } from '@chakra-ui/react'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import { isHeaderHeightAtom } from 'store/headroom.atom'
import { useStickyBarScroll } from 'toro/hooks/useStickyBarScroll'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'

const OnModelToggle = ({
  isExposedOrFocusedFilteringEnabled,
}: {
  isExposedOrFocusedFilteringEnabled: boolean
}) => {
  const { formatMessage } = useIntl()

  const [view, setView] = useAtom(modelToggleViewAtom)
  const setIsOnModelPlp2Up = useUpdateAtom(isOnModelPlp2UpAtom)
  const headerHeight = useAtomValue(isHeaderHeightAtom)
  const isScrolledPastHeader = useStickyBarScroll(headerHeight)
  const onModel = useAtomValue(onModelAtom)

  const styles: any = useStyleConfig('OnModelToggle')
  const analytics = useAnalytics()

  const isOnModelPlp2UpToggleEnabled = onModel.isOnModel2UpToggleEnabled

  const handleView = (viewType: ModelToggleView) => {
    if (isOnModelPlp2UpToggleEnabled) {
      setIsOnModelPlp2Up(viewType === ModelToggleView.Model)
    }
    setView(viewType)

    const eventLabel = viewType === ModelToggleView.Model ? 'model view' : 'product view'

    analytics.send('listInteraction', {
      eventLocation: 'header',
      eventAction: 'toggle list click',
      eventLabel,
    })
  }

  const handleToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleView(event.target.checked ? ModelToggleView.Model : ModelToggleView.Product)
    },
    [handleView]
  )

  if (isExposedOrFocusedFilteringEnabled && isScrolledPastHeader) {
    return null
  }

  return (
    <Box
      sx={
        isExposedOrFocusedFilteringEnabled ? styles.onModelToggleWithFilters : styles.onModelToggle
      }
    >
      <Box sx={styles.viewTitle}>
        {isOnModelPlp2UpToggleEnabled
          ? formatMessage({
              id: 'plp.modelToggle.viewTitle_2up',
              defaultMessage: 'Styled View',
            })
          : formatMessage({
              id: 'plp.modelToggle.viewTitle_1up',
              defaultMessage: 'Model View',
            })}
      </Box>
      <Switch
        isChecked={view === ModelToggleView.Model}
        onChange={handleToggle}
        sx={styles.switch}
        data-qa="onModelToggle"
      />
    </Box>
  )
}

export default OnModelToggle
