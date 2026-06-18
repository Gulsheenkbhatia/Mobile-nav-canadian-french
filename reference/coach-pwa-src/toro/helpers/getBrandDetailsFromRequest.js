import getLocaleFromReq from 'helpers/getLocaleFromReq'
import getEnvVariables from 'toro/helpers/getEnvVariables'
import { isSubBrandLink } from 'helpers/subBrand'

const getBrandDetailsFromRequest = (req, includeLocale = false) => {
  const locale = getLocaleFromReq(req)
  const { subBrand: subBrandName } = getEnvVariables()

  const isSubBrand =
    Boolean(subBrandName) &&
    (isSubBrandLink(req.url ?? '', subBrandName) ||
      isSubBrandLink(req.headers?.referer ?? '', subBrandName))

  const data = {
    isSubBrand,
    subBrandName,
  }

  if (includeLocale) {
    data.locale = locale
  }

  return data
}

export default getBrandDetailsFromRequest
