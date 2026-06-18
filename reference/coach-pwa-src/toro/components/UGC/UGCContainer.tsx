import { useInView } from 'react-intersection-observer'
import { useEffect, useMemo } from 'react'
import type { UGCItem, UGCPageType, WyngPreferences } from 'toro/components/UGC/types'
import UGCSkeleton from 'toro/components/UGC/UGCSkeleton'
import useUGCPreferenceByPageType from 'toro/components/UGC/useUGCPreferenceByPageType'
import Box from 'toro/components/Box'
import UGCImageSlider from 'toro/components/UGC/UGCImageSlider'
import UGCTopContent from 'toro/components/UGC/UGCTopContent'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import ReviewCTA from 'toro/components/product/RatingsAndReviews/ReviewCTA'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import { isSubBrandActiveAtom, subBrandAtom } from 'store/global.atom'
import { useAtomValue } from 'jotai/utils'
import usePreference from 'toro/hooks/usePreference_new'

interface UGCContainerProps {
  pageType: UGCPageType
  content?: string
  gridToShow?: number
  appLoading?: boolean
  showContentDivider?: boolean
  wyngPreferences: WyngPreferences
  variant?: string
}

const UGCContainer = function ({
  pageType,
  content,
  gridToShow,
  appLoading,
  showContentDivider = true,
  wyngPreferences,
  variant,
}: UGCContainerProps) {
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('UGCStyling', { variant })
  const { SocialGallery } = styles
  const {
    isEnable,
    loading,
    gridLoading,
    showImages,
    isEnableViewGalleryCTA,
    fetchNext,
    UGCItemCount,
    hasNext,
    displayShowMore,
  } = wyngPreferences
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)
  const subBrand = useAtomValue(subBrandAtom)
  const isNonShopable = pageType === 'pdp'
  const isGridEnable = pageType === 'social-gallery'
  const { isDesktop } = useViewportType()
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (isEnable && UGCItemCount)
      analytics.send('UGCUgcInteraction', {
        eventLocation: pageType === 'social-gallery' ? 'ugc gallery' : 'content tile',
        eventAction:
          pageType === 'social-gallery' ? 'ugc view gallery' : 'ugc container impression',
        eventLabel: 'none',
      })
  }, [isEnable, UGCItemCount])

  if (!isEnable) {
    return null
  }

  if (loading || appLoading) {
    return <UGCSkeleton initialFetch isGridEnable={isGridEnable} />
  }
  if (!UGCItemCount) {
    return null
  }

  return (
    <Box
      className={showContentDivider ? 'content-divider' : null}
      sx={isGridEnable ? SocialGallery.mainContainerWrapper : {}}
      display={showImages?.length ? 'block' : 'none'}
    >
      {content && (
        <Box className="wyng-top-content" sx={styles.topContent(isDesktop)}>
          <UGCTopContent content={content} />
        </Box>
      )}
      <UGCImageSlider
        showImages={showImages}
        isNonShopable={isNonShopable}
        isGridEnable={isGridEnable}
        fetchNext={fetchNext}
        gridToShow={gridToShow}
        loading={gridLoading}
        wyngItemCount={UGCItemCount}
        variant={variant}
        hasNext={hasNext}
        displayShowMore={displayShowMore}
        pageType={pageType}
      />
      {pageType !== 'social-gallery' && isEnableViewGalleryCTA && (
        <Box sx={styles.reviewctaContainer}>
          <ReviewCTA
            sx={styles?.reviewcta(pageType)}
            prefetch={true}
            link={`${isSubBrandActive ? `/${subBrand}` : ''}/social-gallery`}
            data-qa="ugc_button_view_gallery"
            disableEffects={isSubBrandActive}
          >
            {formatMessage({
              id: 'pdp.product.wyngViewGallery',
              defaultMessage: 'VIEW GALLERY',
            })}
          </ReviewCTA>
        </Box>
      )}
    </Box>
  )
}

interface UGCLazyContainerProps {
  pageType: UGCPageType
  content?: string
  gridToShow?: number
  appLoading?: boolean
  showContentDivider?: boolean
  variant?: string
  categoryWyngFilterUUID?: string
  pageSize?: number
  images?: UGCItem[]
  imagesCount?: number
  emplifiVPC?: string
  pixleeAlbumID?: string
  next?: boolean
  wyngExternalIDType?: string
}

const UGCLazyContainer = (props: UGCLazyContainerProps) => {
  const {
    pageType,
    categoryWyngFilterUUID,
    pageSize,
    images,
    imagesCount,
    variant,
    emplifiVPC,
    pixleeAlbumID,
    next,
  } = props
  const styles = useMultiStyleConfig('UGCStyling', { variant })
  const { ugcContainer } = styles
  const { isDesktop } = useViewportType()
  const {
    wyng: { wyngExternalIDType = 'masterId' },
  } = usePreference({
    wyng: ['wyngExternalIDType'],
  })

  const { ref, inView } = useInView({
    triggerOnce: true,
  })

  const UGCPreferences = useUGCPreferenceByPageType({
    enabled: inView,
    pageType,
    externalId: props[wyngExternalIDType],
    categoryWyngFilterUUID,
    pageSize,
    images,
    imagesCount,
    emplifiVPC,
    pixleeAlbumID,
    next,
  })

  const isShowImages = UGCPreferences?.showImages?.length > 0
  const containerMinHeight = useMemo(() => {
    if (!UGCPreferences?.isEnable || !isShowImages) {
      return '0px'
    }
    if (isShowImages && pageType === 'home') {
      return '315px'
    }

    if (isShowImages && isDesktop) {
      return '478px'
    }
  }, [pageType, isShowImages])

  if (!UGCPreferences.isEnable) return null

  return (
    <Box
      ref={ref}
      minHeight={containerMinHeight}
      id="social-section"
      className="content-divider"
      sx={ugcContainer.root}
      data-qa={!isShowImages ? 'no_ugc_image_tagged_product' : null}
    >
      <UGCContainer {...props} wyngPreferences={UGCPreferences} />
    </Box>
  )
}

export default withErrorBoundaryWrapper(UGCLazyContainer)
