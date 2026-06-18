import { useSafeLayoutEffect } from '@chakra-ui/react'
import Head from 'next/head'
import React, { FunctionComponent, useEffect, useRef } from 'react'
import isLowPoweredDevice from 'toro/helpers/isLowPoweredDevice'
import useToroEventsDispatch, { type DispatchToroEvent } from 'toro/hooks/useToroEventDispatch'

type Props = {
  deviceType: 'desktop' | 'smartphone' | 'mobile' | 'tablet'
  enableLowPoweredDevice: boolean
}

type ExtendedWindow = Window &
  typeof globalThis & {
    dispatchToroEvent: DispatchToroEvent
    dispatchRemoveCalloutSlide: (index: number) => void
  }

export function insertOptimizelyScript(
  window: Window & {
    isLowPoweredDevice: (deviceType: any) => boolean
  },
  document: Document,
  deviceType: Pick<Props, 'deviceType'>
) {
  if (typeof window === undefined || typeof navigator === undefined) {
    return
  }
  if (window.isLowPoweredDevice(deviceType)) {
    return
  }
  const script = document.createElement('script')
  script.src = '/api/optimizely-script'
  script.type = 'text/javascript'
  script.referrerPolicy = 'no-referrer-when-downgrade'
  document.head.appendChild(script)
}

const OptimizelyScript: FunctionComponent<Props> = ({ deviceType, enableLowPoweredDevice }) => {
  const injectScriptRef = useRef()
  const __html = `
    ${isLowPoweredDevice.toString()}
    (${insertOptimizelyScript.toString()})(window, document, "${deviceType}");
    `

  const dispatch = useToroEventsDispatch()

  useSafeLayoutEffect(() => {
    ;(window as ExtendedWindow).dispatchToroEvent = dispatch
    ;(window as ExtendedWindow).dispatchRemoveCalloutSlide = (index: number) =>
      dispatch({ type: 'on-remove-callout-slide', index })
  }, [dispatch])

  useEffect(() => {
    if (injectScriptRef.current) {
      ;(injectScriptRef.current as HTMLElement).remove()
    }
  }, [])

  return deviceType === 'desktop' || !enableLowPoweredDevice ? (
    <Head>
      <script
        src="/api/optimizely-script"
        referrerPolicy="no-referrer-when-downgrade"
        key="optimizely-script"
        type="text/javascript"
      />
    </Head>
  ) : (
    <script
      ref={injectScriptRef}
      key="optimizely-script-injector"
      dangerouslySetInnerHTML={{
        __html,
      }}
    />
  )
}

export default OptimizelyScript
