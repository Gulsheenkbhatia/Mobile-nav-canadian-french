import dynamic from 'next/dynamic'

import { NavChevronLeftIcon, NavChevronRightIcon } from 'toro/icons'
import ChevronLeftRaw from 'design-tokens/icon/utility/chevron-left.svg?raw'
import ChevronRightRaw from 'design-tokens/icon/utility/chevron-right.svg?raw'
import AccordionIcon from 'toro/components/AccordionIcon'

const StoresIcon = dynamic(() => import('design-tokens/icon/navigation/location.svg'))
const AccountIcon = dynamic(() => import('design-tokens/icon/navigation/account.svg'))
const WishlistIcon = dynamic(() => import('design-tokens/icon/navigation/favorite.svg'))
const WishlistIconFilled = dynamic(() => import('design-tokens/icon/navigation/favorite-fill.svg'))
const BagIcon = dynamic(() => import('design-tokens/icon/navigation/bag.svg'))
const BagLargeIcon = dynamic(() => import('design-tokens/icon/navigation/bag-3digit.svg'))
const SearchIcon = dynamic(() => import('design-tokens/icon/navigation/search.svg'))
const MobileMenuIcon = dynamic(() => import('design-tokens/icon/navigation/hamburger.svg'))
const BackToTop = dynamic(() => import('design-tokens/icon/utility/chevron-up.svg'))
const Facebook = dynamic(() => import('design-tokens/icon/social/facebook.svg'))
const Twitter = dynamic(() => import('design-tokens/icon/social/twitter.svg'))
const Pinterest = dynamic(() => import('design-tokens/icon/social/pinterest.svg'))
const Email = dynamic(() => import('design-tokens/icon/social/mail.svg'))
const LineShare = dynamic(() => import('design-tokens/icon/social/line.svg'))
const EmptyStar = dynamic(() => import('design-tokens/icon/review/star-empty.svg'))
const HalfStar = dynamic(() => import('design-tokens/icon/review/star-50.svg'))
const FullStar = dynamic(() => import('design-tokens/icon/review/star.svg'))
const ThumbDownFilled = dynamic(() => import('design-tokens/icon/review/thumb-down-filled.svg'))
const ThumbDown = dynamic(() => import('design-tokens/icon/review/thumb-down.svg'))
const ThumbUpFilled = dynamic(() => import('design-tokens/icon/review/thumb-up-filled.svg'))
const ThumbUp = dynamic(() => import('design-tokens/icon/review/thumb-up.svg'))
const InfoIcon = dynamic(() => import('design-tokens/icon/form/info-outlined.svg'))
const PlusIcon = dynamic(() => import('design-tokens/icon/utility/plus.svg'))
const MinusIcon = dynamic(() => import('design-tokens/icon/utility/minus.svg'))
const EditIcon = dynamic(() => import('design-tokens/icon/object/edit.svg'))

export default {
  parts: [
    'AccordionIcon',
    'AccordionIconExpanded',
    'StoresIcon',
    'AccountIcon',
    'WishlistIcon',
    'BagIcon',
    'BagLargeIcon',
    'SearchIcon',
    'WishlistIconFilled',
    'MobileMenuIcon',
    'BackToTop',
    'Facebook',
    'Twitter',
    'Pinterest',
    'Email',
    'LineShare',
    'EmptyStar',
    'HalfStar',
    'FullStar',
    'ThumbDownFilled',
    'ThumbDown',
    'ThumbUp',
    'ThumbUpFilled',
    'InfoIcon',
    'PlusIcon',
    'MinusIcon',
    'EditIcon',
    'ChevronLeft',
    'ChevronRight',
  ],
  baseStyle: () => ({
    AccordionIcon,
    AccordionIconExpanded: AccordionIcon,
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
    ThumbDownFilled,
    ThumbDown,
    ThumbUp,
    ThumbUpFilled,
    InfoIcon,
    PlusIcon,
    MinusIcon,
    EditIcon,
    ChevronLeft: NavChevronLeftIcon,
    ChevronRight: NavChevronRightIcon,
    ChevronLeftRaw,
    ChevronRightRaw,
  }),
}
