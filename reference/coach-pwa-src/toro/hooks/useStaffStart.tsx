import { useState, useEffect } from 'react'
import { setStaffStartScriptsAtom } from 'store/scripts.atom'
import { useUpdateAtom } from 'jotai/utils'

function fireScriptForStaffStart(node) {
  if (!node) return
  const scripts = []
  const staffStartNodes = node?.querySelectorAll('.staff-start')
  if (!staffStartNodes?.length) return scripts

  for (const staffNode of staffStartNodes) {
    const staffScripts = staffNode.querySelectorAll('script')
    for (const script of staffScripts) {
      if (script.src) {
        const scriptSrc = `${script.src}${script.src.includes('?') ? '&' : '?'}_v_=${Date.now()}`
        scripts.push({ src: scriptSrc })
      } else {
        const inlineCode = script.textContent || script.innerHTML
        if (inlineCode.trim()) {
          scripts.push({ content: inlineCode, id: Date.now() })
        }
      }
    }
  }

  return scripts
}

const useStaffStart = () => {
  const [node, setNode] = useState(null)
  const setScripts = useUpdateAtom(setStaffStartScriptsAtom)

  useEffect(() => {
    if (!node) {
      return
    }

    const scripts = fireScriptForStaffStart(node)

    // Ensure we are actually setting the atom
    if (scripts.length > 0) {
      setScripts(scripts)
    }

    return () => {
      setScripts([])
      document.querySelectorAll('.staff-start-script').forEach((script) => {
        script.remove()
      })
    }
  }, [node])
  return setNode
}

export default useStaffStart
