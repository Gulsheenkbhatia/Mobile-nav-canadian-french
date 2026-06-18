import React, { ReactNode, useMemo } from 'react'
import { useAmp } from 'next/amp'
import { InView } from 'react-intersection-observer'
import Box from 'toro/components/Box'

/**
 * Defers the rendering of children until the component is visible in the viewport. When
 * using Lazy we recommend assigning a CSS class that defines minHeight and minWidth to prevent
 * layout instability when children are lazy loaded.
 *
 * You can use `<Lazy ssrOnly>` to only implement lazy behavior during server side rendering.
 *
 * Example:
 *
 * ```js
 * <Lazy style={{ minHeight: 200 }}>
 *   <SomeExpensiveComponent/>
 * </Lazy>
 * ```
 */

type LazyProps = {
  ssrOnly?: boolean
  className?: string
  children: ReactNode
  onVisible?: (visible: boolean) => void
  showOnInit?: boolean
  rootMargin?: string
  [key: string]: unknown
  fallback?: NonNullable<ReactNode> | null
}

export default function Lazy({
  ssrOnly,
  className,
  children,
  onVisible,
  showOnInit,
  rootMargin = '0px',
  fallback = null,
  ...wrapperProps
}: LazyProps) {
  const amp = useAmp()
  const isVisibleInitially = useMemo(() => amp || ssrOnly, [amp, ssrOnly])

  return (
    <InView
      onChange={onVisible}
      initialInView={showOnInit || isVisibleInitially}
      rootMargin={rootMargin}
      triggerOnce
    >
      {({ inView, ref }) => (
        <Box ref={ref} className={className} style={{ minHeight: 1 }} {...wrapperProps}>
          {inView || showOnInit ? children : fallback}
        </Box>
      )}
    </InView>
  )
}

Lazy.defaultProps = {
  ssrOnly: false,
}
