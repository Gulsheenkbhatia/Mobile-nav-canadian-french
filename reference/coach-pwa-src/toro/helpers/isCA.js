import { useContext } from 'react'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'

const useIsCA = () => {
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')
  return siteId?.includes('ca')
}

export default useIsCA
