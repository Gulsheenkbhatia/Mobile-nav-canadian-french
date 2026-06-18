import { PropsWithChildren } from 'react'
import Box from 'toro/components/Box'
import useViewportType from 'toro/hooks/useViewportType'

type HiddenProps = {
  onMobile?: boolean
  onTablet?: boolean
  onDesktop?: boolean
  onNonDesktop?: boolean
  onNonMobile?: boolean
  isFragment?: boolean
  [key: string]: any // To allow additional props
}

/**
 * Hidden is a component that conditionally renders its children based on viewport type.
 * It provides a way to hide or show content on specific devices.
 *
 * Props:
 * - onMobile (boolean): Hides children on mobile devices if true.
 * - onTablet (boolean): Hides children on tablet devices if true.
 * - onDesktop (boolean): Hides children on desktop devices if true.
 * - onNonDesktop (boolean): Hides children on non-desktop devices if true.
 * - onNonMobile (boolean): Hides children on non-mobile devices if true.
 * - isFragment (boolean): If true, renders children as a React fragment instead of a Box.
 * - children (React.ReactNode): The content to be conditionally rendered.
 *
 * Bundle Optimization Benefits:
 * - Conditional Rendering: By hiding components based on device type, unnecessary code execution is avoided, reducing the runtime footprint.
 * - Device-Specific Loading: Ensures that only relevant components are loaded and rendered, optimizing the bundle size for different devices.
 *
 * For more details on bundle optimization, refer to the Confluence documentation:
 * https://confluence.tapestry.support/spaces/PF/pages/1248692088/Bundle+Optimization+%E2%80%93+Implementation+Documentation
 *
 * Usage:
 * The component uses the `useViewportType` hook to determine the current device type
 * and conditionally renders its children based on the specified props.
 */
export default function Hidden({
  onMobile,
  onTablet,
  onDesktop,
  onNonDesktop,
  onNonMobile,
  isFragment = false,
  children,
  ...props
}: PropsWithChildren<HiddenProps>) {
  const { isMobile, isTablet, isDesktop } = useViewportType()

  // withCss has been removed to support device detection from headers in SSR
  if (
    ((onMobile || onNonDesktop) && isMobile) ||
    ((onTablet || onNonDesktop) && isTablet) ||
    (onDesktop && isDesktop) ||
    ((isDesktop || isTablet) && onNonMobile)
  ) {
    return null
  }

  return isFragment ? <>{children}</> : <Box {...props}>{children}</Box>
}
