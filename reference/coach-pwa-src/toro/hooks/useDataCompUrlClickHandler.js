import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const handleDataCompUrlClick = (el, push) => (e) => {
  if (e.type === 'click' || e.key === 'Enter') {
    if (
      !e.target.closest('a') &&
      !e.target.closest('button') &&
      !e.target.closest('.link-enabled')
    ) {
      const targetUrl = e.target.href || el.dataset.compUrl
      if (targetUrl) {
        if (el.classList.contains('openLinkInNewTab')) {
          window.open(targetUrl, '_blank')
        } else if (push) {
          push(targetUrl)
        }
      }
    }
  }
}

export default function useDataCompUrlClickHandler() {
  const [node, setNode] = useState(null)
  const { push } = useRouter()

  useEffect(() => {
    let handlers = []

    if (node) {
      handlers = Array.from(node.querySelectorAll('[data-comp-url]')).map((el) => {
        const handler = handleDataCompUrlClick(el, push)
        el.addEventListener('click', handler)
        el.addEventListener('keydown', handler)
        return () => {
          el.removeEventListener('click', handler)
          el.removeEventListener('keydown', handler)
        }
      })
    }

    return () => handlers.forEach((handler) => handler())
  }, [node])

  return setNode
}
