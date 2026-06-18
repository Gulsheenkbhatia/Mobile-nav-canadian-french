import { CertonaScheme, CertonaSchemeType } from 'store/certona-schemes.atoms'
import { IUseCertonaRequestConfig, useCertonaOnMount } from 'toro/hooks/useCertonaRequest'
import useSelectCertonaItems from 'toro/hooks/useSelectCertonaItems'

interface IUseCertonaSchemeHook {
  /**
   * Gets specified Certona scheme type/types if it already exists in `resonance.schemes`, otherwise queues a request to retrieve specified schemes
   * @param {CertonaSchemeType | CertonaSchemeType[]} type Certona scheme type or an array of scheme types.
   * @param {IUseCertonaRequestConfig} config Certona request configuration object.
   * @returns {CertonaScheme | undefined} Returns requested scheme or an array of schemes.
   */
  (type: CertonaSchemeType | CertonaSchemeType[], config?: IUseCertonaRequestConfig):
    | CertonaScheme
    | CertonaScheme[]
    | undefined
    | undefined[]
}

const useCertonaScheme: IUseCertonaSchemeHook = (type, config) => {
  const { enabled = true, ...rest } = config
  const value = useSelectCertonaItems(type)

  useCertonaOnMount({
    recommendations: true,
    enabled: enabled || Boolean(rest.itemid),
    ...rest,
  })

  return value
}

export default useCertonaScheme
