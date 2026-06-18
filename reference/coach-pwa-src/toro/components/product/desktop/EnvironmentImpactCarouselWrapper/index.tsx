import { FC, useContext } from 'react'
import useProductData from 'toro/hooks/useProductData'
import EnvironmentImpactCarousel from 'toro/components/passport/EnvironmentImpactCarousel'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Box from 'toro/components/Box'
import { useAtomValue } from 'jotai/utils'
import { isSubBrandActiveAtom } from 'store/global.atom'
import PWAContext from 'components/common/PWAContext'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'

interface EnvironmentImpactCarouselWrapperProps {
  location?: string
  variant?: string
}

const EnvironmentImpactCarouselWrapper: FC<EnvironmentImpactCarouselWrapperProps> = ({
  location = 'product',
  variant,
}) => {
  const [envImpactSlides, envImpactModalHeadline] = useProductData([
    'custom.c_envImpacts',
    'custom.c_environmentImpactModalHeadline',
  ])

  const { appData } = useContext(PWAContext)
  const { locale, coachtopiaRotatingGlobeV4 } = appData || {}
  const localeData = normalizeLocalizationContent(locale)
  const currentLocale = localeData?.locale?.replace?.('-', '_')

  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  if (!envImpactSlides?.length || !isSubBrandActive) {
    return null
  }

  return (
    <Box id="impact" mb="112px">
      <EnvironmentImpactCarousel
        impacts={envImpactSlides}
        title={envImpactModalHeadline}
        locale={currentLocale}
        rotateGlobeIcon={coachtopiaRotatingGlobeV4}
        location={location}
        variant={variant}
      />
    </Box>
  )
}

export default withErrorBoundaryWrapper(EnvironmentImpactCarouselWrapper)
