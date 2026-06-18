import { useCallback, useContext, useMemo } from 'react'
import { variants } from 'toro/components/Link/theme'
import isProxiedPath from 'toro/helpers/isProxiedPath'
import isBrowser from 'toro/helpers/isBrowser'
import isPlainObject from 'lodash/isPlainObject'
import LinkContext from 'components/LinkContext'
import withDefaultHandler from 'toro/helpers/withDefaultHandler'
import MagicLink from 'toro/components/Link/MagicLink'
import useIsSubBrandSwitch from 'toro/hooks/useIsSubBrandSwitch'
import type { MouseEventHandler } from 'react'

interface LinkProps {
  href: any
  prefetch?: boolean
  prefetchUrl?: string
  pageData?: any
  scroll?: boolean
  sx?: any
  variant?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | ((e: MouseEvent) => void | Promise<void>)
  [key: string]: any // To handle any other additional props
}

function Link({
  href,
  prefetch,
  prefetchUrl,
  pageData,
  scroll,
  sx,
  variant,
  children,
  onClick,
  ...props
}: LinkProps) {
  const linkPageData = useContext(LinkContext)

  const isSubBrandSwitch = useIsSubBrandSwitch(href)
  const url = useMemo(() => prefetchUrl || href, [prefetchUrl, href])
  const canPrefetch = useMemo(
    () =>
      prefetch &&
      url &&
      (process.env.NODE_ENV !== 'development' || process.env.SERVICE_WORKER === 'true') &&
      !isProxiedPath(url) &&
      (!isBrowser() || 'serviceWorker' in navigator),
    [prefetch, url]
  )

  const handleProxyLinkClick = useCallback(
    (e) => {
      e.preventDefault()
      onClick?.(e)
      window.location.href = href
    },
    [href, onClick]
  )

  const handleClick = useCallback(
    withDefaultHandler(
      isProxiedPath(href) || isSubBrandSwitch ? handleProxyLinkClick : onClick,
      () => {
        if (linkPageData) {
          linkPageData.current = pageData
        }
      }
    ) as MouseEventHandler<HTMLAnchorElement>,
    [href, linkPageData, pageData, handleProxyLinkClick, onClick]
  )

  const magicLink = useMemo(
    () => (
      <MagicLink
        as={href}
        href={href}
        onClick={handleClick}
        passHref={!!href}
        scroll={scroll}
        sx={{
          ...(isPlainObject(sx) && sx),
          ...(isPlainObject(variants[variant]) && variants[variant]),
        }}
        _focus={{ boxShadow: 'none !important' }}
        prefetch={canPrefetch}
        {...props}
      >
        {children}
      </MagicLink>
    ),
    [href, handleClick, scroll, sx, variant, props, children]
  )

  return magicLink
}

export default Link
