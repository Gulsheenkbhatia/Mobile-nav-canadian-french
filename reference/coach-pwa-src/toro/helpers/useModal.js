import { useState, useEffect } from 'react'

const modalInit = (node) => {
  if (!node) {
    return
  }
  let backgroundContainer

  const modalContainer = node.querySelector('.modal')
  const modalOpenBtn = node.querySelector('[data-toggle="modal"]')
  const closeButton = node.querySelector('[data-dismiss="modal"]')

  if (!modalContainer) {
    return
  }

  const openModalHandler = (e) => {
    e.preventDefault()

    modalContainer?.classList.add('show')
    modalContainer?.removeAttribute('aria-hidden')
    modalContainer?.setAttribute('aria-modal', 'true')
    modalContainer?.addEventListener('click', closeModalHandler)
    backgroundContainer = document.createElement('div')
    backgroundContainer.classList.add('modal-backdrop', 'fade', 'show')
    document.body.appendChild(backgroundContainer)
  }

  const closeModalHandler = (e) => {
    e.preventDefault()
    if (e.target.parentNode.getAttribute('data-dismiss') || e.target.classList.contains('modal')) {
      modalContainer?.classList.remove('show')
      modalContainer?.removeAttribute('aria-modal')
      modalContainer?.setAttribute('aria-hidden', 'true')
      backgroundContainer?.remove()
    }
  }

  modalOpenBtn?.removeAttribute('href')
  modalOpenBtn?.classList.add('open-link')
  modalOpenBtn?.addEventListener('click', openModalHandler)
  closeButton?.addEventListener('click', closeModalHandler)

  return () => {
    modalOpenBtn?.removeEventListener('click', openModalHandler)
    modalContainer?.removeEventListener('click', closeModalHandler)
    closeButton?.removeEventListener('click', closeModalHandler)
  }
}

export const useModal = () => {
  const [node, setNode] = useState(null)
  useEffect(() => {
    const cleanupModalInit = modalInit(node)

    return () => {
      cleanupModalInit && cleanupModalInit()
    }
  }, [node])
  return setNode
}
