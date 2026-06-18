import { useMemo, memo, useCallback } from 'react'
import useTheme from 'toro/hooks/useTheme'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import { useAtom } from 'jotai'
import { isMobileMenuVisibleAtom, isSubBrandActiveAtom } from 'store/global.atom'
import { MenuCoachtopiaIconV2, MenuSearchIconV2 } from 'toro/icons'
import { useAtomValue } from 'jotai/utils'
type MobileMenuButtonProps = {
  onMenuButtonClick?: () => void
}

const MobileMenuButton = ({ onMenuButtonClick }: MobileMenuButtonProps) => {
  const {
    generalConfiguration: { enableNewGlobalHeader },
    navFlyoutStylings: { enableNewNavMenu: isNewNavEnabled },
  } = usePreference({
    generalConfiguration: ['enableNewGlobalHeader'],
    navFlyoutStylings: ['enableNewNavMenu'],
  })

  const styles = useMultiStyleConfig('MobileMenu', { variant: isNewNavEnabled && 'mobileMenuV2' })
  const theme = useTheme()
  const analytics = useAnalytics()
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useAtom(isMobileMenuVisibleAtom)
  const iconSize = theme.space.l
  const { formatMessage } = useIntl()
  const isSubBrandActive = useAtomValue(isSubBrandActiveAtom)

  const onClick = useCallback(() => {
    onMenuButtonClick?.()
    setIsMobileMenuVisible(true)
    analytics.send('navClick', {
      eventLocation: 'header',
      text: 'mobile hamburger menu',
    })
  }, [onMenuButtonClick])

  const menuIconContainerStyle = useMemo(
    () => ({
      ...styles.button,
      ...styles.menuIconContainer,
      ...(enableNewGlobalHeader && { position: 'relative' }),
    }),
    [enableNewGlobalHeader]
  )

  return (
    <Box sx={menuIconContainerStyle}>
      <Button
        aria-label={formatMessage({ id: 'header.mobileMenu.openMenuAriaLabel' })}
        aria-expanded={isMobileMenuVisible ? 'true' : 'false'}
        aria-haspopup="true"
        w={iconSize}
        size="content"
        variant="link"
        onClick={onClick}
      >
        <MenuIcon
          isSubBrandActive={isSubBrandActive}
          enableNewGlobalHeader={enableNewGlobalHeader}
        />
      </Button>
    </Box>
  )
}

const MenuIcon = memo(
  ({
    enableNewGlobalHeader,
    isSubBrandActive,
  }: {
    enableNewGlobalHeader: boolean
    isSubBrandActive: boolean
  }) => {
    if (!enableNewGlobalHeader) {
      return <DefaultMenuIcon />
    }

    return isSubBrandActive ? (
      <MenuCoachtopiaIconV2 width="30px" height="20px" data-qa="hdr_btn_hamburger" />
    ) : (
      <MenuSearchIconV2 width="30px" height="20px" data-qa="hdr_btn_hamburger" />
    )
  }
)

function DefaultMenuIcon() {
  const { MobileMenuIcon } = useMultiStyleConfig('Icons') as any
  return <MobileMenuIcon data-qa="hdr_btn_hamburger" />
}

export default MobileMenuButton
