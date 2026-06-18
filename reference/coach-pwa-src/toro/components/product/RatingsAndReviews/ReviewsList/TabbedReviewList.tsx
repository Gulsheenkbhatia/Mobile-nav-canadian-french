import { Fragment, useEffect, useMemo, useCallback } from 'react'
import ReviewTitle from 'toro/components/product/RatingsAndReviews/ReviewTitle'
import Box from 'toro/components/Box'
import RatingStars from 'toro/components/product/RatingsAndReviews/RatingStars'
import DisplayRange from 'toro/components/product/RatingsAndReviews/DisplayRange'
import RatingWithPercent from 'toro/components/product/RatingsAndReviews/RatingWithPercent'
import ReviewCTAComponent from 'toro/components/product/RatingsAndReviews/ReviewCTA'
import ReviewListItem from 'toro/components/product/RatingsAndReviews/ReviewListItem'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import usePreference from 'toro/hooks/usePreference_new'
import ReviewSkeletonComponent from 'toro/components/product/RatingsAndReviews/ReviewSkeleton'
import useAnalytics from 'toro/analytics/useAnalytics'
import { Tag, TagCloseButton, TagLabel, type SystemStyleObject } from '@chakra-ui/react'
import mapValues from 'lodash/mapValues'
import type {
  TReview,
  ReviewListProps,
  ReviewSkeletonProps,
  ReviewCTAProps,
  TFetchReviews,
  ReviewRollup,
} from './types'
import ClickableTags from 'toro/components/product/RatingsAndReviews/ClickableTags/ClickableTags'
import { FilterType } from 'toro/hooks/useRatingsAndReviews'
import { TABBED_PDP_DISPLAY_REVIEWS_LIMIT } from 'toro/constants/adaptiveExperience'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import { POWER_REVIEWS_SEPARATORS } from 'toro/helpers/emplifiNormalizers'
import isEqual from 'lodash/isEqual'
import Link from 'toro/components/Link'

const ReviewCTA = ReviewCTAComponent as React.FC<ReviewCTAProps>
const ReviewSkeleton = ReviewSkeletonComponent as React.FC<ReviewSkeletonProps>

