import React, { memo } from 'react'
import NavLink from 'toro/components/header/NavLink'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useLocaleUrl from 'toro/hooks/useLocaleUrl'
import { WISHLIST_URL } from 'toro/constants/Urls'

const WishlistButton = ({ onClick }) => {
  const { formatMessage } = useIntl()
  const { WishlistIcon } = useMultiStyleConfig('Icons')
  const qaWishListLink = 'd_hdr_icon_sfl'
  const wishlistUrl = useLocaleUrl(WISHLIST_URL)

  return (
    <NavLink
      handleClick={onClick}
      ariaLabel={formatMessage({
        id: 'header.navigation.wishlistTooltip',
        defaultMessage: 'Wishlist',
      })}
      sx={{
        svg: {
          pointerEvents: 'none',
        },
      }}
      icon={<WishlistIcon />}
      url={wishlistUrl}
      qaLink={qaWishListLink}
      tooltipText={formatMessage({
        id: 'header.navigation.wishlistTooltip',
        defaultMessage: 'Wishlist',
      })}
    />
  )
}

export default memo(WishlistButton)
