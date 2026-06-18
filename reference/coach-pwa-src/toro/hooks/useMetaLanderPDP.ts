import { useEffect } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import { useUpdateAtom } from 'jotai/utils'
import { activeTabIndexAtom } from 'store/pdp.atom'
import { CertonaScheme } from 'store/certona-schemes.atoms'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import useMetaLander from 'toro/hooks/useMetaLander'

export const META_LANDER_CERTONA_SCHEME_ID = 'sitewide1_rr'

function useMetaLanderPDP() {
  const setActiveTabIndex = useUpdateAtom(activeTabIndexAtom)

  const {
    toggleSiteFeatures: { fbMetaPDP },
  } = usePreference({
    ToggleSiteFeatures: ['fbMetaPDP'],
  })

  const metaProducts = useMetaLander(!fbMetaPDP)

  const certonaScheme = useCertonaScheme(META_LANDER_CERTONA_SCHEME_ID, {
    pagetype: 'sitewide',
    itemid: metaProducts?.productIds,
    force: true,
    enabled: metaProducts.isMetaTest,
  }) as CertonaScheme

  const isCertonaSchemeAvailable = certonaScheme?.display?.toLowerCase() !== 'no'

  useEffect(() => {
    if (fbMetaPDP && metaProducts.enabled && isCertonaSchemeAvailable) {
      setActiveTabIndex(2)
    }
  }, [fbMetaPDP, metaProducts, isCertonaSchemeAvailable])

  return certonaScheme
}

export default useMetaLanderPDP
