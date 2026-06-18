import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import { useContext } from 'react'

const useLocaleUrl = (url: string | string[]): string | string[] => {
  const { appData } = useContext(PWAContext)
  const locale = get(appData, 'localeInPath', '')
  const addLocale = (url: string) => (locale ? `/${locale}${url}` : url)

  return Array.isArray(url) ? url.map(addLocale) : addLocale(url)
}

export default useLocaleUrl
