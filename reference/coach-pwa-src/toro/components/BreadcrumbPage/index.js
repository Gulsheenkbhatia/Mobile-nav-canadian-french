import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'
import Breadcrumb from 'toro/components/Breadcrumb'
import BreadcrumbItem from 'toro/components/BreadcrumbItem'
import BreadcrumbLink from 'toro/components/BreadcrumbLink'
import useViewportType from 'toro/hooks/useViewportType'
import get from 'lodash/get'
import { useRouter } from 'next/router'
import { getSearchUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import useAnalytics from 'toro/analytics/useAnalytics'
import Text from 'toro/components/Text'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { QUERY_PARAM_FROM_SEARCH } from 'toro/constants/appConstants'
import last from 'lodash/last'
import unescape from 'lodash/unescape'
import isString from 'lodash/isString'
import PropTypes from 'prop-types'
import { mapBreadcrumbDataToBreadcrumbs } from 'helpers/getBreadcrumbData'
import { categoryUrlsAtom } from 'store/menu-data.atom'
import { useAtomValue } from 'jotai/utils'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { isPlpV3Atom } from 'store/plp.atom'
import { PAGE_TYPES } from 'toro/constants/googleAnalytics'

const BreadcrumbPage = ({
  plpToPDPBreadcrumbData,
  breadcrumbData,
  apploading,
  variant,
  ...props
}) => {
  const { isMobile } = useViewportType()
  const router = useRouter()
  const categoryUrls = useAtomValue(categoryUrlsAtom)
  const breadcrumbs = useMemo(
    () => mapBreadcrumbDataToBreadcrumbs(categoryUrls, breadcrumbData) || [],
    [categoryUrls, breadcrumbData]
  )
  const isPDP = get(router, 'pathname', '').includes('/products')
  const isPLP = get(router, 'pathname', '').includes('/shop')
  const analytics = useAnalytics()
  const styles = useMultiStyleConfig('BreadcrumbPage', { variant })
  const fromSearchQueryParam = get(router, `query.${QUERY_PARAM_FROM_SEARCH}`, '')
  const { formatMessage } = useIntl()
  const isPDPV3Mobile = useExperiment(EXPERIMENTS.PDP_V3) && isMobile && isPDP
  const isPlpV3 = useAtomValue(isPlpV3Atom)

  // For PDP v3 we don't want to display the product name.
  // The product name is always appended to the breadcrumbs array in api/products.
  const displayedBreadcrumbs = useMemo(() => {
    const _breadcrumbs =
      apploading && plpToPDPBreadcrumbData?.length > 0
        ? [...plpToPDPBreadcrumbData]
        : [...breadcrumbs]

    if (fromSearchQueryParam) {
      const cgid = get(_breadcrumbs, '0.cgid')
      const searchItem = {
        cgid,
        name: unescape(
          formatMessage({
            id: 'pdp.product.backToSearchResult.label',
            defaultMessage: '< Back To Search Results',
          })
        ),
        url: getSearchUrl(fromSearchQueryParam),
      }

      if (isPDPV3Mobile) {
        return [searchItem]
      }

      return [searchItem, last(_breadcrumbs)]
    }

    if (isPDPV3Mobile) {
      _breadcrumbs.splice(-1)
    }

    return _breadcrumbs
  }, [apploading, plpToPDPBreadcrumbData, breadcrumbs, fromSearchQueryParam, isPDPV3Mobile])

  const getBreadcrumbLinkProps = useCallback((item) => {
    const onClick = () => {
      analytics.send('breadcrumb', {
        eventpageLocation: isPDP ? PAGE_TYPES.PDP : PAGE_TYPES.PLP,
        eventLabel: item?.name,
      })
      if (/\/search\?q/.test(item?.url)) {
        router.back()
      }
    }

    return { onClick, href: getLink(item) }
  }, [])

  const currentCategoryId = useMemo(
    () => get(displayedBreadcrumbs, '0.cgid'),
    [displayedBreadcrumbs]
  )

  const absUrlToUrl = (absUrl) => {
    if (!isString(absUrl)) {
      return null
    }
    absUrl = absUrl.replace('https://', '')
    const absUrlArr = absUrl.split('/')
    if (!absUrlArr.length) {
      return null
    }
    absUrlArr.shift()
    return '/' + absUrlArr.join('/')
  }

  const getLink = (breadcrumbItem) => {
    const absUrl = get(breadcrumbItem, 'absUrl', null)
    const anchorUrl = absUrlToUrl(absUrl)
    const anchorLink = get(categoryUrls[breadcrumbItem?.id], 'url', breadcrumbItem?.url)
    try {
      const domain = new URL(anchorLink)
      return anchorLink?.split(domain?.origin)[1]
    } catch {
      return anchorLink || anchorUrl
    }
  }

  if (!breadcrumbData) {
    return null
  }

  const breadcrumbStyles = { ...styles.separator, ...styles.breadcrumbs }

  return (
    <Breadcrumb
      sx={breadcrumbStyles}
      {...props}
      separator="/"
      data-cgid={isPDP || isPLP ? currentCategoryId : null}
      variant={isPlpV3 && isPLP ? 'plpV3' : variant}
    >
      {fromSearchQueryParam.length === 0 && !isPlpV3 && (
        <BreadcrumbItem sx={styles.emptyBreadcrumb} />
      )}
      {displayedBreadcrumbs?.map((item, idx) => (
        <BreadcrumbItem key={`breadcrumb-item-${idx}`} data-qa={`bc_link_lvl${idx + 1}`}>
          {!apploading ? (
            <BreadcrumbLink
              pointerEvents={
                !isPDPV3Mobile && idx === displayedBreadcrumbs.length - 1 ? 'none' : null
              }
              whiteSpace={isMobile ? 'nowrap' : 'normal'}
              sx={styles.breadcrumbLink()}
              {...getBreadcrumbLinkProps(item)}
              className="breadcrumb-link"
            >
              {item?.name}
            </BreadcrumbLink>
          ) : (
            <Text whiteSpace={isMobile ? 'nowrap' : 'normal'} sx={styles.breadcrumbText}>
              {item?.name}
            </Text>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}

export default withErrorBoundaryWrapper(BreadcrumbPage)

BreadcrumbPage.propTypes = {
  plpToPDPBreadcrumbData: PropTypes.array,
  breadcrumbData: PropTypes.array,
  apploading: PropTypes.bool,
}

BreadcrumbPage.defaultProps = {
  plpToPDPBreadcrumbData: [],
  breadcrumbData: [],
}
