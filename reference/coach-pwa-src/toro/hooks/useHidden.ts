import useViewportType from 'toro/hooks/useViewportType'

type UseHiddenParams = {
  onMobile?: boolean
  onTablet?: boolean
  onDesktop?: boolean
  onNonDesktop?: boolean
  onNonMobile?: boolean
}

const useHidden = ({
  onMobile,
  onTablet,
  onDesktop,
  onNonDesktop,
  onNonMobile,
}: UseHiddenParams): boolean => {
  const { isMobile, isTablet, isDesktop } = useViewportType()

  return (
    ((onMobile || onNonDesktop) && isMobile) ||
    ((onTablet || onNonDesktop) && isTablet) ||
    (onDesktop && isDesktop) ||
    ((isDesktop || isTablet) && onNonMobile)
  )
}

export default useHidden
