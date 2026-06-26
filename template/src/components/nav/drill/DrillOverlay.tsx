import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

type DrillOverlayProps = {
  isTop: boolean
  isExiting: boolean
  /** Visible underneath while a child panel slides out. */
  isRevealed: boolean
  contentKey: number
  children: ReactNode
}

/**
 * Drill panel slide — enter adds `--entered` (100% → 0); exit removes it (0% → 100%),
 * reversing the same transform transition. Enter only runs when contentKey changes.
 */
export function DrillOverlay({
  isTop,
  isExiting,
  isRevealed,
  contentKey,
  children,
}: DrillOverlayProps) {
  const [entered, setEntered] = useState(false)
  const [exitSliding, setExitSliding] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEntered(false)
    let outer = 0
    let inner = 0
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [contentKey])

  useLayoutEffect(() => {
    if (!isExiting) {
      setExitSliding(false)
      return
    }

    setExitSliding(false)
    let outer = 0
    let inner = 0
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setExitSliding(true))
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [isExiting])

  const isCovered = !isTop && !isExiting && !isRevealed
  const showEntered =
    (isExiting && !exitSliding) ||
    (!isExiting && (entered || isCovered || isRevealed))

  const className = [
    'invoked-menu__overlay',
    showEntered ? 'invoked-menu__overlay--entered' : '',
    isTop && !isExiting ? 'invoked-menu__overlay--active' : '',
    isExiting ? 'invoked-menu__overlay--exiting' : '',
    isRevealed ? 'invoked-menu__overlay--revealed' : '',
    isCovered ? 'invoked-menu__overlay--covered' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={panelRef}
      className={className}
      aria-hidden={!isTop && !isExiting}
    >
      {children}
    </div>
  )
}
