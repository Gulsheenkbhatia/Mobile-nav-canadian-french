import { ComponentProps, ComponentType } from 'react'
import useIcon from 'toro/hooks/useIcon'

import {
  Bag,
  BagLarge,
  Store,
  Search,
  Heart,
  HeartFilled,
  Close,
  Account,
  Location,
  FormErrorOutline,
  ChevronLeftV2,
  SearchOverlayClose,
} from 'toro/icons/header-icons'

import {
  Instagram,
  Facebook,
  Twitter,
  Tiktok,
  Pinterest,
  Youtube,
  Weibo,
  Tumblr,
  Line,
  InstagramOutline,
  TiktokOutline,
} from 'toro/icons/footer-icons'

import NavChevronLeft from 'design-tokens/icon/utility/chevron-left.svg'
import NavChevronRight from 'design-tokens/icon/utility/chevron-right.svg'
import NavChevronLeftBold from 'design-tokens/icon/utility/chevron-bold-left.svg'
import NavChevronRightBold from 'design-tokens/icon/utility/chevron-bold-right.svg'
import CloseLarge from 'design-tokens/icon/utility/close.svg'
import ChevronBoldUp from 'design-tokens/icon/utility/chevron-bold-up.svg'
import ChevronBoldDown from 'design-tokens/icon/utility/chevron-bold-down.svg'

import Info from 'design-tokens/icon/form/info.svg'
import InfoOutlined from 'design-tokens/icon/form/info-outlined.svg'
import Selected from 'design-tokens/icon/utility/selected.svg'
import Paypal from 'design-tokens/icon/partner/paypal.svg'
import CheckValidation from 'components/assets/check-validation.svg'
import Success from 'design-tokens/icon/form/success.svg'
import AccountBalanceWallet from 'components/assets/account_balance_wallet.svg'

import GraphicArrowLeft from 'design-tokens/icon/object/graphic-arrow-left.svg'
import GraphicArrowRight from 'design-tokens/icon/object/graphic-arrow-right.svg'
import Mail from 'design-tokens/icon/social/mail.svg'
import ThumbDownFilled from 'design-tokens/icon/review/thumb-down-filled.svg'
import ThumbDown from 'design-tokens/icon/review/thumb-down.svg'
import ThumbUpFilled from 'design-tokens/icon/review/thumb-up-filled.svg'
import ThumbUp from 'design-tokens/icon/review/thumb-up.svg'
import CaretUp from 'design-tokens/icon/utility/caret-up.svg'

import Lock from 'design-tokens/icon/object/lock.svg'
import Unlock from 'components/assets/Unlock.svg'
import Chat from 'design-tokens/icon/object/chat.svg'

import Plus from 'design-tokens/icon/utility/plus.svg'
import Minus from 'design-tokens/icon/utility/minus.svg'

import Shipping from 'design-tokens/icon/accordion/shipping.svg'
import EditorsNotes from 'design-tokens/icon/accordion/editors-notes.svg'
import AdditionalDetails from 'design-tokens/icon/accordion/additional-details.svg'
import Klarna from 'design-tokens/icon/partner/klarna.svg'
/*
  The following icons are used for V3 only.
  They will be moved to design-tokens if the test is a success.
 */
