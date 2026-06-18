import React from 'react'
import { useAtom } from 'jotai'
import { fullscreenLoadingAtom } from 'store/fullscreen-loading.atom'
import dynamic from 'next/dynamic'

const LoadingWithBackdrop = dynamic(() => import('toro/components/LoadingWithBackdrop'), {
  ssr: false,
})

const FullscreenLoading = () => {
  const [visible] = useAtom(fullscreenLoadingAtom)
  if (!visible) {
    return null
  }

  return <LoadingWithBackdrop />
}

export default FullscreenLoading
