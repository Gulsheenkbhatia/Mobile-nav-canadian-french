import { useCallback, RefCallback, MutableRefObject } from 'react'
import useViewportType from 'toro/hooks/useViewportType'
import isFunction from 'lodash/isFunction'
import { onViewportChangeHandler } from 'toro/helpers/mediaAssets'

export default function useViewportVideoHandler(
  hasVideoContent = false,
  externalRef: MutableRefObject<HTMLElement | null> | RefCallback<HTMLElement | null> | null = null
): RefCallback<HTMLElement | null> {
  const { isDesktop } = useViewportType()

  const callbackRef = useCallback<RefCallback<HTMLElement | null>>(
    (node) => {
      if (node) {
        if (externalRef) {
          isFunction(externalRef) ? externalRef(node) : (externalRef.current = node)
        }

        if (!hasVideoContent) return

        try {
          onViewportChangeHandler(isDesktop)
        } catch (err) {
          console.error('Error invoking onViewportChangeHandler:', err)
        }
      }
    },
    [isDesktop, hasVideoContent]
  )

  return callbackRef
}
