import Breadcrumbs from 'toro/components/BreadcrumbPage'
import useProductData from 'toro/hooks/useProductData'
import { useAtomValue } from 'jotai/utils'
import { appLoadingAtom } from 'store/pdp.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import Box from 'toro/components/Box'

const BreadcrumbsMobileWrapper = () => {
  const styles = useMultiStyleConfig('BreadcrumbPage')
  const breadcrumbs = useProductData('breadcrumbs')
  const appLoading = useAtomValue(appLoadingAtom)

  return (
    <Box sx={styles.box}>
      <Breadcrumbs breadcrumbData={breadcrumbs} apploading={appLoading} />
    </Box>
  )
}

export default BreadcrumbsMobileWrapper
