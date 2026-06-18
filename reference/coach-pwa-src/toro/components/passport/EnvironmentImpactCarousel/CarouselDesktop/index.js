import SplideSlider from 'toro/components/SplideSlider'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import usePreference from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'

const MinimalisticCarouselItem = dynamic(() =>
  import('toro/components/passport/EnvironmentImpactCarousel/MinimalisticCarouselItem')
)

const CarouselItem = dynamic(() =>
  import('toro/components/passport/EnvironmentImpactCarousel/CarouselItem')
)

const CarouselDesktop = ({ impacts = [], styles }) => {
  const renderSlider = impacts.length > 5
  const {
    toggleSiteFeatures: { enableNewEnvImpactModule = false },
  } = usePreference({ ToggleSiteFeatures: ['enableNewEnvImpactModule'] })

  const renderSlides = () => {
    return impacts.map((impact, idx) =>
      enableNewEnvImpactModule ? (
        <MinimalisticCarouselItem key={`${impact.title}-${idx}`} {...impact} styles={styles} />
      ) : (
        <CarouselItem key={`${impact.title}-${idx}`} {...impact} styles={styles} />
      )
    )
  }

  return (
    <Box sx={styles.carouselDesktopRoot(renderSlider)}>
      {renderSlider ? (
        <SplideSlider
          options={{
            type: 'slide',
            perPage: 5,
            gap: '1.5rem',
            perMove: 5,
            pagination: false,
            arrows: true,
          }}
          styles={styles}
        >
          {renderSlides()}
        </SplideSlider>
      ) : (
        <Flex justifyContent="center">{renderSlides()}</Flex>
      )}
    </Box>
  )
}

export default CarouselDesktop
