import { useUpdateAtom } from 'jotai/utils'
import { setSelectedColorAtom } from 'store/pdp.atom'

/**
 * A custom hook to streamline color selection
 * and avoid the need to always import the atom and useUpdateAtom.
 *
 * @returns {Function} - A function to update selected color.
 *
 * @remarks
 * This hook uses `useUpdateAtom` from `jotai/utils` to update the state of `setSelectedColorAtom`.
 */
const useSelectColor = () => {
  return useUpdateAtom(setSelectedColorAtom)
}

export default useSelectColor