import WishlistEmpty from 'toro/components/SaveForLater/icons/wishlist-empty.svg'
import WishlistFilled from 'toro/components/SaveForLater/icons/wishlist-filled.svg'
import Work from 'toro/components/product/BenefitsModule/icons/work.svg'
import Beach from 'toro/components/product/BenefitsModule/icons/beach.svg'
import Party from 'toro/components/product/BenefitsModule/icons/party.svg'
import Travel from 'toro/components/product/BenefitsModule/icons/travel.svg'
import Everyday from 'toro/components/product/BenefitsModule/icons/everyday.svg'
import ViewSimilar from 'toro/components/list/ProductTile/icons/view-similar.svg'
import ViewSimilarLight from 'toro/components/list/ProductTile/icons/view-similar-light.svg'
import WhatFitsInside from 'components/assets/ways-to-wear-it.svg'
import WaysToWearIt from 'components/assets/what-fits-inside.svg'
import Dimensions from 'components/assets/dimensions.svg'
import AddToBagWithPlus from 'design-tokens/icon/navigation/bag-plus.svg'
import LocationBopis from 'design-tokens/icon/object/bopis.svg'
import BlueStarAsset from 'toro/components/AdaptableInlineSearch/icons/blue-star.svg'
import RedStarAsset from 'toro/components/AdaptableInlineSearch/icons/red-star.svg'
import EightRaysStar from 'toro/icons/eight-rays-star-icon.svg'
import HotspotIcon from 'toro/components/product/desktop/HotspotBadge/icons/HotspotIcon.svg'
import Checkmark from 'design-tokens/icon/utility/checkmark.svg'
import RangeSliderDot from 'design-tokens/icon/utility/range-slider-dot.svg'

/*
  The following icons are used for V5 only.
  They will be moved to design-tokens if the test is a success.
 */
import VideoMuted from 'toro/components/product/desktop/CarouselVideo/icons/muted.svg'
import VideoUnmuted from 'toro/components/product/desktop/CarouselVideo/icons/unmuted.svg'
import VideoPlay from 'toro/components/product/desktop/CarouselVideo/icons/play.svg'
import VideoPause from 'toro/components/product/desktop/CarouselVideo/icons/pause.svg'
import TangibleeCtaBagSize from 'components/assets/tangiblee-cta-bag-size-icon.svg'
import TangibleeCtaHowItFits from 'components/assets/tangiblee-cta-how-it-fits-icon.svg'

/*
  The following icons are used for V6 only.
  They will be moved to design-tokens if the test is a success.
 */
import BopisStore from 'components/assets/store.svg'
import ShoppingBagSpeed from 'components/assets/shopping-bag-speed.svg'
import BopisArrowRight from 'components/assets/bopis-arrow-right.svg'
import EnterSvg from 'components/assets/enter-icon.svg'

import SearchIconV2Redesign from 'components/assets/searchV2-redesign.svg'
import Sparkle from 'components/assets/sparkle.svg'
import Stars2 from 'components/assets/stars_2.svg'
import Asterisk from 'components/assets/asterisk.svg'
import Routine from 'components/assets/routine.svg'

/*
  The following icons are used for V7 only.
  They will be moved to design-tokens if the test is a success.
 */
import TouchIconAsset from 'toro/icons/touch-icon.svg'
import TrueSize from 'components/assets/true-size.svg'
import RunsLarge from 'components/assets/runs-large.svg'
import RunsSmall from 'components/assets/runs-small.svg'
import AwardStar from 'components/assets/award_star.svg'
import BagDimensionIcon from 'toro/icons/bag-dimensions.svg'
import BagStrapDropIcon from 'toro/icons/bag-strap-drop.svg'
import BagKeyFeaturesIcon from 'toro/icons/bag-key-features.svg'
import BagFabricIcon from 'toro/icons/bag-fabric-composition.svg'
import BagMaterialIcon from 'toro/icons/bag-material.svg'
import BagDetailsIcon from 'toro/icons/bag-additional-details.svg'
import ClosureTypeIcon from 'toro/icons/closure-type.svg'
import ShoeHeelSpecificationsIcon from 'toro/icons/shoe-heel-specifications.svg'
import ShoeDimensionsIcon from 'toro/icons/shoe-dimensions.svg'

