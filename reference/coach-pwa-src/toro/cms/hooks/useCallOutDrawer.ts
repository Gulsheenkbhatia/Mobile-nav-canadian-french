import { useMemo, useCallback } from 'react'
import { useAtomValue } from 'jotai/utils'
import { productDataAtom, isQuickViewAtom } from 'store/pdp.atom'
import get from 'lodash/get'
import { PromoCallout } from 'toro/components/product/CallOutMessage/types'
import useAEDrawer from 'toro/hooks/useAEDrawer'
import isBrowser from 'toro/helpers/isBrowser'

/* 
  Used for the Adaptable Experience Certona recommender drawer on PDP with promo callouts.
  
  Returns the atom setter function for the drawer config if everything for the drawer that is
  required is enabled/configured and the specific promo callout HTML from the CMS has a
  data-drawer-scheme attribute configured.
*/

const getDrawerScheme = (promo: PromoCallout) =>
  get(promo, '[call-out-message].content.drawerScheme')

const getPDPRecommenders = (
  drawerScheme: { PDP: { recommenders: string[] } },
  isQuickView: boolean
) => (isQuickView ? [] : get(drawerScheme, 'PDP.recommenders', []))

const useCallOutDrawer = (
  promos: PromoCallout[]
): ((e: React.MouseEvent<HTMLInputElement>) => void)[] => {
  const setAEDrawerConfig = useAEDrawer()
  const isQuickView = useAtomValue(isQuickViewAtom)
  const productData = useAtomValue(productDataAtom)
  const clientSide = isBrowser()

  const handleDrawerConfig = useCallback(
    (promo: PromoCallout, e: React.MouseEvent<HTMLInputElement>) => {
      const drawerScheme = getDrawerScheme(promo)

      if (setAEDrawerConfig && drawerScheme) {
        e?.preventDefault?.() // prevent default onClick behavior
        const recommenders = getPDPRecommenders(drawerScheme, isQuickView)

        setAEDrawerConfig({
          showDrawer: true,
          activeProduct: productData,
          recommenders,
          eventLocation: 'promotions',
        })
      }
    },
    [setAEDrawerConfig, isQuickView, productData]
  )

  return useMemo(() => {
    return promos.map((promo) => (clientSide ? (e) => handleDrawerConfig(promo, e) : undefined))
  }, [promos, clientSide, handleDrawerConfig])
}

export default useCallOutDrawer
