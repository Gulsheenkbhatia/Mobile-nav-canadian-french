import Box from 'toro/components/Box'
import { useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Hidden from 'toro/components/Hidden'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import CarouselMobile from './CarouselMobile'
import CarouselDesktop from './CarouselDesktop'
import Link from 'toro/components/Link'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference_new'
import LazySlot from 'toro/cms/components/LandingContent/LazySlot'
import useAnalytics from 'toro/analytics/useAnalytics'

const EnvironmentImpactCarousel = ({
  impacts = [],
  title,
  locale,
  rotateGlobeIcon,
  location = 'coachtopia passport',
  variant,
}) => {
  const { isDesktop } = useViewportType()
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const {
    toggleSiteFeatures: { enableNewEnvImpactModule = false },
    coachtopia: { environmentImpactViewDataSourcesPath },
  } = usePreference({
    ToggleSiteFeatures: ['enableNewEnvImpactModule'],
    coachtopia: ['environmentImpactViewDataSourcesPath'],
  })
  const styles = useMultiStyleConfig('EnvironmentImpactCarousel', {
    variant: enableNewEnvImpactModule ? 'redesignEnvCarousel' : variant,
  })

  const viewDataSourcesHref = environmentImpactViewDataSourcesPath?.find?.(
    (pref) => pref.locale === locale
  )?.link

  const onClickViewDataSource = () => {
    analytics.send('coachtopiaInteraction', {
      eventLocation: 'Environmental Impact Module',
      eventPageLocation: location,
      eventAction: 'environmental impact modal click',
      eventLabel: 'view our data sources',
    })
  }

  const environmentMinimalistickFallbackTitle = formatMessage({
    id: 'pdp.passport.productCarbonAndWateImpact',
    defaultMessage: "This Product's Impact",
  })

  const environmentTitle =
    title ||
    (enableNewEnvImpactModule
      ? environmentMinimalistickFallbackTitle
      : 'This Product’s Carbon and Waste Impact')

  if (!impacts?.length) return null

  return (
    <Box sx={styles.root}>
      <Flex direction="column" alignItems="center">
        <Box sx={styles.globeIcon}>
          <LazySlot slot={{ html: rotateGlobeIcon }} lazyLoadImages lazyLoadVideos />
        </Box>
        <Text
          sx={styles.title}
          dangerouslySetInnerHTML={{
            __html: environmentTitle,
          }}
        />
      </Flex>
      <Hidden onMobile w="100%">
        <CarouselDesktop impacts={impacts} styles={styles} />
      </Hidden>
      <Hidden onDesktop w="100%">
        <CarouselMobile impacts={impacts} styles={styles} />
      </Hidden>
      {Boolean(viewDataSourcesHref) && (
        <Box sx={styles.viewOurDataSources} className="text-body2-s">
          <Link
            href={viewDataSourcesHref}
            target="_blank"
            data-qa={isDesktop ? 'd_link_view_our_data_sources' : 'm_link_view_our_data_sources'}
            onClick={onClickViewDataSource}
          >
            {formatMessage({
              id: 'home.passport.viewOurDataSources',
              defaultMessage: 'View Our Data Sources',
            })}
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default EnvironmentImpactCarousel