export const iconIdsMap = new Map<IconId, ComponentType<any>>([
  ['form-error-outline', FormErrorOutline],
  ['nav-chevron-left', NavChevronLeft],
  ['nav-chevron-right', NavChevronRight],
  ['nav-chevron-bold-left', NavChevronLeftBold],
  ['nav-chevron-bold-right', NavChevronRightBold],
  ['close-large', CloseLarge],
  ['chevron-bold-up', ChevronBoldUp],
  ['chevron-bold-down', ChevronBoldDown],
  ['heart', HeartFilled],
  ['empty-heart', Heart],
  ['info', Info],
  ['form-info-outline', InfoOutlined],
  ['selected', Selected],
  ['instagram', Instagram],
  ['facebook', Facebook],
  ['twitter', Twitter],
  ['tiktok', Tiktok],
  ['pinterest', Pinterest],
  ['youtube', Youtube],
  ['weibo', Weibo],
  ['tumblr', Tumblr],
  ['line-share', Line],
  ['instagram-outline', InstagramOutline],
  ['tiktok-outline', TiktokOutline],
  ['paypal', Paypal],
  ['check-validation', CheckValidation],
  ['graphic-arrow-left', GraphicArrowLeft],
  ['graphic-arrow-right', GraphicArrowRight],
  ['success', Success],
  ['location', Location],
  ['account', Account],
  ['bag', Bag],
  ['bag-large', BagLarge],
  ['search', Search],
  ['mail', Mail],
  ['thumb-down', ThumbDown],
  ['thumb-down-filled', ThumbDownFilled],
  ['thumb-up', ThumbUp],
  ['thumb-up-filled', ThumbUpFilled],
  ['caret-up', CaretUp],
  ['lock', Lock],
  ['unlock', Unlock],
  ['chat', Chat],
  ['close', Close],
  ['close-hamburger', Close],
  ['store', Store],
  ['wishlist-empty', WishlistEmpty],
  ['wishlist-filled', WishlistFilled],
  ['plus', Plus],
  ['minus', Minus],
  ['work', Work],
  ['travel', Travel],
  ['beach', Beach],
  ['everyday', Everyday],
  ['party', Party],
  ['additional-details', AdditionalDetails],
  ['shipping', Shipping],
  ['editors-notes', EditorsNotes],
  ['chevron-leftV2', ChevronLeftV2],
  ['klarna', Klarna],
  ['view-similar', ViewSimilar],
  ['view-similar-light', ViewSimilarLight],
  ['ways-to-wear-it', WaysToWearIt],
  ['what-fits-inside', WhatFitsInside],
  ['dimensions', Dimensions],
  ['addToBagPlus', AddToBagWithPlus],
  ['bopisLocation', LocationBopis],
  ['blueStar', BlueStarAsset],
  ['redStar', RedStarAsset],
  ['eight-rays-star', EightRaysStar],
  ['hotspot-icon', HotspotIcon],
  ['sparkle', Sparkle],
  ['stars-2', Stars2],
  ['routine', Routine],
  ['asterisk', Asterisk],
  ['account-balance-wallet', AccountBalanceWallet],
  ['checkmark', Checkmark],
  ['range-slider-dot', RangeSliderDot],
  ['videomuted', VideoMuted],
  ['videounmuted', VideoUnmuted],
  ['videoplay', VideoPlay],
  ['videopause', VideoPause],
  ['bopis-store', BopisStore],
  ['shopping-bag-speed', ShoppingBagSpeed],
  ['bopis-arrow-right', BopisArrowRight],
  ['enter-icon', EnterSvg],
  ['searchV2-redesign', SearchIconV2Redesign],
  ['tangiblee-cta-bag-size', TangibleeCtaBagSize],
  ['tangiblee-cta-how-it-fits', TangibleeCtaHowItFits],
  ['search-overlay-close', SearchOverlayClose],
  ['touch-icon', TouchIconAsset],
  ['true-size', TrueSize],
  ['runs-large', RunsLarge],
  ['runs-small', RunsSmall],
  ['award-star', AwardStar],
  ['bag-dimensions', BagDimensionIcon],
  ['bag-strap-drop', BagStrapDropIcon],
  ['bag-key-features', BagKeyFeaturesIcon],
  ['bag-fabric-composition', BagFabricIcon],
  ['bag-material', BagMaterialIcon],
  ['bag-additional-details', BagDetailsIcon],
  ['shoe-heel-specifications', ShoeHeelSpecificationsIcon],
  ['shoe-dimensions', ShoeDimensionsIcon],
  ['closure-type', ClosureTypeIcon],
])

