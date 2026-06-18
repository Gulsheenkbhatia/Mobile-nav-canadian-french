import { useEffect } from 'react'
import { useUpdateAtom } from 'jotai/utils'
import { xgenChannelAtom } from 'store/xgen-channel.atom'

export function useSyncUtmMediumFromUrl(): void {
  const setXgenChannel = useUpdateAtom(xgenChannelAtom)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const utmMedium = params.get('utm_medium')
    const fbclid = params.get('fbclid')
    const gclid = params.get('gclid')

    if (utmMedium) {
      setXgenChannel(utmMedium)
    } else if (fbclid) {
      setXgenChannel('paid_soc')
    } else if (gclid) {
      setXgenChannel('gclid')
    }
  }, [])
}
