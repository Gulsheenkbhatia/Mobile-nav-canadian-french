import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Breadcrumb from 'toro/components/BreadcrumbPage'
import { useInView } from 'react-intersection-observer'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

type BreadcrumbPDPV3Props = {
  dataFromPLP: any[]
  data: any[]
  apploading: boolean
  variant: string
}

const BreadcrumbPDPV3 = ({
  dataFromPLP,
  data,
  apploading,
  variant = 'pdp',
  ...props
}: BreadcrumbPDPV3Props) => {
  const styles = useMultiStyleConfig('BreadcrumbPage', { variant })

  const [markerRef, markerInView] = useInView({
    initialInView: !(apploading && dataFromPLP?.length > 0) && !data,
  })

  return (
    <Box id="breadcrumb-container" sx={styles.breadcrumbContainer} position="relative" {...props}>
      <Flex
        sx={{ ...styles.breadcrumbText, ...styles.breadcrumbEllipsis }}
        alignItems="center"
        opacity={markerInView ? 0 : 1}
      >
        ...
      </Flex>
      <Box className="pdp-breadcrumb" overflowX="auto" display="flex">
        <Breadcrumb
          plpToPDPBreadcrumbData={dataFromPLP}
          breadcrumbData={data}
          apploading={apploading}
          variant={variant}
        />
        <Box ref={markerRef} paddingLeft="1px" marginLeft="-1px" userSelect="none" />
      </Box>
    </Box>
  )
}

export default BreadcrumbPDPV3
