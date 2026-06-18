import get from 'lodash/get'

type ReviewObj = {
  reviewsData: object
  custom: object
}

export const getAverageRating = (
  { reviewsData = {}, custom = {} }: ReviewObj = { reviewsData: {}, custom: {} }
): number | undefined => {
  return (
    get(reviewsData, 'results[0].rollup.average_rating', 0) || get(custom, 'c_avgRatingEmplifi')
  )
}
export const getTotalReviews = (
  { reviewsData = {}, custom = {} }: ReviewObj = { reviewsData: {}, custom: {} }
): number | undefined => {
  return get(reviewsData, 'results[0].rollup.review_count', 0) || get(custom, 'c_revCountEmplifi')
}
