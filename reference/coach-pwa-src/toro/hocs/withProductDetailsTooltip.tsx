import {
  ComponentType,
  useMemo,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
} from 'react'
import { RESET, useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  activeProductDetailsTooltipDataAtom,
  enableProductDetailsTooltip,
} from 'store/site-preview.atom'
import { ListingProduct } from 'toro/types/productTypes'

const stableReferenceObject = {}

const withProductDetailsTooltip = function <
  T extends { payload: ListingProduct } & Record<string, unknown>
>(
  Component: ComponentType<Omit<T, 'payload'>>
): ForwardRefExoticComponent<
  PropsWithoutRef<T & { onMouseEnter?: () => void; onMouseLeave?: () => void }>
> {
  return forwardRef(({ payload, ...props }, ref) => {
    const isTooltipEnabled = useAtomValue(enableProductDetailsTooltip)
    const setProductDetailsTooltipPayload = useUpdateAtom(activeProductDetailsTooltipDataAtom)

    const hoverProps = useMemo(() => {
      if (!isTooltipEnabled) return stableReferenceObject
      return {
        onMouseEnter: () => {
          setProductDetailsTooltipPayload(payload)
        },
        onMouseLeave: () => {
          setProductDetailsTooltipPayload(RESET)
        },
      }
    }, [payload, isTooltipEnabled])

    return <Component ref={ref} {...hoverProps} {...props} />
  })
}

export default withProductDetailsTooltip
