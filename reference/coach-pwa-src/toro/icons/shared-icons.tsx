import parseIcons from 'toro/icons/iconParser'

import CaretDown from 'design-tokens/icon/utility/caret-down.svg?raw'
import AddToBag from 'design-tokens/icon/object/add-to-bag.svg?raw'

/*
 * Icons that:
 * - can be applied to both desktop and mobile, as a key distinguishing factor
 * - and used across various parts of the app
 * */

const rawSharedIcons = new Map<IconId, string>([
  ['caret-down', CaretDown],
  ['addToBag', AddToBag],
])

export default parseIcons(rawSharedIcons)
