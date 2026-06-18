import React, { useState, memo, useContext, useCallback, useRef } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Image from 'toro/components/Image'
import RatingStars from './RatingStars'
import ReviewListItemResponse from './ReviewListItemResponse'
import get from 'lodash/get'
import usePreference from 'toro/hooks/usePreference_new'
import useAnalytics from 'toro/analytics/useAnalytics'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import PWAContext from 'components/common/PWAContext'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import formatDate from 'toro/helpers/formatDate'
import useExperiment from 'toro/hooks/useExperiment'
import { VOTE_TYPE } from 'toro/helpers/emplifiNormalizers'
import { voteEmplifiReview } from 'toro/helpers/fetchEmplifiReviews'
import { InView } from 'react-intersection-observer'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import useTemplate from 'toro/hooks/useTemplate'
import { TemplateName } from 'toro/constants/templates'
import useSelectedVariantData from 'toro/hooks/useSelectedVariantData'

interface ReviewListItemProps {
  isDesktop?: boolean
  review?: Record<string, any>
  isModalContent?: boolean
  productDataId?: string
  variant?: string
  wcPreferenceProperties?: Record<string, any>
  isFirstReview?: boolean
  isInitialRef?: React.MutableRefObject<boolean>
  onViewBody?: () => void
}

function ReviewListItem({
  isDesktop = false,
  review = {},
  isModalContent = false,
  productDataId = '',
  variant,
  wcPreferenceProperties,
  isFirstReview,
  isInitialRef,
}: ReviewListItemProps) {
  const {
    details: {
      nickname = '',
      headline = '',
      comments = '',
      merchant_response = null,
      created_date = '',
      bottom_line = null,
      brand_name = '',
      source = '',
      properties = [],
      incentivized = false,
    } = {},
    metrics: { helpful_votes = 0, not_helpful_votes = 0, rating = 0 } = {},
    badges: { is_staff_reviewer = false } = {},
    ugc_id,
  } = review || {}
  const styles = useMultiStyleConfig('RatingsAndReviews', { variant })
  const { ThumbUpFilled, ThumbUp, ThumbDownFilled, ThumbDown } = useMultiStyleConfig('Icons')
  const { isMobile } = useViewportType()
  const isPDPV3Mobile = useExperiment(EXPERIMENTS.PDP_V3_BELOW_THE_FOLD) && isMobile
  const [upVote, setUpVote] = useState(helpful_votes)
  const [downVote, setDownVote] = useState(not_helpful_votes)
  const [voteAnimation, setVoteAnimation] = useState({ show: false, type: '' })
  const [upVoteToggle, setUpVoteToggle] = useState(true)
  const [downVoteToggle, setDownVoteToggle] = useState(true)
  const [voted, setVoted] = useState(false)
  const { formatMessage } = useIntl()
  const { appData } = useContext(PWAContext)
  const isReviewSectionUnderProductImage = useExperiment(EXPERIMENTS.REVIEW_UNDER_PRODUCT_IMAGE)
  const isTabbedPDPEnabled = variant === 'tabbedPDPReviewList'
  const isPDPV5Enabled = useTemplate([TemplateName.pdpv5])
  const isPDPv5Variant = isPDPV5Enabled && !isModalContent

  const usualsize = properties?.find?.(({ key }) => key === 'usualsize')
  const sizeordered = properties?.find?.(({ key }) => key === 'sizeordered')
  const ageRange = properties?.find?.(({ key }) => key === 'age')
  const locale = get(appData, 'locale')
  const currentLocale = locale?.split('-')?.[0]

  const {
    powerReviews: {
      isEnableHelpfulButton,
      showAttributionBadging,
      siteBrandsList,
      merchantResponseHeaderTitle,
      displayImagesUnderReviewSection,
      enableAgeRange,
      displayRecommendToFriendSection = true,
      enableEmplifiDisclaimerVerification,
    },
  } = usePreference({
    powerReviews: [
      'isEnableHelpfulButton',
      'showAttributionBadging',
      'siteBrandsList',
      'merchantResponseHeaderTitle',
      'displayImagesUnderReviewSection',
      'enableAgeRange',
      'displayRecommendToFriendSection',
      'enableEmplifiDisclaimerVerification',
    ],
  })

  const verificationText = enableEmplifiDisclaimerVerification?.enableVerification && (
    <Box sx={styles.pdpReviewsRatingDetailsInfo}>
      {formatMessage({
        id: 'pdp.emplifi.VerifiationText',
        defaultMessage: 'Verified review',
      })}
    </Box>
  )

  const wcProperties = Boolean(wcPreferenceProperties.length)
    ? properties?.filter(({ key }) => wcPreferenceProperties.includes(key))
    : []

  const merchantResponseHeaderTitleLocale =
    merchantResponseHeaderTitle?.['merchantResponseLocale']?.[currentLocale] ||
    merchantResponseHeaderTitle
  const analytics = useAnalytics()

  const firstAvailableReviewImage = get(review, 'media', []).find((media) => {
    return get(media, 'type') == 'image'
  })

  const handleVote = async (type, ugc_id) => {
    analytics.send('reviewInteraction', {
      eventLocation: 'product',
      eventAction: type === 'helpful' ? 'like a review' : 'dislike a review',
      eventLabel: productDataId,
    })

    // Note: per current UX, once you vote you cannot unvote or vote again (e.g cannot go from upvote to downvote)
    if (voted) {
      return
    }

    try {
      if (isPDPV3Mobile) setVoteAnimation({ show: true, type })
      let voteReviewResult = await voteEmplifiReview(ugc_id, type)
      if (voteReviewResult?.result && voteReviewResult.result === 'SUCCESS') {
        if (type === 'helpful') {
          setUpVoteToggle(false)
        } else if (type === 'unhelpful') {
          setDownVoteToggle(false)
        }
        setVoted(true)
        if (type === 'helpful') {
          setUpVote(upVote + 1)
        } else if (type === 'unhelpful') {
          setDownVote(downVote + 1)
        }
      }
      if (isPDPV3Mobile) setVoteAnimation({ show: false, type: '' })
    } catch (error) {
      if (type === 'helpful') {
        setUpVoteToggle(true)
      } else if (type === 'unhelpful') {
        setDownVoteToggle(true)
      }
      setVoted(false)
      if (isPDPV3Mobile) setVoteAnimation({ show: false, type: '' })
    }
  }

  const isHelpfulVoteAnimation = voteAnimation.show && voteAnimation.type === 'helpful'
  const isUnhelpfulVoteAnimation = voteAnimation.show && voteAnimation.type === 'unhelpful'

  const renderReviewTag = (property) => {
    return (
      <Box sx={styles.pdpReviewsRatingDetailsInfo}>
        {property?.label}: {property?.value?.join(', ')}
      </Box>
    )
  }

  const { selectedVariant } = useContext(ProductMainSectionBreakpointContext)
  const pdpV5SelectedVariantId = useSelectedVariantData('id')
  const selectedVariantId = isPDPV5Enabled ? pdpV5SelectedVariantId : selectedVariant?.id

  const previousSelectedVariant = useRef(null)
  const manageReviewBodyVisibility = useCallback(
    (visible) => {
      if (visible) {
        if (
          selectedVariantId === previousSelectedVariant.current ||
          (isModalContent && !isInitialRef?.current)
        ) {
          return
        }
        previousSelectedVariant.current = selectedVariantId
        analytics.send('reviewInteraction', {
          eventLocation: 'product',
          eventAction: 'first review visible',
          eventLabel: selectedVariantId || undefined,
        })
      }
    },
    [selectedVariantId, review, isModalContent]
  )

  return (
    <>
      <Flex
        sx={styles.reviewListItemContainer}
        flexDirection={isDesktop ? 'row' : 'column'}
        data-qa="pdp_reviews_item_wrapper"
        className="review-list-item"
      >
        <Box
          sx={styles.ratingInformationBox}
          width={isDesktop ? (isReviewSectionUnderProductImage ? '40%' : '30%') : '100%'}
          className="review-list-item-rating-information-wrapper"
        >
          <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
            <Box sx={styles.pdpReviewsRatingUserProfile}>
              <Box
                sx={styles.pdpReviewsRatingDetailsUserInfo}
                className="review-list-item-user-info"
              >
                {nickname
                  ? `${nickname}, ${formatDate(created_date, locale)}`
                  : formatDate(created_date, locale)}
              </Box>
              {ageRange && enableAgeRange && (
                <Box sx={styles.pdpReviewsRatingAgeRange} data-qa="pdp_review_age_range">
                  {ageRange?.label}: {get(ageRange, 'value[0]', '')}
                </Box>
              )}
            </Box>
            <RatingStars
              justify="flex-start"
              variant="xs"
              starCount={rating}
              starWrapper={styles.starWrapper(isMobile)}
            />
          </Experiment>
          <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
            <Box className="review-list-item-header" sx={styles.ratingInformationHeader}>
              <RatingStars
                justify="flex-start"
                variant="xs"
                starCount={rating}
                starWrapper={styles.starWrapper(isMobile)}
                containerMarginLeft={isPDPv5Variant ? '0px' : '1.5px'}
              />
              <Box
                sx={styles.pdpReviewsRatingDetailsUserInfo}
                className="review-list-item-user-info"
              >
                {nickname
                  ? `${nickname}, ${formatDate(created_date, locale)}`
                  : formatDate(created_date, locale)}
              </Box>
            </Box>
            {usualsize && (
              <Box sx={styles.pdpReviewsRatingDetailsInfo}>
                {usualsize?.label}: {get(usualsize, 'value[0]', '')}
              </Box>
            )}
            {sizeordered && (
              <Box sx={styles.pdpReviewsRatingDetailsInfo}>
                {sizeordered?.label}: {get(sizeordered, 'value[0]', '')}
              </Box>
            )}
            {!isPDPv5Variant && bottom_line && displayRecommendToFriendSection && (
              <Box sx={styles.pdpReviewsRatingDetailsInfo}>
                {formatMessage({
                  id: 'pdp.product.reviewRatingRecommendation',
                  defaultMessage: 'Recommend to Friends:',
                })}{' '}
                {formatMessage(
                  {
                    id: `pdp.product.reviewRating${bottom_line}`,
                    defaultMessage: '{bottom_line}',
                  },
                  { bottom_line }
                )}
              </Box>
            )}
            {verificationText}
          </Experiment>
        </Box>
        <Box width={isDesktop ? '98%' : '100%'} sx={styles.reviewListItemResponseContainer}>
          <ConditionalWrapper
            Wrapper={InView}
            condition={isFirstReview}
            onChange={manageReviewBodyVisibility}
            threshold={0.75}
          >
            <ReviewListItemResponse
              title={headline}
              description={comments}
              variant={variant}
              isModalContent={isModalContent}
              incentivized={incentivized}
            />
          </ConditionalWrapper>
          <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
            <Flex flexDirection="column" w="100%" gap={2}>
              {bottom_line && displayRecommendToFriendSection && (
                <Box sx={styles.pdpReviewsRatingDetailsInfo}>
                  {formatMessage({
                    id: 'pdp.product.reviewRatingRecommendation',
                    defaultMessage: 'Recommend to Friends:',
                  })}{' '}
                  {formatMessage(
                    {
                      id: `pdp.product.reviewRating${bottom_line}`,
                      defaultMessage: '{bottom_line}',
                    },
                    { bottom_line }
                  )}
                </Box>
              )}
              {wcProperties.map(renderReviewTag)}
              {verificationText}
            </Flex>
          </Experiment>
          {isPDPv5Variant && bottom_line && displayRecommendToFriendSection && (
            <Box sx={styles.pdpReviewsBottomLine}>
              <span>
                {formatMessage({
                  id: 'pdp.product.reviewRatingRecommendation',
                  defaultMessage: 'Recommend to Friends:',
                })}{' '}
                {formatMessage(
                  {
                    id: `pdp.product.reviewRating${bottom_line}`,
                    defaultMessage: '{bottom_line}',
                  },
                  { bottom_line }
                )}
              </span>
            </Box>
          )}
          {merchant_response && (
            <ReviewListItemResponse
              title={merchantResponseHeaderTitleLocale}
              description={merchant_response}
              isModalContent={isModalContent}
              variant={variant}
              incentivized={incentivized}
            />
          )}
          {displayImagesUnderReviewSection && firstAvailableReviewImage && (
            <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
              <Image
                src={firstAvailableReviewImage?.uri}
                alt={firstAvailableReviewImage?.caption}
                lazy
                imgResponsive={styles.imageReview}
              ></Image>
            </Experiment>
          )}

          {isEnableHelpfulButton && (
            <Flex className="review-list-item-helpful-container" sx={styles.reviewHelpfulContainer}>
              <Box
                sx={styles.pdpReviewsHelpfulLabel}
                as="span"
                data-qa="rnr_label_revhelpful"
                className="review-list-item-helpful-title"
              >
                <span>
                  {formatMessage({
                    id: 'pdp.product.reviewRatingHelpful',
                    defaultMessage: 'Was this review helpful?',
                  })}
                </span>
              </Box>
              <Flex>
                <Flex
                  sx={styles.pdpReviewsHelpfulVoteup}
                  className={!upVoteToggle ? 'upVoted' : voted ? 'voted' : ''}
                  align="center"
                  onClick={upVoteToggle ? () => handleVote(VOTE_TYPE.helpful, ugc_id) : null}
                >
                  <Box
                    sx={styles.reviewRatingVoteThumbs}
                    cursor={voted ? undefined : 'pointer'}
                    as="span"
                    className="review-rating-vote-thumbs"
                    data-qa={isModalContent ? 'rnr_btn_allrev_likerev' : 'rnr_btn_likerev'}
                  >
                    <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
                      {!upVoteToggle ? (
                        <ThumbUpFilled {...styles.thumbsIconsSize} />
                      ) : (
                        <ThumbUp {...styles.thumbsIconsSize} />
                      )}
                    </Experiment>
                    <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                      <ThumbUp {...styles.thumbsIconsSize} {...styles.thumbsIconsSizeV3} />
                    </Experiment>
                  </Box>
                  <Box
                    sx={styles.pdpReviewsHelpfulVoteCount}
                    as="span"
                    data-qa="rnr_txt_likerevcount"
                    className={`
                      ${
                        (voted && !upVoteToggle && isPDPV3Mobile) || isHelpfulVoteAnimation
                          ? 'side-text-animation'
                          : ''
                      } review-rating-vote-count`}
                  >
                    {upVote}
                  </Box>
                </Flex>
                <Flex
                  sx={styles.pdpReviewsHelpfulVotedown}
                  align="center"
                  className={voted && downVoteToggle ? 'voted' : ''}
                  onClick={downVoteToggle ? () => handleVote(VOTE_TYPE.unhelpful, ugc_id) : null}
                >
                  <Box
                    sx={styles.reviewRatingVoteThumbs}
                    cursor={voted ? undefined : 'pointer'}
                    as="span"
                    className="review-rating-vote-thumbs"
                    data-qa={isModalContent ? 'rnr_btn_allrev_dislikerev' : 'rnr_btn_dislikerev'}
                  >
                    <Experiment notForIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} alwaysOnForDesktop>
                      {!downVoteToggle ? (
                        <ThumbDownFilled {...styles.thumbsIconsSize} />
                      ) : (
                        <ThumbDown {...styles.thumbsIconsSize} />
                      )}
                    </Experiment>
                    <Experiment forIDs={EXPERIMENTS.PDP_V3_BELOW_THE_FOLD} forMobile>
                      <ThumbDown {...styles.thumbsIconsSize} {...styles.thumbsIconsSizeV3} />
                    </Experiment>
                  </Box>
                  <Box
                    sx={styles.pdpReviewsHelpfulVoteCount}
                    as="span"
                    data-qa="rnr_txt_dislikerevcount"
                    className={`
                      ${
                        (voted && !downVoteToggle && isPDPV3Mobile) || isUnhelpfulVoteAnimation
                          ? 'side-text-animation'
                          : ''
                      } review-rating-vote-count`}
                  >
                    {downVote}
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          )}
          {!isTabbedPDPEnabled &&
            showAttributionBadging &&
            brand_name &&
            source &&
            !siteBrandsList?.includes(brand_name) && (
              <Box sx={styles.reviewBadgeContainer}>
                {formatMessage({
                  id: 'pdp.product.reviewRatingPostingBrand',
                  defaultMessage: 'Originally posted on',
                })}{' '}
                {brand_name}
              </Box>
            )}
          <Box sx={styles.reviewBadgeContainer}>{is_staff_reviewer && 'Employee Entry'}</Box>
        </Box>
      </Flex>
    </>
  )
}

export default memo(ReviewListItem)
