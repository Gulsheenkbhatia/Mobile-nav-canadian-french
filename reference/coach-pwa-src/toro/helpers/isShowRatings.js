const isShowRatings = ({
  isEnableRatingOnPLP,
  isProductSet,
  averageOverallRating,
  totalReviewCount,
  isHideReview,
  enableEmplifi,
}) => {
  return (
    enableEmplifi &&
    isEnableRatingOnPLP &&
    !isProductSet &&
    averageOverallRating > 0 &&
    totalReviewCount > 0 &&
    !isHideReview
  )
}

export default isShowRatings
