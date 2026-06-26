import { InvokedMenuShell } from '../invoked/InvokedMenuShell'
import { V1MenuBody } from './V1MenuBody'

type NavV1AccordionFlyoutProps = {
  open: boolean
  onClose: () => void
}

/** MVP V1 — invoked menu with L1 list, content spots, utility footer, and L2 drill-down. */
export function NavV1AccordionFlyout({ open, onClose }: NavV1AccordionFlyoutProps) {
  return (
    <InvokedMenuShell
      open={open}
      onClose={onClose}
      showSearch
      panelClassName="invoked-menu--l1-gap-16"
      aria-label="Shop navigation"
    >
      {({ menuBrand, menuBodyRef }) => (
        <V1MenuBody open={open} menuBrand={menuBrand} menuBodyRef={menuBodyRef} />
      )}
    </InvokedMenuShell>
  )
}
