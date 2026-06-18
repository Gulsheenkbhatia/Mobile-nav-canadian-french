import { useState, useEffect } from 'react'

const collapseOtherAccordionButtons = (
  currentAccordionButton: HTMLElement | null,
  currentAccordion: HTMLElement | null
) => {
  const parentAccordion = currentAccordionButton?.closest('.accordion')
  const expandedAccordionButton = parentAccordion?.querySelector(
    '.card-header__button:not(.collapsed)'
  )

  if (expandedAccordionButton) {
    const targetId = expandedAccordionButton?.getAttribute('data-target')
    const expandedContent = currentAccordion?.querySelector(targetId)
    expandedAccordionButton?.classList.add('collapsed')
    expandedAccordionButton?.setAttribute('aria-expanded', 'false')
    expandedContent?.classList.add('collapse')
    expandedContent.setAttribute('style', 'height:0')
  }
}

export const toggleAccordion = (e) => {
  e.preventDefault()
  const currentAccordionButton = e.target?.closest('.card-header__button')
  const currentAccordion = currentAccordionButton?.closest('.accordion')
  const isExpanded = currentAccordionButton?.getAttribute('aria-expanded')
  const currentTargetId = currentAccordionButton?.getAttribute('data-target')
  const targetContentBlock = currentAccordion?.querySelector(currentTargetId || '')
  // Close any other open accordion
  collapseOtherAccordionButtons(currentAccordionButton, currentAccordion)
  // Toggle the collapse class on the corresponding collapse contents
  if (isExpanded === 'false') {
    currentAccordionButton?.classList.toggle('collapsed')
    targetContentBlock?.classList.toggle('collapse')
  }
  //Toggle the height style on the corresponding collapse contents
  targetContentBlock.setAttribute(
    'style',
    `height: ${
      targetContentBlock?.classList.contains('collapse')
        ? '0'
        : targetContentBlock.scrollHeight + 'px'
    }`
  )
  currentAccordionButton?.setAttribute('aria-expanded', isExpanded === 'true' ? 'false' : 'true')
}

export const initializeAccordionEventListeners = (node: ParentNode | null) => {
  if (!node) {
    return
  }
  const accordionButtons = node.querySelectorAll('.accordion .card-header__button')
  if (!accordionButtons.length) {
    return
  }
  accordionButtons?.forEach((accordionButton) => {
    accordionButton?.addEventListener('click', toggleAccordion)
  })
  const cleanupAccordionEvents = () => {
    accordionButtons?.forEach((accordionButton) => {
      accordionButton?.removeEventListener('click', toggleAccordion)
    })
  }
  return cleanupAccordionEvents
}

export const useAccordionBlock = (): ((node: ParentNode) => void) => {
  const [node, setNode] = useState<ParentNode>(null)
  useEffect(() => {
    const cleanupAccordionEvents = initializeAccordionEventListeners(node)
    return () => {
      cleanupAccordionEvents?.()
    }
  }, [node])
  return setNode
}