const IconComponent = ({ id, ...rest }: { id: IconId }) => {
  useIcon(id)

  return (
    <svg {...rest}>
      <use href={`#icon-${id}`} />
    </svg>
  )
}

const withIcon = (id: IconId) => {
  return (props: Omit<ComponentProps<any>, 'id'>) => <IconComponent id={id} {...props} />
}

export const PlayCtaIcon = withIcon('play-cta')
export const PlayIcon = withIcon('play')
export const PauseIcon = withIcon('pause')
export const MuteIcon = withIcon('mute')
export const VolumeIcon = withIcon('volume')
export const FormErrorOutlineIcon = withIcon('form-error-outline')
export const ChevronBoldUpIcon = withIcon('chevron-bold-up')
export const ChevronBoldDownIcon = withIcon('chevron-bold-down')
export const NavChevronDownIcon = withIcon('nav-chevron-down')
export const NavChevronUpIcon = withIcon('nav-chevron-up')
export const NavChevronLeftIcon = withIcon('nav-chevron-left')
export const NavChevronRightIcon = withIcon('nav-chevron-right')
export const NavChevronLeftBoldIcon = withIcon('nav-chevron-bold-left')
export const NavChevronRightBoldIcon = withIcon('nav-chevron-bold-right')
export const CloseLargeIcon = withIcon('close-large')
export const FullScreenIcon = withIcon('fullscreen')
export const FullScreenMinimizeIcon = withIcon('fullscreen-minimize')
export const HeartFilledIcon = withIcon('heart')
export const HeartIcon = withIcon('empty-heart')
export const FullStarIcon = withIcon('star')
export const HalfStarIcon = withIcon('half-star')
export const EmptyStarIcon = withIcon('empty-star')
export const InfoIcon = withIcon('info')
export const InfoOutlinedIcon = withIcon('form-info-outline')
export const SelectedIcon = withIcon('selected')
export const InstagramIcon = withIcon('instagram')
export const FacebookIcon = withIcon('facebook')
export const TwitterIcon = withIcon('twitter')
export const TiktokIcon = withIcon('tiktok')
export const PinterestIcon = withIcon('pinterest')
export const YoutubeIcon = withIcon('youtube')
export const WeiboIcon = withIcon('weibo')
export const TumblrIcon = withIcon('tumblr')
export const LineIcon = withIcon('line-share')
export const InstagramOutlineIcon = withIcon('instagram-outline')
export const TiktokOutlineIcon = withIcon('tiktok-outline')
export const PaypalIcon = withIcon('paypal')
export const CheckValidationIcon = withIcon('check-validation')
export const GraphicArrowLeftIcon = withIcon('graphic-arrow-left')
export const GraphicArrowRightIcon = withIcon('graphic-arrow-right')
export const SuccessIcon = withIcon('success')
export const LocationIcon = withIcon('location')
export const AccountIcon = withIcon('account')
export const BagIcon = withIcon('bag')
export const BagLargeIcon = withIcon('bag-large')
export const SearchIcon = withIcon('search')
export const MailIcon = withIcon('mail')
export const ThumbDownIcon = withIcon('thumb-down')
export const ThumbDownFilledIcon = withIcon('thumb-down-filled')
export const ThumbUpIcon = withIcon('thumb-up')
export const ThumbUpFilledIcon = withIcon('thumb-up-filled')
export const CaretUpIcon = withIcon('caret-up')
export const CaretDownIcon = withIcon('caret-down')
export const LockIcon = withIcon('lock')
export const SearchOverlayCloseIcon = withIcon('search-overlay-close')
export const UnlockIcon = withIcon('unlock')
export const ChatIcon = withIcon('chat')
export const CloseIcon = withIcon('close')
export const CloseHamburgerIcon = withIcon('close-hamburger')
export const StoreIcon = withIcon('store')
export const WishlistEmptyIcon = withIcon('wishlist-empty')
export const WishlistFilledIcon = withIcon('wishlist-filled')
export const PlusIcon = withIcon('plus')
export const WorkIcon = withIcon('work')
export const PartyIcon = withIcon('party')
export const TravelIcon = withIcon('travel')
export const BeachIcon = withIcon('beach')
export const SearchIconV2RedesignIcon = withIcon('searchV2-redesign')
export const EverydayIcon = withIcon('everyday')
export const AddToBagIcon = withIcon('addToBag')
export const AdditionalDetailsIcon = withIcon('additional-details')
export const ShippingIcon = withIcon('shipping')
export const EditorsNotesIcon = withIcon('editors-notes')
export const AccountIconV2 = withIcon('accountV2')
export const StoreIconV2 = withIcon('storeV2')
export const WishlistIconV2 = withIcon('wishlistV2')
export const ChevronLeftIconV2 = withIcon('chevron-leftV2')
export const CloseIconV2 = withIcon('closeV2')
export const SearchIconV2 = withIcon('searchV2')
export const BagIconV2 = withIcon('bagV2')
export const MenuSearchIconV2 = withIcon('menuSearchV2')
export const MenuCoachtopiaIconV2 = withIcon('menu-coachtopiaV2')
export const CloseSearchExposedIcon = withIcon('close-search-exposed')
export const ContactUsIconV2 = withIcon('contact-usV2')
export const KlarnaIcon = withIcon('klarna')
export const FeedbackIcon = withIcon('feedback')
export const PackageIconV2 = withIcon('packageV2')
export const GlobeIcon = withIcon('globe')
export const ViewSimilarIcon = withIcon('view-similar')
export const ViewSimilarLightIcon = withIcon('view-similar-light')
export const WaysToWearItIcon = withIcon('ways-to-wear-it')
export const AccountBalanceWalletIcon = withIcon('account-balance-wallet')
export const WhatFitsInsideIcon = withIcon('what-fits-inside')
export const DimensionsIcon = withIcon('dimensions')
export const BopisLocation = withIcon('bopisLocation')
export const AddToBagPlus = withIcon('addToBagPlus')
export const BlueStar = withIcon('blueStar')
export const RedStar = withIcon('redStar')
export const EightRaysStarIcon = withIcon('eight-rays-star')
export const HotspotBadgeIcon = withIcon('hotspot-icon')
export const SparkleIcon = withIcon('sparkle')
export const Stars2Icon = withIcon('stars-2')
export const OccasionIcon = withIcon('routine')
export const AsteriskIcon = withIcon('asterisk')
export const CheckmarkIcon = withIcon('checkmark')
export const RangeSliderDotIcon = withIcon('range-slider-dot')
export const VideoMutedIcon = withIcon('videomuted')
export const VideoUnmutedIcon = withIcon('videounmuted')
export const VideoPlayIcon = withIcon('videoplay')
export const VideoPauseIcon = withIcon('videopause')
export const BopisStoreIcon = withIcon('bopis-store')
export const ShoppingBagSpeedIcon = withIcon('shopping-bag-speed')
export const BopisArrowRightIcon = withIcon('bopis-arrow-right')
export const EnterIcon = withIcon('enter-icon')
export const TangibleeCtaBagSizeIcon = withIcon('tangiblee-cta-bag-size')
export const TangibleeCtaHowItFitsIcon = withIcon('tangiblee-cta-how-it-fits')
export const TouchIcon = withIcon('touch-icon')
export const RunsLargeIcon = withIcon('runs-large')
export const RunsSmallIcon = withIcon('runs-small')
export const TrueSizeIcon = withIcon('true-size')
export const AwardStarIcon = withIcon('award-star')
export const BagDimension = withIcon('bag-dimensions')
export const BagStrapDrop = withIcon('bag-strap-drop')
export const BagKeyFeatures = withIcon('bag-key-features')
export const BagFabric = withIcon('bag-fabric-composition')
export const BagMaterial = withIcon('bag-material')
export const BagDetails = withIcon('bag-additional-details')
export const ClosureType = withIcon('closure-type')
export const ShoeHeelSpecifications = withIcon('shoe-heel-specifications')
export const ShoeDimensions = withIcon('shoe-dimensions')
