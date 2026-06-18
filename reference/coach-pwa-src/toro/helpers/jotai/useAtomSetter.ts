import { WritableAtom, useAtom } from 'jotai'
import { Scope, SetAtom } from 'jotai/core/atom'

/**
 * Custom Jotai hook that returns a Jotai setter for a derived writeable atom.
 *
 * Currently Jotai doesn't provide a helper function to return only the setter for a derived
 * atom, it only provides a helper to retrieve the atom value through 'useAtomValue'.
 * The 'useUpdateAtom' hook is supposed to be used for primitive atoms only.
 *
 * @param anAtom {WritableAtom} Jotai writable atom.
 * @param scope {Scope} Jotai scope.
 * @returns {SetAtom} Jotai setter for the writeable atom.
 */
export const useAtomSetter = <Value, Update, Result extends void | Promise<void>>(
  anAtom: WritableAtom<Value, Update, Result>,
  scope?: Scope
): SetAtom<Update, Result> => {
  return useAtom(anAtom, scope)[1]
}
