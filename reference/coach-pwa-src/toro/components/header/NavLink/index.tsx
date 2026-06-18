import React, { useMemo } from 'react'
import useTheme from 'toro/hooks/useTheme'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import useViewportType from 'toro/hooks/useViewportType'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import { SystemStyleObject } from '@chakra-ui/react'

type NavLinkComponentProps = {
  href?: string
  ariaLabel?: string
  onClick: () => void
  children: React.ReactNode
  dataQa: string
}

const NavLinkComponent = ({
  href,
  ariaLabel,
  onClick,
  children,
  dataQa,
}: NavLinkComponentProps) => {
  if (!href) {
    return (
      <Box sx={{ cursor: 'pointer' }} data-qa={dataQa} aria-label={ariaLabel} onClick={onClick}>
        {children}
      </Box>
    )
  }

  return (
    <Link href={href} data-qa={dataQa} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  )
}

type NavLinkProps = {
  variant?: string
  text?: string
  icon?: React.ReactNode
  url?: string
  qaLink?: string
  qaLabel?: string
  ariaLabel?: string
  tooltipText?: string
  handleClick: () => void
  sx?: SystemStyleObject
  dataQA?: Record<string, string>
}

const NavLink = ({
  variant,
  text,
  icon,
  url,
  qaLink,
  qaLabel,
  ariaLabel,
  tooltipText,
  handleClick,
  sx = {},
  dataQA,
}: NavLinkProps) => {
  const theme = useTheme()
  const iconSize = theme.space.l
  const { childrenStyle, styles, navLinkContent, ...textStyles } = useStyleConfig('NavLink', {
    variant,
  })
  const { isDesktop } = useViewportType()
  const navLinkStyles = useMemo(
    () => (styles.navLinkText ? styles.navLinkText(isDesktop) : {}),
    [isDesktop]
  )
  return (
    <Box sx={{ ...styles.navLinkContainer, ...sx }}>
      <NavLinkComponent
        href={url}
        dataQa={qaLink}
        ariaLabel={ariaLabel || text}
        onClick={handleClick}
      >
        <Flex sx={navLinkContent} alignItems="center">
          {icon && (
            <Box
              title={tooltipText}
              w={iconSize}
              sx={childrenStyle}
              data-qa={dataQA?.flag}
              display="flex"
            >
              {icon}
            </Box>
          )}
          {text && (
            <Box sx={childrenStyle}>
              <Text
                variant="body-primary"
                size="md"
                lineHeight={iconSize}
                sx={{ ...textStyles, ...navLinkStyles }}
                data-qa={dataQA?.label || qaLabel}
              >
                {text}
              </Text>
            </Box>
          )}
        </Flex>
      </NavLinkComponent>
    </Box>
  )
}

export default withErrorBoundaryWrapper(NavLink)
