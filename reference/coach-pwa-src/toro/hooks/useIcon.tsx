import { useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { addIconsAtom } from 'store/icons.atom'

/**
 * A hook which accepts icon id(s) as an argument and
 * stores it to be rendered by icon container.
 * @param id - icon id(s)
 */

const useIcon = (id: IconId | IconId[]) => {
  const addIconIds = useUpdateAtom(addIconsAtom)
  const addedIconsString = Array.isArray(id) ? id.sort().join() : id

  useEffect(() => {
    addIconIds(id)
  }, [addedIconsString])
}

export default useIcon
