import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useCertonaScheme from 'toro/hooks/useCertonaScheme'
import useCertonaRequest from 'toro/hooks/useCertonaRequest'
import { clearSchemeInCertonaAtom, CertonaScheme } from 'store/certona-schemes.atoms'
import { mostViewedProductAtom } from 'store/because-you-viewed-products.atom'
import { useUpdateAtom, useAtomValue } from 'jotai/utils'
import get from 'lodash/get'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'

interface IUseMinicartCertonaHook {
  (variantId?: string): CertonaScheme | undefined
}

const useMinicartCertona: IUseMinicartCertonaHook = (variantId) => {
  const router = useRouter()
  const clearScheme = useUpdateAtom(clearSchemeInCertonaAtom)
  const { recommendations: isXgenExperience } = useAtomValue(xgenFeaturesAtom)
  const mostViewedProduct = useAtomValue(mostViewedProductAtom)
  const isPLP = get(router, 'pathname', '').includes('/shop')
  const isPDP = get(router, 'pathname', '').includes('/product')

  const becauseYouViewedPLP = useExperiment(
    `${EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP}-${EXPERIMENTS.BECAUSE_YOU_VIEWED_PLP_VARIANT_2}`
  )
  const becauseYouViewedPDP = useExperiment(EXPERIMENTS.BECAUSE_YOU_VIEWED_PDP)

  const isBecauseYouViewedEnabled = (isPLP && becauseYouViewedPLP) || (isPDP && becauseYouViewedPDP)

  const fetchSiteVisit = useCertonaRequest({
    pagetype: 'sitevisit',
    itemid: mostViewedProduct?.count > 1 ? mostViewedProduct?.vgId : undefined,
    force: true,
    enabled: isBecauseYouViewedEnabled,
    recommendations: true,
  })

  const ymalScheme = useCertonaScheme('addtobag_rr', {
    pagetype: 'addtocart',
    recommendations: true,
    itemid: variantId,
    enabled: !isXgenExperience,
    onResponse: () => fetchSiteVisit(),
    force: true,
  })

  useEffect(
    () => () => {
      clearScheme('addtobag_rr')
    },
    []
  )

  return ymalScheme as CertonaScheme
}

export default useMinicartCertona
