import { useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'

const useIsSW = () => {
  const { appData } = useContext(PWAContext)
  const brand = get(appData, 'brand', '')
  return brand === 'stuart-weitzman'
}

export default useIsSW
