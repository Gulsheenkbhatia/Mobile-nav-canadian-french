import { Fragment, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import ReviewTitle from 'toro/components/product/RatingsAndReviews/ReviewTitle'
import Box from 'toro/components/Box'
import RatingStars from 'toro/components/product/RatingsAndReviews/RatingStars'
import StarAndReviewCount from 'toro/components/product/RatingsAndReviews/StarAndReviewCount'
import DisplayRange from 'toro/components/product/RatingsAndReviews/DisplayRange'
import RatingWithPercent from 'toro/components/product/RatingsAndReviews/RatingWithPercent'
import ReviewCTAComponent from 'toro/components/product/RatingsAndReviews/ReviewCTA'
import ReviewListItem from 'toro/components/product/RatingsAndReviews/ReviewListItem'
import useViewportType from 'toro/hooks/useViewportType'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useExperiment from 'toro/hooks/useExperiment'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import { useIntl } from 'react-intl'
import usePreference from 'toro/hooks/usePreference_new'
import RatingsFilterForm from 'toro/components/product/RatingsAndReviews/RatingsFilterForm'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import ReviewSkeletonComponent from 'toro/components/product/RatingsAndReviews/ReviewSkeleton'
import debounce from 'lodash/debounce'
import useAnalytics from 'toro/analytics/useAnalytics'
import { pdpRatingsFilterAtom, isReviewModalOpenedAtom } from 'store/pdp.atom'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/utils'
import type { SystemStyleObject } from '@chakra-ui/react'
import type {
  TReview,
  ReviewListProps,
  ReviewSkeletonProps,
  ReviewCTAProps,
  ReviewRollup,
  ReviewsPaging,
  TFetchReviews,
  RatingsFilter,
} from './types'
import Link from 'toro/components/Link'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import Template from 'toro/components/Template'
import ReviewSummary from 'toro/components/product/RatingsAndReviews/ReviewsList/ReviewSummary'
import EmplifiPhotoGallery from 'toro/components/product/EmplifiPhotoGallery'

const ReviewCTA = ReviewCTAComponent as React.FC<ReviewCTAProps>
const ReviewSkeleton = ReviewSkeletonComponent as React.FC<ReviewSkeletonProps>

function ReviewList({
  isModalContent,
  isSiteParamsAvailable,
  sizingRange,
  widthRange,
  productId,
  modelID,
  productData,
  reviewsData,
  isTabbedReview,
  ratingsAndReviewsData,
  variant,
  hideWriteReviewCta,
}: ReviewListProps) {
  const upc = get(productData, 'UPC')
  const isReviewModalOpened = useAtomValue(isReviewModalOpenedAtom)
  const [atomRatingsFilter, setAtomRatingsFilterAtom] = useAtom(pdpRatingsFilterAtom)

  const [nextPage, setNextPage] = useState(false)
  const isInitialRef = useRef(true)

  const styles = useMultiStyleConfig('RatingsAndReviews', { variant }) as any
  const { PlusIcon, EditIcon } = useMultiStyleConfig('Icons') as any
  const { formatMessage } = useIntl()
  const analytics = useAnalytics()
  const viewPorts = useViewportType()

  const isMobile: boolean = get(viewPorts, 'isMobile', false)
  const isDesktop: boolean = get(viewPorts, 'isDesktop', false)

  const isReviewSectionUnderProductImage = useExperiment(EXPERIMENTS.REVIEW_UNDER_PRODUCT_IMAGE)
  const isPDPV3Mobile = useExperiment(EXPERIMENTS.PDP_V3_BELOW_THE_FOLD) && isMobile
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])
  const isPDPv5Variant = isPDPV5Enabled && !isModalContent
  const isPDPv6Enabled = useTemplate([TemplateName.pdpv6])
  const isPDPV5_1Enabled = useTemplate([TemplateName.pdpv5_1])

  const {
    powerReviews: {
      pageSizePDP = isReviewSectionUnderProductImage ? 2 : 7,
      sortOrderList = [],
      filtersList,
      filtersListDisplayValue,
      pageSizeAllReviewsModal,
      pageSizeAllReviewsModalMobile = 10,
      defaultSortOrder = 'HighestRating',
      modalDefaultSortOrder = 'Newest',
      isReviewSearchEnabled,
      displaySortAndFilterByOptions = false,
      enableWordCloudClickableTags = false,
      enableEmplifiDisclaimerVerification,
      enableRatingBreakdown = { mobile: true, desktop: true, tablet: true },
      enableSortAndFilterInReviews = { mobile: true, desktop: true, tablet: true },
    },
  } = usePreference({
    powerReviews: [
      'pageSizePDP',
      'sortOrderList',
      'filtersList',
      'pageSizeAllReviewsModal',
      'pageSizeAllReviewsModalMobile',
      'defaultSortOrder',
      'modalDefaultSortOrder',
      'isReviewSearchEnabled',
      'displaySortAndFilterByOptions',
      'enableWordCloudClickableTags',
      'enableEmplifiDisclaimerVerification',
      'enableRatingBreakdown',
      'enableSortAndFilterInReviews',
    ],
  })

  const {
    toggleSiteFeatures: { enableAiSummaryReview = false },
  } = usePreference({
    ToggleSiteFeatures: ['enableAiSummaryReview'],
  })

  const {
    average_rating,
    customFitSize,
    customFitWidth,
    ratingsFilter,
    review_count,
    properties,
    ratings,
    isLoading,
    reviews,
    reviewPaging,
    topics,
    wcProperties,
    modalReviews,
    prevReviewsFilter,
    ratingsFilterModal,
    ai_review_summary,
    setRatingsFilterModal,
    setPrevReviewsFilter,
    setModalReviews,
    setReviewModalOpened,
    setAtomReviews,
    setLoading,
    setRatingsFilter,
    fetchReviewsByModelId,
    setReviews,
    setRollupData,
    setReviewPaging,
  } = ratingsAndReviewsData
  const keepExistingFiltersForModal =
    displaySortAndFilterByOptions || (enableWordCloudClickableTags && Boolean(wcProperties.length))

  const pageSize = isDesktop ? pageSizeAllReviewsModal : pageSizeAllReviewsModalMobile

  const updateReviews = async ({
    fetchParam,
    isModal = false,
    isNextPage = false,
    signal = null,
    setInitialReviewData = false,
  }: TFetchReviews) => {
    try {
      if (isSiteParamsAvailable) {
        const {
          reviews: newFetchedReviews = [] as TReview[],
          rollup = {} as ReviewRollup,
          paging = {} as ReviewsPaging,
        } = await fetchReviewsByModelId(fetchParam, signal)
        if (isModal) {
          const reviewList = isNextPage ? modalReviews : []
          setModalReviews([...reviewList, ...newFetchedReviews])
        } else {
          setReviews(newFetchedReviews)
          if (keepExistingFiltersForModal) setModalReviews(newFetchedReviews)
          setRollupData(rollup)
        }
        setPrevReviewsFilter(isModal ? ratingsFilterModal : ratingsFilter)

        if (setInitialReviewData) {
          setAtomReviews(newFetchedReviews)
        }
        setReviewPaging(paging)
      }
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (reviews?.length) {
      setAtomReviews(reviews)
    }
  }, [])

  const onReviewInteraction = useCallback(
    debounce(
      () => {
        analytics.send('reviewInteraction', {
          eventLocation: 'product',
          eventAction: 'view all reviews',
          eventLabel: productData?.id || undefined,
        })
        setReviewModalOpened(true)
        setAtomRatingsFilterAtom(ratingsFilter)
      },
      isDesktop ? 100 : 750
    ),
    [isDesktop, productData?.id, ratingsFilter]
  )

  useEffect(() => {
    if (!isTabbedReview) {
      const defaultRatingFilter = { ...ratingsFilter, sortBy: defaultSortOrder }
      setRatingsFilter(defaultRatingFilter)
      setPrevReviewsFilter(defaultRatingFilter)
      const modalSortOrder = keepExistingFiltersForModal
        ? atomRatingsFilter
        : { ...ratingsFilterModal, sortBy: modalDefaultSortOrder }

      setRatingsFilterModal({ ...modalSortOrder })
    }
  }, [defaultSortOrder, modalDefaultSortOrder, keepExistingFiltersForModal])

  useEffect(() => {
    const filterOptions = {
      ...ratingsFilter,
      pagesize: pageSize,
      sortBy: defaultSortOrder,
    }
    if (isEqual(reviewsData?.filters, filterOptions) || isModalContent) {
      return
    }
    updateReviews({
      fetchParam: filterOptions,
      setInitialReviewData: true,
    })
    return () => {
      if (!isModalContent) {
        setAtomReviews([])
      }
    }
  }, [defaultSortOrder, modelID, upc])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    const filterOptions = isModalContent ? ratingsFilterModal : ratingsFilter

    if (isEqual(prevReviewsFilter, filterOptions)) {
      return
    }
    isInitialRef.current = false
    setLoading(true)
    try {
      if (isSiteParamsAvailable) {
        updateReviews({
          fetchParam: {
            ...filterOptions,
            pagesize: pageSize,
          },
          isModal: isModalContent,
          signal,
        })
      }
    } catch (error) {
      setLoading(false)
    }

    return () => {
      setLoading(false)
      controller.abort()
    }
  }, [ratingsFilterModal, ratingsFilter])

  useEffect(() => {
    if (isSiteParamsAvailable && isReviewModalOpened && nextPage) {
      updateReviews({
        fetchParam: {
          ...ratingsFilterModal,
          from: String(reviewPaging?.current_page_number * Number(pageSize) || 0),
          pagesize: pageSize,
        },
        isModal: true,
        isNextPage: true,
      })
    }
  }, [nextPage])

  const observer = useRef<IntersectionObserver | null>(null)
  const lastReviewElement = useCallback(
    (node: Element | null) => {
      if (isLoading) return

      if (observer?.current) {
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting) {
          setNextPage((prevNextPage) => !prevNextPage)
        }
      })

      if (node) observer.current?.observe(node)
    },
    [isLoading, nextPage]
  )
  const reviewEvent = () => {
    analytics.send('reviewInteraction', {
      eventLocation: 'product',
      eventAction: 'write a review',
      eventLabel: productData?.id,
    })
  }

  const showWriteAReviewCtaInSummary = isDesktop && ai_review_summary && enableAiSummaryReview

  const writeAReviewCtaProps = {
    link: `/review-a-product?product=${productId}`,
    sx: styles.reviewCTA,
    onClick: reviewEvent,
    target: '_blank',
    rel: 'noopener noreferrer',
  }

  const ratingWithPercentList = useMemo(
    () => (
      <Box sx={styles.ratingWithPercentModalContainer} data-qa="pdp_overall_rating_scores">
        {ratings?.map((rating, i) => (
          <RatingWithPercent
            key={i}
            star={5 - i}
            percent={`${rating}%`}
            ratingsFilter={ratingsFilterModal}
            setRatingsFilter={setRatingsFilterModal}
          />
        ))}
      </Box>
    ),
    [ratings, ratingsFilterModal, setRatingsFilterModal, styles]
  )

  const handleModalClearFilters = useCallback(() => {
    setRatingsFilter((prev) => ({
      ...prev,
      search: '',
      filterBy: '',
      ratingsFilterValue: '',
    }))
  }, [setRatingsFilter])

  const handleModalFiltersChange = useCallback(
    (nextFilter: RatingsFilter) => {
      setRatingsFilter((prev) => ({
        ...prev,
        search: nextFilter.search,
        filterBy: nextFilter.filterBy,
        ratingsFilterValue: nextFilter.ratingsFilterValue,
        sortBy: nextFilter.sortBy,
      }))
    },
    [setRatingsFilter]
  )

  const renderReviewsAndRatingInfo = (isModalContent: boolean) => {
    if (isReviewSectionUnderProductImage) {
      return (
        <Box display={!isMobile && 'flex'}>
          <RatingStars
            variant={isPDPV3Mobile ? 'xs' : 'large'}
            starCount={String(average_rating)}
            justify="center"
            starWrapper={styles.starHeaderWrapper as SystemStyleObject}
          />
          <StarAndReviewCount
            isModalContent={isModalContent}
            ratingCount={average_rating && average_rating?.toFixed(1)}
            reviewCount={review_count}
            isMobile={isMobile}
          />
        </Box>
      )
    }
    return (
      <>
        <RatingStars
          variant={isPDPV3Mobile || isPDPv5Variant ? 'xs' : 'large'}
          starCount={String(average_rating)}
          justify="center"
          starWrapper={styles.starHeaderWrapper as SystemStyleObject}
          containerMarginLeft={isPDPV5_1Enabled ? '0' : '1.5px'}
        />
        <StarAndReviewCount
          isModalContent={isModalContent}
          ratingCount={average_rating && average_rating?.toFixed(1)}
          reviewCount={review_count}
          isMobile={isMobile}
          variant={variant}
        />
      </>
    )
  }

  return (
    <Box
      sx={styles.reviewContentMainContainer({
        isDesktop,
        isReviewSectionUnderProductImage,
        isModalContent,
      })}
    >
      <Box sx={styles.reviewContentContainer}>
        <Box sx={styles.reviewTitleContainer(isModalContent, isDesktop)}>
          <ConditionalWrapper
            Wrapper={Box}
            condition={isPDPv5Variant || isPDPv6Enabled}
            sx={styles.reviewsInfo}
          >
            <Box
              className={`reviews-info-details ${
                !isLoading && (reviewPaging?.total_results === 0 || !isSiteParamsAvailable)
                  ? 'no-reviews'
                  : ''
              } ${isReviewSectionUnderProductImage ? 'reviews-info-under-image' : ''}`}
              alignItems={isMobile && 'center'}
              sx={styles.reviewsInfoDetails}
            >
              <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
                <ReviewTitle
                  isModalContent={isModalContent}
                  title={
                    isModalContent
                      ? formatMessage({
                          id: 'pdp.product.allReviews',
                          defaultMessage: 'All Reviews',
                        })
                      : formatMessage({ id: 'pdp.product.reviews', defaultMessage: 'Reviews' })
                  }
                  variant={variant}
                />
              </Experiment>
              <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                <ReviewTitle
                  isModalContent={isModalContent}
                  title={formatMessage({ id: 'pdp.product.reviews', defaultMessage: 'Reviews' })}
                  variant={isPDPv6Enabled ? variant : undefined}
                />
              </Experiment>
              {!isModalContent && average_rating > 0 && (
                <Template forIDs={[TemplateName.pdpv6]}>
                  <Box data-qa="reviews_average_rating" sx={styles.reviewsAverageRating}>
                    {average_rating?.toFixed(1)}
                  </Box>
                </Template>
              )}
              {!reviewPaging && isSiteParamsAvailable ? (
                <ReviewSkeleton isHeaderContent count={0} />
              ) : review_count || average_rating ? (
                <>
                  {(isModalContent || !isPDPv6Enabled) && (
                    <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                      <Box sx={styles.pdpRatingDetailsContainer} display="flex">
                        {renderReviewsAndRatingInfo(isModalContent)}
                      </Box>
                    </Experiment>
                  )}
                  <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
                    {renderReviewsAndRatingInfo(isModalContent)}
                  </Experiment>
                  {!isModalContent && (
                    <Template forIDs={[TemplateName.pdpv6]}>
                      <Box sx={styles.reviewsCount} display="flex">
                        <RatingStars
                          variant={isPDPV3Mobile ? 'xs' : 'large'}
                          starCount={String(average_rating)}
                          justify="center"
                          starWrapper={styles.starHeaderWrapper as SystemStyleObject}
                        />
                        {review_count}{' '}
                        {review_count > 1
                          ? formatMessage({
                              id: 'pdp.product.reviewsRatingLabel',
                              defaultMessage: 'Reviews',
                            })
                          : formatMessage({
                              id: 'pdp.product.reviewRatingLabel',
                              defaultMessage: 'Review',
                            })}
                      </Box>
                    </Template>
                  )}
                </>
              ) : (
                !isLoading &&
                (reviewPaging?.total_results === 0 || !isSiteParamsAvailable) && (
                  <Box sx={styles.noResultReviewsMessage}>
                    {formatMessage({
                      id: 'pdp.product.noResultReviews',
                      defaultMessage: 'There are no reviews yet.',
                    })}
                  </Box>
                )
              )}
            </Box>
            <Template forIDs={[TemplateName.pdpv6]} forMobile>
              {!isModalContent && <ReviewSummary styles={styles} summary={ai_review_summary} />}
            </Template>
            <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
              {isModalContent && (
                <Box sx={styles.reviewInfoWrapper}>
                  <Box sx={styles.reviewInfo} data-qa="rnr_txt_allrev_ratstars">
                    {average_rating && average_rating?.toFixed(1)}{' '}
                    {formatMessage({
                      id: 'pdp.product.starsRatingReview',
                      defaultMessage: 'Stars',
                    })}
                  </Box>
                  <Box sx={styles.rectangle} />
                  <Box sx={styles.reviewInfo} data-qa="rnr_txt_allrev_revcount">
                    {review_count}{' '}
                    {review_count > 1
                      ? formatMessage({
                          id: 'pdp.product.reviewsRatingLabel',
                          defaultMessage: 'Reviews',
                        })
                      : formatMessage({
                          id: 'pdp.product.reviewRatingLabel',
                          defaultMessage: 'Review',
                        })}
                  </Box>
                </Box>
              )}
            </Experiment>
            <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
              {!!properties?.length && !isModalContent && (
                <>
                  {!customFitSize && !!sizingRange && !isNaN(sizingRange) && (
                    <DisplayRange
                      label={formatMessage({
                        id: 'pdp.product.sizeReviewLabel',
                        defaultMessage: 'Size',
                      })}
                      starCount={sizingRange}
                      leftLabel={formatMessage({
                        id: 'pdp.product.smallReviewLabel',
                        defaultMessage: 'Small',
                      })}
                      centerLabel={formatMessage({
                        id: 'pdp.product.trueToSizeReviewLabel',
                        defaultMessage: 'True to Size',
                      })}
                      rightLabel={formatMessage({
                        id: 'pdp.product.largeReviewLabel',
                        defaultMessage: 'Large',
                      })}
                      data-qa="rnr_sizeslider"
                    />
                  )}
                  {!customFitWidth && !!widthRange && !isNaN(widthRange) && (
                    <DisplayRange
                      label={formatMessage({
                        id: 'pdp.product.widthReviewLabel',
                        defaultMessage: 'Width',
                      })}
                      starCount={widthRange}
                      leftLabel={formatMessage({
                        id: 'pdp.product.narrowReviewLabel',
                        defaultMessage: 'Narrow',
                      })}
                      centerLabel={formatMessage({
                        id: 'pdp.product.trueToSizeReviewLabel',
                        defaultMessage: 'True to Size',
                      })}
                      rightLabel={formatMessage({
                        id: 'pdp.product.wideReviewLabel',
                        defaultMessage: 'Wide',
                      })}
                      data-qa="rnr_widthslider"
                    />
                  )}
                </>
              )}
            </Experiment>
            <Template notForIDs={[TemplateName.pdpv5]} forDesktop>
              {!isModalContent && (
                <ReviewSummary
                  styles={styles}
                  summary={ai_review_summary}
                  showCta={productId && !hideWriteReviewCta && showWriteAReviewCtaInSummary}
                  ctaProps={writeAReviewCtaProps}
                />
              )}
            </Template>

            {productId && !hideWriteReviewCta && !showWriteAReviewCtaInSummary && (
              <Box
                textAlign={isReviewSectionUnderProductImage && !isMobile ? 'left' : 'center'}
                sx={
                  isReviewSectionUnderProductImage
                    ? styles.reviewCTAContainerUnderImage
                    : styles.reviewCTAContainer
                }
                data-qa="rnr_link_writerev"
                className="reviews-write-review"
                width="100%"
              >
                <ReviewCTA {...writeAReviewCtaProps}>
                  <span>
                    {formatMessage({
                      id: 'pdp.product.writeAReview',
                      defaultMessage: 'WRITE A REVIEW',
                    })}
                  </span>
                  {isPDPv5Variant && <PlusIcon width="14px" height="14px" />}
                  <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                    <Box marginLeft="var(--spacing-2)">
                      <EditIcon />
                    </Box>
                  </Experiment>
                </ReviewCTA>

                {enableEmplifiDisclaimerVerification?.enableDisclaimer && (
                  <Box textAlign="center" sx={styles.emplifiDisclaimerTextContainer} width="100%">
                    {formatMessage(
                      {
                        id: 'pdp.emplifi.disclaimerText',
                        defaultMessage:
                          'All reviews have been provided without the exchange of any form of consideration. For more information on how we verify our reviews, please read more <a>here</a>.',
                      },
                      {
                        a: (str) => (
                          <Link href="/support/terms-of-use" sx={styles.emplifiDisclaimerTermsLink}>
                            {str}
                          </Link>
                        ),
                      }
                    )}
                  </Box>
                )}
              </Box>
            )}
          </ConditionalWrapper>

          <Template forIDs={[TemplateName.pdpv5]} forDesktop>
            {!isModalContent && (
              <ReviewSummary
                styles={styles}
                summary={ai_review_summary}
                showCta={productId && !hideWriteReviewCta && showWriteAReviewCtaInSummary}
                ctaProps={writeAReviewCtaProps}
              />
            )}
          </Template>
          <Box maxWidth="614px" sx={styles.ratingWithPercentMainContainer}>
            {isModalContent && ratingWithPercentList}
            <ConditionalWrapper
              Wrapper={Experiment}
              notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD}
              alwaysOnForDesktop
              condition={!isModalContent}
            >
              {!!properties?.length && (
                <>
                  <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
                    {(!customFitWidth || !customFitSize) &&
                      !isNaN(sizingRange) &&
                      !isNaN(widthRange) &&
                      sizingRange !== 0 &&
                      widthRange !== 0 && (
                        <Box as="h3" sx={styles.overallFitContainer} data-qa="rnr_txt_fitrat_title">
                          {formatMessage({
                            id: 'pdp.product.fitRatingTitle',
                            defaultMessage: 'Overall Fit',
                          })}
                        </Box>
                      )}
                  </Experiment>
                  {!customFitSize && !!sizingRange && !isNaN(sizingRange) && (
                    <DisplayRange
                      label={formatMessage({
                        id: 'pdp.product.sizeReviewLabel',
                        defaultMessage: 'Size',
                      })}
                      starCount={sizingRange}
                      leftLabel={formatMessage({
                        id: 'pdp.product.smallReviewLabel',
                        defaultMessage: 'Small',
                      })}
                      centerLabel={formatMessage({
                        id: 'pdp.product.trueToSizeReviewLabel',
                        defaultMessage: 'True to Size',
                      })}
                      rightLabel={formatMessage({
                        id: 'pdp.product.largeReviewLabel',
                        defaultMessage: 'Large',
                      })}
                      data-qa="rnr_sizeslider"
                    />
                  )}
                  {!customFitWidth && !!widthRange && !isNaN(widthRange) && (
                    <DisplayRange
                      label={formatMessage({
                        id: 'pdp.product.widthReviewLabel',
                        defaultMessage: 'Width',
                      })}
                      starCount={widthRange}
                      leftLabel={formatMessage({
                        id: 'pdp.product.narrowReviewLabel',
                        defaultMessage: 'Narrow',
                      })}
                      centerLabel={formatMessage({
                        id: 'pdp.product.trueToSizeReviewLabel',
                        defaultMessage: 'True to Size',
                      })}
                      rightLabel={formatMessage({
                        id: 'pdp.product.wideReviewLabel',
                        defaultMessage: 'Wide',
                      })}
                      data-qa="rnr_widthslider"
                    />
                  )}
                </>
              )}
            </ConditionalWrapper>
          </Box>
          <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
            {!isModalContent && Boolean(review_count) && (
              <>
                <Box sx={styles.modalContentDivider} />
                {(!!reviews?.length || isPDPv6Enabled) && <Box sx={styles.contentDividerTwo} />}
                <RatingsFilterForm
                  ratingsFilter={ratingsFilter}
                  setRatingsFilter={setRatingsFilter}
                  sortOrderList={sortOrderList}
                  filtersList={filtersList}
                  filtersListDisplayValue={filtersListDisplayValue}
                  paging={reviewPaging}
                  modalDefaultSortOrderValue={modalDefaultSortOrder}
                  isLoading={isLoading}
                  isReviewSearchEnabled={isReviewSearchEnabled}
                  displaySortAndFilterByOptions={
                    displaySortAndFilterByOptions && enableSortAndFilterInReviews?.mobile
                  }
                  enableWordCloudClickableTags={enableWordCloudClickableTags}
                  wordCloudProperties={wcProperties}
                  topics={topics}
                  properties={properties}
                  isClearFiltersEnabled={keepExistingFiltersForModal}
                  productId={productData?.id}
                  isModalContent={isModalContent}
                  variant={isPDPv6Enabled ? variant : undefined}
                />
              </>
            )}
          </Experiment>
          {!isModalContent && enableRatingBreakdown?.mobile && (
            <Template forIDs={[TemplateName.pdpv6]}>{ratingWithPercentList}</Template>
          )}
          <ConditionalWrapper
            Wrapper={Box}
            condition={isPDPv5Variant || isPDPv6Enabled}
            sx={styles.reviewsInfo}
          >
            <EmplifiPhotoGallery
              photos={reviewsData?.photosWithReviews}
              productId={productData?.id}
            />
          </ConditionalWrapper>
          {isModalContent && (
            <>
              <Box sx={styles.modalContentDivider} />
              {!!reviews?.length && <Box sx={styles.contentDividerTwo} />}
              <RatingsFilterForm
                ratingsFilter={ratingsFilterModal}
                setRatingsFilter={setRatingsFilterModal}
                onClearFilters={handleModalClearFilters}
                onFiltersChange={handleModalFiltersChange}
                sortOrderList={sortOrderList}
                filtersList={filtersList}
                filtersListDisplayValue={filtersListDisplayValue}
                paging={reviewPaging}
                modalDefaultSortOrderValue={modalDefaultSortOrder}
                isLoading={isLoading}
                isReviewSearchEnabled={isReviewSearchEnabled}
                displaySortAndFilterByOptions={displaySortAndFilterByOptions}
                enableWordCloudClickableTags={enableWordCloudClickableTags}
                wordCloudProperties={wcProperties}
                topics={topics}
                properties={properties}
                isClearFiltersEnabled={keepExistingFiltersForModal}
                productId={productData?.id}
                isModalContent={isModalContent}
                variant={isPDPv6Enabled ? variant : undefined}
              />
            </>
          )}
          <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
            {!!reviews?.length && !isPDPv5Variant && (
              <Box
                sx={
                  isReviewSectionUnderProductImage
                    ? styles.contentDividerUnderImage
                    : styles.contentDivider
                }
                className={`content-divider ${
                  isReviewSectionUnderProductImage ? 'content-divider-review-under-image' : ''
                }`}
              />
            )}
          </Experiment>
          {!reviewPaging && isSiteParamsAvailable && <ReviewSkeleton count={3} />}
          {(isModalContent ? modalReviews : reviews?.slice?.(0, pageSizePDP))?.map?.(
            (review: TReview, i: number) => {
              return (
                <Fragment key={review?.review_id}>
                  <ReviewListItem
                    isDesktop={isDesktop}
                    review={review}
                    isModalContent={isModalContent}
                    productDataId={productData?.id}
                    wcPreferenceProperties={wcProperties}
                    variant={variant}
                    isFirstReview={i === 0}
                    isInitialRef={isInitialRef}
                  />
                  {modalReviews?.length === i + 1 && !!reviewPaging?.next_page_url && (
                    <div ref={lastReviewElement}></div>
                  )}
                </Fragment>
              )
            }
          )}
        </Box>
        {!isModalContent && !!reviews?.length && reviews.length > pageSizePDP && (
          <Box
            sx={styles.viewAllReviewCTAContainer(isDesktop, isReviewSectionUnderProductImage)}
            className="reviews-view-all"
          >
            <ReviewCTA
              onClick={onReviewInteraction}
              target="_blank"
              rel="noopener noreferrer"
              sx={styles.viewAllReviewCTA}
              data-qa="rnr_btn_viewallrev"
            >
              <span>
                {formatMessage({
                  id: 'pdp.product.viewAllReview',
                  defaultMessage: 'VIEW ALL REVIEWS',
                })}
              </span>
              {isPDPv5Variant && <PlusIcon width="14px" height="14px" />}
              <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                <Box marginLeft="var(--spacing-2)">
                  <PlusIcon {...styles.reviewCTAIconSize} />
                </Box>
              </Experiment>
            </ReviewCTA>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReviewList
