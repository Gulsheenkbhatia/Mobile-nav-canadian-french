import { useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import {
  SHOPPING_GIVES_STORE_ID,
  SHOPPING_GIVES_URL,
  SHOPPING_GIVES_IS_ENABLED,
  SHOPPING_GIVES_GROUP_ID,
} from 'toro/site-preferences'
import usePreference from 'toro/hooks/usePreference'
import { setSgloaderScriptLoadedAtom, isSgloaderScriptLoadedAtom } from 'store/scripts.atom'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'
import { useAtomValue } from 'jotai/utils'
import Script from 'next/script'

const InjectSgloaderScript = () => {
  const { appData } = useContext(PWAContext)
  const { siteId, shoppingGivesIsTest } = appData || {}
  const setSgloaderScriptLoaded = useAtomSetter(setSgloaderScriptLoadedAtom)
  const isSgloaderScriptLoaded = useAtomValue(isSgloaderScriptLoadedAtom)
  const shoppingGivesBMIsEnabled = usePreference({
    groupId: SHOPPING_GIVES_GROUP_ID,
    preferenceId: SHOPPING_GIVES_IS_ENABLED,
    siteId,
    defaultValue: false,
  })
  const shoppingGivesStoreId = usePreference({
    groupId: SHOPPING_GIVES_GROUP_ID,
    preferenceId: SHOPPING_GIVES_STORE_ID,
    siteId,
  })
  const shoppingGivesUrl = usePreference({
    groupId: SHOPPING_GIVES_GROUP_ID,
    preferenceId: SHOPPING_GIVES_URL,
    siteId,
  })

  if (!shoppingGivesBMIsEnabled || !shoppingGivesUrl || !shoppingGivesStoreId) {
    return null
  }

  return (
    <Script
      strategy="afterInteractive"
      src={`${shoppingGivesUrl}?sid=${shoppingGivesStoreId}&test-mode=${shoppingGivesIsTest}`}
      onLoad={() => {
        if (isSgloaderScriptLoaded) {
          return
        }
        setSgloaderScriptLoaded(true)
      }}
      onError={(error) => {
        console.error('Shopping Gives Script Loading Error', error)
        setSgloaderScriptLoaded(false)
      }}
    />
  )
}

export default InjectSgloaderScript
