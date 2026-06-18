import dynamic from 'next/dynamic'

const StoresIcon = dynamic(() => import('sub-theme-tokens/icon/navigation/location.svg'))
const AccountIcon = dynamic(() => import('sub-theme-tokens/icon/navigation/account.svg'))
const WishlistIcon = dynamic(() => import('sub-theme-tokens/icon/navigation/favorite.svg'))
const WishlistIconFilled = dynamic(() =>
  import('sub-theme-tokens/icon/navigation/favorite-fill.svg')
)
const BagIcon = dynamic(() => import('sub-theme-tokens/icon/navigation/bag.svg'))
const BagLargeIcon = dynamic(() => import('sub-theme-tokens/icon/navigation/bag-3digit.svg'))
const SearchIcon = dynamic(() => import('sub-theme-tokens/icon/navigation/search.svg'))
const MobileMenuIcon = dynamic(() => import('sub-theme-tokens/icon/navigation/hamburger.svg'))
const BackToTop = dynamic(() => import('sub-theme-tokens/icon/utility/back-to-top.svg'))
const Facebook = dynamic(() => import('sub-theme-tokens/icon/social/facebook.svg'))
const Twitter = dynamic(() => import('sub-theme-tokens/icon/social/twitter.svg'))
const Pinterest = dynamic(() => import('sub-theme-tokens/icon/social/pinterest.svg'))
const Email = dynamic(() => import('sub-theme-tokens/icon/social/mail.svg'))
const LineShare = dynamic(() => import('sub-theme-tokens/icon/social/line.svg'))
const EmptyStar = dynamic(() => import('sub-theme-tokens/icon/review/star-empty.svg'))
const HalfStar = dynamic(() => import('sub-theme-tokens/icon/review/star-50.svg'))
const FullStar = dynamic(() => import('sub-theme-tokens/icon/review/star.svg'))
const BagSizeCompare = dynamic(() => import('sub-theme-tokens/icon/object/bag-size-compare.svg'))
const ThumbDownFilled = dynamic(() => import('sub-theme-tokens/icon/review/thumb-down-filled.svg'))
const ThumbDown = dynamic(() => import('sub-theme-tokens/icon/review/thumb-down.svg'))
const ThumbUpFilled = dynamic(() => import('sub-theme-tokens/icon/review/thumb-up-filled.svg'))
const ThumbUp = dynamic(() => import('sub-theme-tokens/icon/review/thumb-up.svg'))

export default {
  baseStyle: () => ({
    StoresIcon,
    AccountIcon,
    WishlistIcon,
    BagIcon,
    BagLargeIcon,
    SearchIcon,
    WishlistIconFilled,
    MobileMenuIcon,
    BackToTop,
    Facebook,
    Twitter,
    Pinterest,
    Email,
    LineShare,
    EmptyStar,
    HalfStar,
    FullStar,
    BagSizeCompare,
    ThumbDownFilled,
    ThumbDown,
    ThumbUpFilled,
    ThumbUp,
  }),
}