function TabbedReviewList({
  isSiteParamsAvailable,
  sizingRange,
  widthRange,
  siteId,
  productId,
  modelID,
  productData,
  variant,
  isActive = true,
  ratingsAndReviewsData,
}: ReviewListProps) {
  const styles = useMultiStyleConfig('RatingsAndReviews', { variant }) as any
  const { PlusIcon, EditIcon } = useMultiStyleConfig('Icons') as any
  const analytics = useAnalytics()
  const { formatMessage } = useIntl()
  const {
    powerReviews: {
      pageSizeAllReviewsModalMobile = 10,
      defaultSortOrder = 'HighestRating',
      isReviewSearchEnabled = false,
      displaySortAndFilterByOptions = false,
      modalDefaultSortOrder = 'Newest',
      enableWordCloudClickableTags = false,
      enableEmplifiDisclaimerVerification,
      enableWriteAReviewCta = false,
    },
  } = usePreference({
    powerReviews: [
      'pageSizeAllReviewsModalMobile',
      'defaultSortOrder',
      'isReviewSearchEnabled',
      'displaySortAndFilterByOptions',
      'modalDefaultSortOrder',
      'enableWordCloudClickableTags',
      'enableEmplifiDisclaimerVerification',
      'enableWriteAReviewCta',
    ],
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
    prevReviewsFilter,
    setRatingsFilterModal,
    setModalReviews,
    setPrevReviewsFilter,
    setReviewModalOpened,
    setAtomReviews,
    setLoading,
    setRatingsFilter,
    reviewEvent,
    handleChangeFilter,
    fetchReviewsByModelId,
    setReviews,
    setRollupData,
    setReviewPaging,
  } = ratingsAndReviewsData

  const isClearFiltersEnabled =
    displaySortAndFilterByOptions || (enableWordCloudClickableTags && Boolean(wcProperties.length))

  const updateReviews = async ({
    fetchParam,
    signal = null,
    setInitialReviewData = false,
  }: TFetchReviews) => {
    try {
      if (isSiteParamsAvailable) {
        const {
          reviews: newFetchedReviews = [] as TReview[],
          rollup = {} as ReviewRollup,
          paging,
        } = await fetchReviewsByModelId(fetchParam, signal)

        setReviews(newFetchedReviews)
        setModalReviews(newFetchedReviews)
        setRollupData(rollup)

        if (setInitialReviewData) {
          setAtomReviews(newFetchedReviews)
        }
        if (isActive) {
          setPrevReviewsFilter(ratingsFilter)
          setRatingsFilterModal(ratingsFilter)
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

  useEffect(() => {
    return () => {
      setRatingsFilter((prev) => ({
        ...mapValues(prev, () => ''),
        sortBy: modalDefaultSortOrder,
      }))
    }
  }, [])

  const clearFilter = useCallback(() => {
    analytics.send('filter', {
      action: 'reset',
      currentFilters: '',
      eventLocation: modelID ? 'reviews modal' : 'product',
    })
    setRatingsFilter((prev) => ({
      ...prev,
      search: '',
      filterBy: '',
      ratingsFilterValue: '',
    }))
  }, [modelID, analytics.send])

  const tagLabels = useMemo(() => {
    const filters = ratingsFilter?.filterBy?.split(POWER_REVIEWS_SEPARATORS.filter)
    const searchFilterArr = ratingsFilter?.search
      ? [{ key: 'search', value: ratingsFilter?.search, filterType: FilterType.DEFAULT }]
      : []

    const filterByArr = filters.flatMap((filter) => {
      const [key, values] = filter.split(POWER_REVIEWS_SEPARATORS.keyValue)

      if (!values) {
        return []
      }

      if (wcProperties.includes(key)) {
        return values
          .split(POWER_REVIEWS_SEPARATORS.values)
          .map((value) => ({ key, value, filterType: FilterType.WORD_CLOUD }))
      }

      return [
        {
          key,
          displayLabel: `${values} Star`,
          value: values,
          filterType: FilterType.STAR_RATING,
        },
      ]
    })
    return [...searchFilterArr, ...filterByArr]
  }, [wcProperties, ratingsFilter?.filterBy, ratingsFilter?.search])

  useEffect(() => {
    if (!isActive) return
    if (isEqual(prevReviewsFilter, ratingsFilter)) return
    const controller = new AbortController()
    const signal = controller.signal
    setLoading(true)
    try {
      updateReviews({
        fetchParam: {
          ...ratingsFilter,
          pagesize: pageSizeAllReviewsModalMobile,
        },
        signal,
      })
    } catch (error) {
      setLoading(false)
    }

    return () => {
      setLoading(false)
      controller.abort()
    }
  }, [ratingsFilter])

  useEffect(() => {
    const defaultRatingFilter = { ...ratingsFilter, sortBy: defaultSortOrder }
    setRatingsFilter(defaultRatingFilter)
    setPrevReviewsFilter(defaultRatingFilter)
    setRatingsFilterModal(defaultRatingFilter)
  }, [defaultSortOrder])

  useEffect(() => {
    const filterOptions = {
      ...ratingsFilter,
      pagesize: pageSizeAllReviewsModalMobile,
      sortBy: defaultSortOrder,
    }

    updateReviews({
      fetchParam: filterOptions,
      setInitialReviewData: true,
    })
    return () => {
      setAtomReviews([])
    }
  }, [defaultSortOrder, modelID])

  const getTagLabels = () => {
    return tagLabels.map(
      ({ key, value, filterType }) =>
        value && (
          <Tag sx={styles.pdpReviewmodalFiltersApplied} key={`${key}-${value}`}>
            <TagLabel>{value}</TagLabel>
            <TagCloseButton
              onClick={() => handleChangeFilter({ key, value, isRating: false, filterType })}
            />
          </Tag>
        )
    )
  }

  const renderClientFilters = (isClearFiltersEnabled, isReviewSearchEnabled) => {
    if (
      (isClearFiltersEnabled || isReviewSearchEnabled) &&
      Object.keys(ratingsFilter || {})
        .filter((item) => item !== 'sortBy')
        .some((item) => ratingsFilter?.[item] !== '')
    ) {
      return (
        <Flex sx={styles.pdpReviewsClearTagsContainer}>
          <Text
            data-qa="word_cloud_clear_filter"
            sx={styles.pdpReviewsClearTags}
            onClick={clearFilter}
            cursor="pointer"
          >
            {formatMessage({
              id: 'pdp.product.clearFiltersRatingLabel',
              defaultMessage: 'Clear Filter(s)',
            })}
          </Text>
          {getTagLabels()}
        </Flex>
      )
    }
    return null
  }

  const showWriteAReviewCta =
    enableWriteAReviewCta &&
    !isLoading &&
    reviewPaging?.total_results > 0 &&
    reviewPaging?.total_results <= TABBED_PDP_DISPLAY_REVIEWS_LIMIT

  const renderReviewCTA = () => (
    <Box
      textAlign="center"
      sx={styles.reviewCTAContainer}
      data-qa="rnr_link_writerev"
      className="reviews-write-review1"
    >
      <ReviewCTA
        link={`/review-a-product?product=${productId}`}
        sx={styles.reviewCTA}
        onClick={reviewEvent}
        target="_blank"
        rel="noopener noreferrer"
      >
        {formatMessage({
          id: 'pdp.product.writeAReview',
          defaultMessage: 'WRITE A REVIEW',
        })}
        <Box>
          <EditIcon />
        </Box>
      </ReviewCTA>
    </Box>
  )
  return (
    <Box sx={styles.reviewContentMainContainer({})}>
      <Box sx={styles.reviewContentContainer}>
        <Box sx={styles.reviewTitleContainer()}>
          {variant === 'tabbedPDPReviewList' && (
            <Box sx={styles.reviewTitleWrapper}>
              <ReviewTitle
                title={formatMessage({ id: 'pdp.product.reviews', defaultMessage: 'Reviews' })}
              />
            </Box>
          )}
          <Box
            className={`reviews-info-details ${
              !isLoading && (reviewPaging?.total_results === 0 || !isSiteParamsAvailable)
                ? 'no-reviews'
                : ''
            }`}
            alignItems="center"
          >
            {!reviewPaging && isSiteParamsAvailable ? (
              <ReviewSkeleton isHeaderContent count={0} />
            ) : average_rating ? (
              <>
                <ReviewTitle title={average_rating?.toFixed(1)} variant={variant} />
                <Box sx={styles.pdpRatingDetailsContainer}>
                  <RatingStars
                    variant="xs"
                    starCount={String(average_rating)}
                    justify="center"
                    starWrapper={styles.starHeaderWrapper as SystemStyleObject}
                  />
                  <Box sx={styles.reviewsRatingLabel} data-qa="rnr_txt_allrev_paging">
                    {review_count}{' '}
                    {formatMessage({
                      id: 'pdp.product.reviewsRatingLabel',
                      defaultMessage: 'Reviews',
                    })}
                  </Box>
                </Box>
              </>
            ) : (
              !isLoading &&
              (reviewPaging?.total_results === 0 || !isSiteParamsAvailable) && (
                <>
                  <Box sx={styles.noResultReviewsMessage}>
                    {formatMessage({
                      id: 'pdp.product.noResultReviews',
                      defaultMessage: 'There are no reviews yet.',
                    })}
                  </Box>
                  {renderReviewCTA()}
                </>
              )
            )}
          </Box>
          {enableEmplifiDisclaimerVerification?.enableDisclaimer && (
            <Box textAlign="center" sx={styles.emplifiDisclaimerTextContainer}>
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
          {((Boolean(properties.length) && Boolean(wcProperties.length)) ||
            Boolean(topics?.length)) &&
            enableWordCloudClickableTags && (
              <ClickableTags
                properties={properties}
                topics={topics}
                handleChangeFilter={handleChangeFilter}
                ratingsFilter={ratingsFilter}
                allowedFilters={wcProperties}
                variant={variant}
              />
            )}
          {renderClientFilters(isClearFiltersEnabled, isReviewSearchEnabled)}
          {(!customFitSize && !!sizingRange && !isNaN(sizingRange)) ||
          (!customFitWidth && !!widthRange && !isNaN(widthRange)) ? (
            <Box sx={styles.fitSizesContainer}>
              {!customFitSize && !!sizingRange && !isNaN(sizingRange) && (
                <DisplayRange
                  label={formatMessage({
                    id: 'pdp.product.sizeReviewLabel',
                    defaultMessage: 'Size / Fit',
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
                  variant={variant}
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
                  variant={variant}
                />
              )}
            </Box>
          ) : (
            !!ratings.length && (
              <Box sx={styles.ratingWithPercentModalContainer} data-qa="pdp_overall_rating_scores">
                {ratings?.map((rating, i) => (
                  <RatingWithPercent
                    key={i}
                    star={5 - i}
                    percent={`${rating}%`}
                    variant={variant}
                  />
                ))}
              </Box>
            )
          )}
          {!reviewPaging && isSiteParamsAvailable && <ReviewSkeleton count={3} />}
          {reviews
            ?.slice?.(0, TABBED_PDP_DISPLAY_REVIEWS_LIMIT)
            ?.map?.((review: TReview, i: number) => {
              return (
                <Fragment key={review?.review_id}>
                  <ReviewListItem
                    review={review}
                    productDataId={productData?.id}
                    variant={variant}
                    wcPreferenceProperties={wcProperties}
                    isFirstReview={i === 0}
                  />
                </Fragment>
              )
            })}
        </Box>
        {showWriteAReviewCta && renderReviewCTA()}
        {!!reviews?.length && reviews.length > TABBED_PDP_DISPLAY_REVIEWS_LIMIT && (
          <Box sx={styles.viewAllReviewCTAContainer()} className="reviews-view-all">
            <ReviewCTA
              onClick={() => {
                analytics.send('reviewInteraction', {
                  eventLocation: 'product',
                  eventAction: 'view all reviews',
                  eventLabel: productData?.id || undefined,
                })
                setReviewModalOpened(true)
                setRatingsFilterModal(ratingsFilter)
              }}
              target="_blank"
              rel="noopener noreferrer"
              sx={styles.viewAllReviewCTA}
              data-qa="rnr_btn_viewallrev"
            >
              {formatMessage({
                id: 'pdp.product.viewAllReview',
                defaultMessage: 'VIEW ALL REVIEWS',
              })}
              <Box marginLeft="var(--spacing-2)">
                <PlusIcon {...styles.reviewCTAIconSize} />
              </Box>
            </ReviewCTA>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default TabbedReviewList
