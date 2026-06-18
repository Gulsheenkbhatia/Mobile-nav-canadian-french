import LandingContent from 'toro/cms/components/LandingContent'
import RVRecommendationsCarouselContainer from 'toro/components/RecentlyViewedCarousel/RVRecommendationsCarouselContainer'

export default function HomeBody({
  slots,
  slotsBottom,
  videoSrcData,
  styles = [],
  onClickCmsAnalytics,
  hasVideoContent = false,
}) {
  return (
    <>
      {styles.map((styleItem, idx) => (
        <style
          key={`style-${idx}`}
          dangerouslySetInnerHTML={{
            __html: styleItem,
          }}
        />
      ))}
      <RVRecommendationsCarouselContainer currentPage="HP" />
      <LandingContent
        slots={slots}
        slotsBottom={slotsBottom}
        videoSrcs={videoSrcData}
        isHome
        onClickCmsAnalytics={onClickCmsAnalytics}
        hasVideoContent={hasVideoContent}
      />
    </>
  )
}
