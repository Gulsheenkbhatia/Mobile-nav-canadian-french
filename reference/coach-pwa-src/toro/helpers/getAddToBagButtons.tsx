import { ReactPortal } from 'react'
import { createPortal } from 'react-dom'
import {
  ATB_DISABLED_CLASS,
  CLONE_SLIDE_CLASS,
  DATA_ATB_SELECTOR,
  PRODUCT_TILE_SELECTOR,
  RENDERED_ATB_CLASS,
  SERVER_PORTAL_SELECTOR,
} from 'toro/cms/constants'
import CmsAddToBagButton from 'toro/components/CmsAddToBagButton'

function getAddToBagButtons(node: HTMLElement): ReactPortal[] {
  const addToBagButtonArray: ReactPortal[] = []

  const amplienceATBDivs = node.querySelectorAll(DATA_ATB_SELECTOR) as NodeListOf<HTMLDivElement>
  amplienceATBDivs.forEach((div) => {
    const renderedPwaButton = div.querySelector(`.${RENDERED_ATB_CLASS}`)
    const hasButtonRendered = !!renderedPwaButton
    const isCloneSlide = div.closest(CLONE_SLIDE_CLASS)
    const productId = div.getAttribute('data-atb-pid')?.replaceAll('-', ' ')
    const disabledATB = div.classList.contains(ATB_DISABLED_CLASS)
    div.querySelector(SERVER_PORTAL_SELECTOR)?.remove()

    const tileContainer = div.closest(PRODUCT_TILE_SELECTOR) as HTMLDivElement

    if (isCloneSlide) {
      renderedPwaButton?.remove()
    }

    if (productId && (!hasButtonRendered || isCloneSlide)) {
      addToBagButtonArray.push(
        createPortal(
          <CmsAddToBagButton
            key={productId}
            productId={productId}
            tileContainer={tileContainer}
            atbButton={div}
            disabled={disabledATB}
          />,
          div
        )
      )
    }
  })

  return addToBagButtonArray
}
export default getAddToBagButtons
