import { ReactPortal, useRef, useState } from 'react'
import getAddToBagButtons from 'toro/helpers/getAddToBagButtons'

function useHydrateAddToBagButtons() {
  const [addToBagButtons, setAddToBagButtons] = useState<ReactPortal[]>([])
  const hasHydratedRef = useRef(false)

  const hydrateAddToBagButtons = (node: HTMLElement | null) => {
    if (!node || hasHydratedRef.current) return
    const buttons = getAddToBagButtons(node)
    if (!buttons.length) return
    hasHydratedRef.current = true
    setAddToBagButtons(buttons)
  }
  return { addToBagButtons, hydrateAddToBagButtons }
}

export default useHydrateAddToBagButtons
