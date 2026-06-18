import { useContext, useEffect } from 'react'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import {
  CertonaRequestOptions,
  CertonaScheme,
  setCertonaSchemesAtom,
  setCertonaScriptLoadedAtom,
} from 'store/certona-schemes.atoms'
import { useAtomSetter } from 'toro/helpers/jotai/useAtomSetter'
import insertScript from 'toro/helpers/scriptLoader'
import PWAContext from 'components/common/PWAContext'

export interface WindowWithCertona extends Window {
  certona?: CertonaRequestOptions
  callCertona?: (options: CertonaRequestOptions, ...args: any) => Promise<CertonaScheme[]>
  certonaRecommendations?: (data: CertonaResponseData) => void
}

declare const window: WindowWithCertona

export type CertonaResponseData = { resonance: { schemes: CertonaScheme[] } }

let requestPromise: Promise<CertonaScheme[]>
let promiseResolver: (value: CertonaScheme[]) => void

const withRequestPromise =
  (callback) =>
  async (options: CertonaRequestOptions, ...args) => {
    if (Boolean(requestPromise)) {
      await requestPromise
    }

    if (!isEqual(options, window.certona) || options?.force) {
      if (options?.recommendations) {
        requestPromise = new Promise<CertonaScheme[]>((resolve) => {
          promiseResolver = resolve
        })
      }
      window.certona = options
      callback(...args)
    }
    return await requestPromise
  }

const CertonaManager: React.FunctionComponent<void> = () => {
  const { appData } = useContext(PWAContext)
  const setCertonaScriptLoaded = useAtomSetter(setCertonaScriptLoadedAtom)
  const setCertonaSchemes = useAtomSetter(setCertonaSchemesAtom)

  const handleCertonaCallback = () => {
    window.callCertona = withRequestPromise(window.callCertona)
    window.certonaRecommendations = (data) => {
      setCertonaSchemes(data?.resonance?.schemes)
      promiseResolver?.(data?.resonance?.schemes)
    }
    setCertonaScriptLoaded()
  }

  useEffect(() => {
    const isCertonaEnabled = get(appData, 'isCertonaEnabled') === 'true'
    const certonaScript = get(appData, 'certonaScriptPath', '')

    if (isCertonaEnabled && Boolean(certonaScript)) {
      insertScript(certonaScript, { onLoad: handleCertonaCallback, defer: true })
    }
  }, [])

  return null
}

export default CertonaManager
