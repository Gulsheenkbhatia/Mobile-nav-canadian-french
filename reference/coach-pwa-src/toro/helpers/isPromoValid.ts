import {
  getSitePreviewTimeFromString,
  getTimeFromValidDateString,
} from 'toro/helpers/getTimeFromString'

const isPromoValid = (
  promoStartDate: string,
  promoEndDate: string,
  sitePreviewDate?: string,
  timeZoneOffsetInHours?: number
): boolean => {
  const nowUtc = sitePreviewDate
    ? getSitePreviewTimeFromString(sitePreviewDate, 'UTC', timeZoneOffsetInHours)
    : getTimeFromValidDateString(true, 'UTC')
  const startDateUtc = getTimeFromValidDateString(false, 'UTC', promoStartDate)
  const endDateUtc = getTimeFromValidDateString(false, 'UTC', promoEndDate)

  return (!startDateUtc || nowUtc >= startDateUtc) && (!endDateUtc || nowUtc <= endDateUtc)
}

export default isPromoValid
