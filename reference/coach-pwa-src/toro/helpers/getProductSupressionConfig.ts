import type { SitePreviewConfig } from 'toro/helpers/sitePreview'
import Cookies from 'js-cookie'
import {
  EARLY_ACCESS,
  EMPLOYEE_SALE,
  IS_EARLY_ACCESS,
  IS_EMPLOYEE_SALE,
} from 'toro/constants/sourceCodes'
import { PWA_SOURCECODE, COOKIE_SITE_PREVIEW } from 'toro/constants/cookies'

const getProductSupressionConfig = (
  sourceCodeParam: string,
  sitePreviewConfig?: SitePreviewConfig
) => {
  const { 'source-code': sourceCode } = sitePreviewConfig ||
    Cookies.getJSON(COOKIE_SITE_PREVIEW) || {
      'source-code': sourceCodeParam || Cookies.get(PWA_SOURCECODE),
    }
  return {
    [EMPLOYEE_SALE]: [EMPLOYEE_SALE, IS_EMPLOYEE_SALE].includes(sourceCode),
    [EARLY_ACCESS]: [EARLY_ACCESS, IS_EARLY_ACCESS].includes(sourceCode),
  }
}

export default getProductSupressionConfig
