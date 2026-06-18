import { useCallback } from 'react'
import isEqual from 'lodash/isEqual'
import { selectAtom, useAtomValue } from 'jotai/utils'
import certonaSchemesAtom, { CertonaScheme, CertonaSchemeType } from 'store/certona-schemes.atoms'

interface IUseSelectCertonaItems {
  (type: CertonaSchemeType | CertonaSchemeType[]):
    | CertonaScheme
    | CertonaScheme[]
    | undefined
    | undefined[]
}

export const getMatchingScheme =
  (type: CertonaSchemeType | CertonaSchemeType[]) => (schemes: CertonaScheme[]) => {
    if (Array.isArray(type)) {
      return type.map((item) => getMatchingScheme(item)(schemes))
    }
    return schemes?.find((item) => item.scheme === type)
  }

const useSelectCertonaItems: IUseSelectCertonaItems = (type) => {
  const matchingSchemeCallback = useCallback(getMatchingScheme(type), [])
  return useAtomValue(selectAtom(certonaSchemesAtom, matchingSchemeCallback, isEqual))
}

export default useSelectCertonaItems
