import { useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import usePreference from 'toro/hooks/usePreference'

const useIsKS = () => {
  const { appData } = useContext(PWAContext)
  const brand = get(appData, 'brand', '')
  const siteIdentifier = usePreference({
    groupId: 'generalConfiguration',
    preferenceId: 'siteIdentifier',
  })
  const siteIdentifierValue = get(siteIdentifier, 'value', '')
  const isKsSur = siteIdentifierValue === 'ksna-surprise'
  const isKateSpade = brand === 'kate-spade' || isKsSur

  return isKateSpade
}

export default useIsKS
