import { useEffect } from 'react'
import { useUpdateAtom, useAtomValue, useResetAtom } from 'jotai/utils'
import { metaProductsAtom, setMetaProductsAtom } from 'store/pdp.atom'

const useMetaLander = (disabled = false) => {
  const metaProducts = useAtomValue(metaProductsAtom)
  const resetMetaProducts = useResetAtom(metaProductsAtom)
  const setMetaProducts = useUpdateAtom(setMetaProductsAtom)

  useEffect(() => {
    if (disabled) return

    const queryParams = new URLSearchParams(window?.location.search)
    const clickedProductId = queryParams.get('clicked_product_id') ?? ''
    const productIds = queryParams.get('shown_product_ids') ?? ''
    const utmSource = queryParams.get('utm_source')
    const utmMedium = queryParams.get('utm_medium')
    const isFromMeta = utmSource === 'facebook.com-instagram.com' && utmMedium === 'paid_soc'

    setMetaProducts({
      clickedProductId,
      productIds,
      isFromMeta,
    })

    return () => {
      resetMetaProducts()
    }
  }, [disabled])

  return metaProducts
}

export default useMetaLander
