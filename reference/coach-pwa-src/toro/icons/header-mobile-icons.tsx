import parseIcons from 'toro/icons/iconParser'

import MenuSearchV2 from '@tapestry-inc/design-tokens/coach/icon/navigation/m-menu-search.svg?raw'
import BagCoachV2 from '@tapestry-inc/design-tokens/coach/icon/navigation/bag-normal.svg?raw'
import MenuCoachtopiaV2 from '@tapestry-inc/design-tokens/coachtopia/icon/navigation/search-burger.svg?raw'
import PackageV2 from '@tapestry-inc/design-tokens/coach/icon/object/m-package.svg?raw'
import Feedback from '@tapestry-inc/design-tokens/coach/icon/review/m-feedback.svg?raw'
import ContactUsV2 from '@tapestry-inc/design-tokens/coach/icon/object/m-contact.svg?raw'
import WishlistV2 from 'components/assets/wishlistV2.svg?raw'
import StoreV2 from 'components/assets/storeV2.svg?raw'
import AccountV2 from '@tapestry-inc/design-tokens/coach/icon/navigation/m-user.svg?raw'
import SearchV2 from 'components/assets/search-iconV2.svg?raw'
import CloseV2 from 'components/assets/close-iconV2.svg?raw'
import Globe from 'components/assets/globe.svg?raw'

const rawHeaderMobileIcons = new Map<IconId, string>([
  ['menuSearchV2', MenuSearchV2],
  ['bagV2', BagCoachV2],
  ['menu-coachtopiaV2', MenuCoachtopiaV2],
  ['globe', Globe],
  ['packageV2', PackageV2],
  ['feedback', Feedback],
  ['contact-usV2', ContactUsV2],
  ['wishlistV2', WishlistV2],
  ['storeV2', StoreV2],
  ['accountV2', AccountV2],
  ['searchV2', SearchV2],
  ['closeV2', CloseV2],
  ['close-search-exposed', CloseV2],
])

export default parseIcons(rawHeaderMobileIcons)
