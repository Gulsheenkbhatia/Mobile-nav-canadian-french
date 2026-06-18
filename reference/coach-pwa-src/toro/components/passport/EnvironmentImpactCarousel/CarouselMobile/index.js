import SplideSlider from 'toro/components/SplideSlider'
import usePreference from 'toro/hooks/usePreference_new'
import dynamic from 'next/dynamic'

const MinimalisticCarouselItem = dynamic(() =>
  import('toro/components/passport/EnvironmentImpactCarousel/MinimalisticCarouselItem')
)

const CarouselItem = dynamic(() =>
  import('toro/components/passport/EnvironmentImpactCarousel/CarouselItem')
)

const CarouselMobile = ({ impacts = [], styles }) => {
  const {
    toggleSiteFeatures: { enableNewEnvImpactModule = false },
  } = usePreference({ ToggleSiteFeatures: ['enableNewEnvImpactModule'] })
  return (
    <SplideSlider
      options={{
        type: 'loop',
        gap: '1rem',
        arrows: false,
        autoWidth: true,
        focus: 'center',
      }}
      arrows={false}
      styles={styles}
    >
      {impacts.map((impact) =>
        enableNewEnvImpactModule ? (
          <MinimalisticCarouselItem key={impact.title} {...impact} styles={styles} />
        ) : (
          <CarouselItem key={impact.title} {...impact} styles={styles} />
        )
      )}
    </SplideSlider>
  )
}

export default CarouselMobile
