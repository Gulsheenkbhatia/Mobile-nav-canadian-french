import { useCallback } from 'react'
import get from 'lodash/get'
import { selectAtom, useAtomValue } from 'jotai/utils'
import { Atom, Scope } from 'jotai/core/atom'

const createUseSelectData =
  (atom: Atom<any>, scope?: Scope) =>
  (path: string | string[]): any => {
    const pathDep = Array.isArray(path) ? path.join(':') : path
    const selector = useCallback(
      (productData) => {
        if (Array.isArray(path)) {
          return path.map((property) => get(productData, property))
        }
        return get(productData, path)
      },
      [pathDep]
    )
    return useAtomValue(selectAtom(atom, selector), scope)
  }

export default createUseSelectData
