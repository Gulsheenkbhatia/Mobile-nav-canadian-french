import getAPIURL from 'helpers/getAPIURL'
import withCorrId from 'helpers/traceability'
import { getToken } from 'toro/lib/shopper-login/helpers/token'

interface FetchActiveProductParams {
  id: string
  masterId: string
  activeColorId?: string
  locale?: string
  signal?: AbortSignal
}

export async function fetchActiveProductData({
  id: idParam,
  activeColorId: acIdParam,
  masterId: mIdParam,
  locale,
  signal,
}: FetchActiveProductParams) {
  try {
    const fetchWithCorrId = withCorrId()
    const [id, masterId, activeColorId] = [idParam, mIdParam, acIdParam].map((id) => {
      if (id && /%2F|\//.test(id)) {
        return encodeURIComponent(id)
      }
      return id
    })
    const urlToFetch = activeColorId
      ? `/get-active-product/${encodeURIComponent(id)}/${encodeURIComponent(
          masterId
        )}/${encodeURIComponent(activeColorId)}`
      : `/get-active-product/${encodeURIComponent(id)}/${encodeURIComponent(masterId)}`

    const requestUrl = getAPIURL(`${locale ? `/${locale}` : ''}${urlToFetch}`)

    if (!requestUrl || requestUrl.includes('undefined')) {
      return null
    }

    const { token } = await getToken()
    const requestOptions: RequestInit = {
      credentials: 'include',
      signal,
      headers: {
        'Ccapi-Authorization': token,
      },
    }

    const data = await fetchWithCorrId(requestUrl, requestOptions).then((res: any) => res.json())

    return data
  } catch (e) {
    console.error('[fetchActiveProductData]', e)
    return null
  }
}
