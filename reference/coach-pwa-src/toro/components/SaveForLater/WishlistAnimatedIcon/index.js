import dynamic from 'next/dynamic'
import { WishlistEmptyIcon, WishlistFilledIcon } from 'toro/icons'
const WishlistFillAnimationIcon = dynamic(() =>
  import('toro/components/SaveForLater/icons/wishlist-fill-animation.svg')
)
import { useMemo } from 'react'

export default function WishlistAnimatedIcon({ isInWishlist, isAnimationPlaying, ...props }) {
  const wishlistIconsProps = {
    width: 22,
    height: 22,
    color: isInWishlist && '#D50032',
    overflow: 'visible',
    ...props,
  }

  const WishlistIcon = useMemo(() => {
    if (!isInWishlist) return WishlistEmptyIcon
    if (isAnimationPlaying) return WishlistFillAnimationIcon
    return WishlistFilledIcon
  }, [isInWishlist, isAnimationPlaying])

  return <WishlistIcon {...wishlistIconsProps} />
}
