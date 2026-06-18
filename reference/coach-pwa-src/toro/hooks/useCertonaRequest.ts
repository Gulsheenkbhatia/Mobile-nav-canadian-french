import { useEffect, useContext, useCallback, DependencyList, useMemo } from 'react'
import get from 'lodash/get'
import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import useViewportType from 'toro/hooks/useViewportType'
import { useIntl } from 'react-intl'
import SessionContext from 'toro/components/SessionContext'
import createCertonaRequest from 'toro/components/Certona/helpers'
import {
  CertonaRequestOptions,
  CertonaScheme,
  certonaScriptLoadedAtom,
} from 'store/certona-schemes.atoms'
import { useAtomValue } from 'jotai/utils'
import usePreference from 'toro/hooks/usePreference_new'

export interface IUseCertonaRequestConfig extends CertonaRequestOptions {
  /** use this config option to enable/disable creating request to Certona based on condition */
  enabled?: boolean
  /** additional dependencies to trigger callback update */
  dependencies?: DependencyList
  /** callback which gets called as Certona request gets created */
  onRequest?: () => void
  /** callback which gets called as Certona request gets fulfilled, gets passed retrieved Certona `schemes` as an argument */
  onResponse?: (schemes: CertonaScheme[] | undefined) => void
}

type CertonaCallback = (argumentOptions?: Partial<CertonaRequestOptions>) => void

interface IUseCertonaRequestHook {
  /**
   * Returns a callback used to create request to Certona if it is enabled and `certonaScriptPath` is set.
   * Populates request options with relevant parameters which can get extended or overwritten with data from `options` argument object.
   * New request is created for unique `pagetype`, `itemid` and `customerid` option.
   * @param {IUseCertonaRequestConfig} config Certona request config.
   */
  (config: IUseCertonaRequestConfig): CertonaCallback
}

const useCertonaRequest: IUseCertonaRequestHook = (config) => {
  const {
    enabled = true,
    onRequest,
    onResponse,
    pagetype,
    itemid,
    dependencies,
    categoryID = '',
    filter = {},
    ...options
  } = config
  const { viewport: devicetype } = useViewportType()
  const { defaultLocale, locale } = useIntl()
  const { session } = useContext(SessionContext)
  const [language = 'en', country = 'US'] = locale?.split('-') || defaultLocale?.split('-') || []
  const canMakeRequest = useAtomValue(certonaScriptLoadedAtom) && enabled
  const customerid = get(session, 'user.userEmail', '')

  const {
    certonaConfiguration: { certonaSubDomain },
  } = usePreference({
    CertonaConfiguration: ['certonaSubDomain'],
  })

  const environmentOptions = certonaSubDomain?.toLowerCase() === 'qa' ? { environment: 'qa' } : null

  const certonaEntranceSource = useMemo(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search)
      const utmMediumCode = queryParams.get('utm_medium')
      const gclId = queryParams.get('gclid')
      const fbclid = queryParams.get('fbclid')

      if (utmMediumCode) return utmMediumCode
      if (fbclid) return 'social'
      if (gclId) return 'gclId'
    }

    return 'direct'
  }, [])

  return useCallback<CertonaCallback>(
    (argumentOptions) => {
      if (canMakeRequest) {
        const requestConfig = omitBy(
          {
            pagetype,
            devicetype,
            country,
            itemid,
            customerid,
            filter: {
              language,
              allcategories: categoryID,
              entrancesource: certonaEntranceSource,
              ...filter,
            },
            ...environmentOptions,
            ...options,
            ...argumentOptions,
          },
          isNil
        ) as CertonaRequestOptions

        onRequest?.()
        createCertonaRequest(requestConfig).then(onResponse)
      }
    },
    [
      canMakeRequest,
      pagetype,
      itemid,
      devicetype,
      language,
      country,
      customerid,
      certonaEntranceSource,
      ...(Array.isArray(dependencies) ? dependencies : []),
    ]
  )
}

export const useCertonaOnMount = (config: IUseCertonaRequestConfig): void => {
  const certonaCallback = useCertonaRequest(config)
  useEffect(() => {
    certonaCallback()
  }, [certonaCallback])
}

export default useCertonaRequest
