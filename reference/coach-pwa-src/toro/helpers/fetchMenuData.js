import { API_GET_MENU_DATA } from 'toro/constants/Urls'
import serialize from 'toro/helpers/serialize'
import { isSubBrandRoute } from 'helpers/subBrand'
import { getSitePreviewConfigFromReq } from 'toro/helpers/sitePreview'
import getSourceCodeParam from 'toro/helpers/getSourceCodeParam'
import { fetchFromServerSideWithCorrId } from 'helpers/fetchFromServerSide'
import fetchPreferences from 'toro/helpers/fetchPreferences'
import get from 'lodash/get'

export default async function fetchMenuData(req) {
  const sitePreviewConfig = getSitePreviewConfigFromReq(req)
  const src = getSourceCodeParam(req)
  const oneCoachNAPreferences = await fetchPreferences({
    req,
    groupId: 'OneSite',
    ids: ['enableOneSite'],
    grouped: true,
  })
  const isOneCoachNAEnabled = get(oneCoachNAPreferences, 'OneSite.enableOneSite', false)

  return fetchFromServerSideWithCorrId(
    req,
    API_GET_MENU_DATA +
      serialize({
        isSubBrand: (!isOneCoachNAEnabled && isSubBrandRoute(req)) || undefined,
        // We need these params to be sure that request will be fetched from API
        // if we have preview configs or src, so the data won't be taken from cache like for simple request
        // The locale param will be added to the query in the method above -> getInternalApiUrl
        ...(sitePreviewConfig || {}),
        src,
      }),
    {
      headers: {
        cookie: req.headers.cookie,
      },
    }
  ).then((res) => res.json())
}
