import { useState, useEffect } from 'react'

export const togglePlpContentBlock = (e) => {
  const currentContext = e.target.closest('.toggleContentBlock')
  const collapseBlock = currentContext.closest('.mol-plp-block').querySelector('.collapse')
  const showMoreText = currentContext.querySelector('span.plp-block-show-more')
  const showLessText = currentContext.querySelector('span.plp-block-show-less')
  const collapseIcon = currentContext.querySelector('use')

  collapseBlock?.classList.toggle('show')
  showMoreText?.classList.toggle('d-none')
  showLessText?.classList.toggle('d-none')
  if (showMoreText?.classList.contains('d-none')) {
    collapseIcon?.setAttribute('xlink:href', '#icon-nav-chevron-up')
  } else {
    collapseIcon?.setAttribute('xlink:href', '#icon-nav-chevron-down')
  }
}

export const initializePlpBlockEventListeners = (node) => {
  if (!node) {
    return
  }
  const toggleContentBlock = node.querySelectorAll('.mol-plp-block .toggleContentBlock')
  if (!toggleContentBlock.length) {
    return
  }
  toggleContentBlock?.forEach((toggleContentBlock) => {
    toggleContentBlock?.addEventListener('click', togglePlpContentBlock)
  })

  const cleanupPlpBlockInit = () => {
    toggleContentBlock?.forEach((toggleContentBlock) => {
      toggleContentBlock?.removeEventListener('click', togglePlpContentBlock)
    })
  }

  return cleanupPlpBlockInit
}

export const usePlpBlock = () => {
  const [node, setNode] = useState(null)
  useEffect(() => {
    const cleanupPlpBlockInit = initializePlpBlockEventListeners(node)

    return () => {
      cleanupPlpBlockInit?.()
    }
  }, [node])
  return setNode
}
