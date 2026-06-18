import { memo, useEffect, useRef, useState } from 'react'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import dynamic from 'next/dynamic'
import {
  CertonaPageType,
  CertonaScheme,
  CertonaSchemeType,
  clearSchemeInCertonaAtom,
  certonaScriptLoadedAtom,
} from 'store/certona-schemes.atoms'
import usePreferenceNew from 'toro/hooks/usePreference_new'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { aeDrawerConfigAtom } from 'store/ae-drawer.atom'
import { SystemStyleObject } from '@chakra-ui/react'
import get from 'lodash/get'
import WhoopsMessage from 'toro/components/AEDrawer/WhoopsMessage'

const CertonaRecommendation = dynamic(() => import('toro/components/Certona/Recommendation'), {
  ssr: false,
})

type AECertonaRecommendationsProps = {
  closeOnItemClick: () => void
  isPDP: boolean
  variant: 'aeDrawerGrid' | 'aeDrawer'
  styles: Record<string, SystemStyleObject | any>
}

function AECertonaRecommendations({
  closeOnItemClick,
  isPDP,
  variant,
  styles,
}: AECertonaRecommendationsProps) {
  const [isCertonaLoaded, setIsCertonaLoaded] = useState(false)
  const aeDrawerConfig = useAtomValue(aeDrawerConfigAtom)
  const clearScheme = useUpdateAtom(clearSchemeInCertonaAtom)
  const isCertonaScriptLoaded = useAtomValue(certonaScriptLoadedAtom)
  const productData = aeDrawerConfig.activeProduct
  const { itemId } = productData
  const shouldClearSchemeData = useRef(aeDrawerConfig.shouldClearSchemeData ?? true)

  const {
    adaptiveExperience: { enableAEDrawerExp },
    recommendations: { hideRecommendationPrice },
  } = usePreferenceNew({
    adaptiveExperience: ['enableAEDrawerExp'],
    recommendations: ['hideRecommendationPrice'],
  })
  const pageType = isPDP ? 'PDP' : 'PLP'
  const isProductTitleEnabled = get(enableAEDrawerExp, `${pageType}.displayProductName`, false)

  const recommenders = aeDrawerConfig?.recommenders?.length
    ? aeDrawerConfig.recommenders
    : get(enableAEDrawerExp, `${pageType}.recommenders`, [])

  const certonaSchemes = useCertonaScheme(recommenders as unknown as CertonaSchemeType, {
    pagetype: (isPDP ? 'product' : 'productlisting') as CertonaPageType,
    itemid: itemId,
    exitemid: itemId,
    enabled: !!itemId,
    force: aeDrawerConfig.showDrawer,
    onResponse: () => setIsCertonaLoaded(true),
  }) as CertonaScheme[]

  useEffect(() => {
    if (!aeDrawerConfig.showDrawer && shouldClearSchemeData.current) {
      recommenders.forEach((scheme) => clearScheme(scheme))
    }
  }, [aeDrawerConfig.showDrawer])

  const certonaSchemesFiltered = isCertonaLoaded
    ? certonaSchemes?.filter(
        (scheme) => !!scheme?.items?.length && scheme?.display?.toLowerCase() === 'yes'
      )
    : []

  if ((isCertonaLoaded && !certonaSchemesFiltered.length) || !isCertonaScriptLoaded) {
    return <WhoopsMessage closeAeDrawer={closeOnItemClick} />
  }

  return (
    <>
      {certonaSchemesFiltered.map((certonaScheme) => (
        <div id={certonaScheme?.scheme} className="certona_wrapper" key={certonaScheme?.scheme}>
          <CertonaRecommendation
            certonaData={certonaScheme}
            hidePrice={hideRecommendationPrice}
            label={certonaScheme?.explanation}
            variant={variant}
            onItemClick={closeOnItemClick}
            impressionName={`certonaViewItemList${certonaScheme?.scheme}`}
            hideProductName={!isProductTitleEnabled}
          />
        </div>
      ))}
    </>
  )
}

export default memo(AECertonaRecommendations)
