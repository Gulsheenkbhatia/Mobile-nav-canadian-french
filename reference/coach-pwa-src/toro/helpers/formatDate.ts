import { useIntl } from 'react-intl'

const useFormatDate = (rawDate: string, locale: string) => {
  const { formatMessage } = useIntl()
  const date = new Date(rawDate)
  const utc = date.toUTCString() // 'ddd, DD MMM YYYY HH:mm:ss GMT'
  const year = utc.slice(12, 16)
  const month = locale === 'ja-JP' ? ('0' + (date.getMonth() + 1)).slice(-2) : utc.slice(8, 12)
  const dateNumber = utc.slice(5, 7)
  return formatMessage(
    {
      id: 'pdp.product.reviewRatingDate', // YYYYMMMDD
      defaultMessage: '{month} {dateNumber}, {year}', // MMM DD, YYYY
    },
    { year, month, dateNumber }
  )
}

export default useFormatDate
