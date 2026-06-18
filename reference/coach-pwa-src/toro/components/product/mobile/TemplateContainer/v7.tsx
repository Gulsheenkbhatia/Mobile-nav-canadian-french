import { useAtomValue } from 'jotai/utils'
import TemplateThemeProvider from 'toro/components/TemplateThemeProvider'
import theme from 'pdpv7-theme'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { isQuickViewAtom } from 'store/pdp.atom'
import {
  PdpV7EntranceCoordinator,
  PdpV7EntranceOverlay,
} from 'toro/components/product/mobile/v7/PdpV7EntranceAnimation'
import MainStageV7 from 'toro/components/product/mobile/v7/MainStageV7'
import PDPAnchorNavV7 from 'toro/components/product/mobile/v7/PDPAnchorNavV7'
import PdpV7LowerStack from 'toro/components/product/mobile/v7/PdpV7LowerStack'

const TemplateContainerV7Themed = () => {
  const styles = useMultiStyleConfig('TemplateContainerV7')
  const isQuickView = useAtomValue(isQuickViewAtom)

  return (
    <Box sx={styles.container}>
      {!isQuickView && (
        <>
          <PdpV7EntranceCoordinator />
          <PdpV7EntranceOverlay />
        </>
      )}
      <MainStageV7 />
      <PDPAnchorNavV7 />
      <Box sx={styles.lowerStack}>
        <PdpV7LowerStack />
      </Box>
    </Box>
  )
}

const TemplateContainerModern = () => (
  <TemplateThemeProvider id="pdpv7" theme={theme}>
    <TemplateContainerV7Themed />
  </TemplateThemeProvider>
)

export default TemplateContainerModern
