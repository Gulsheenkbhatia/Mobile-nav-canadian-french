import React, { useEffect, useRef } from 'react'
import LinkContext from 'components/LinkContext'
import Router from 'next/router'
import useToroEventsDispatch from 'toro/hooks/useToroEventDispatch'
import { useUpdateAtom } from 'jotai/utils'
import { setNewProductDataAtom } from 'store/pdp.atom'
import isEmpty from 'lodash/isEmpty'
/**
 * Provides a context that allows links to pass data directly to pages via the `pageData` prop.
 */
export default function LinkContextProvider({ children }) {
  const linkPageData = useRef(null)
  const dispatchToroEvent = useToroEventsDispatch()
  const populateProductData = useUpdateAtom(setNewProductDataAtom)

  useEffect(() => {
    const onRouteChangeComplete = () => {
      linkPageData.current = undefined
      dispatchToroEvent({ type: 'on-route-change', initial: false })
    }
    const onRouteChangeStart = (url) => {
      const isPdp = url.includes('products')
      const isNamePresent = !isEmpty(linkPageData?.current?.name)
      if (isPdp && isNamePresent) {
        populateProductData(linkPageData.current)
      }
    }
    Router.events.on('routeChangeStart', onRouteChangeStart)
    Router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart)
      Router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])

  return <LinkContext.Provider value={linkPageData}>{children}</LinkContext.Provider>
}
