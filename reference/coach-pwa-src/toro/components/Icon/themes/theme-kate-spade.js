import dynamic from 'next/dynamic'

import { NavChevronLeftBoldIcon, NavChevronRightBoldIcon } from 'toro/icons'
import ChevronLeftBoldRaw from 'design-tokens/icon/utility/chevron-bold-left.svg?raw'
import ChevronRightBoldRaw from 'design-tokens/icon/utility/chevron-bold-right.svg?raw'
import AccordionIcon from 'components/assets/chevron-down-ks.svg'
import AccordionIconExpanded from 'components/assets/chevron-up-ks.svg'

const ReloadIcon = dynamic(() => import('design-tokens/icon/utility/reload.svg'))

const LoadingIcon = dynamic(() => import('design-tokens/icon/object/spade.svg'))
const MagicIcon = dynamic(() => import('design-tokens/icon/utility/magic-icon.svg'))
const NewChatIcon = dynamic(() => import('design-tokens/icon/utility/new-chat.svg'))
const SendIcon = dynamic(() => import('design-tokens/icon/utility/send.svg'))

export default {
  baseStyle: () => ({
    AccordionIcon,
    AccordionIconExpanded,
    LoadingIcon,
    MagicIcon,
    NewChatIcon,
    SendIcon,
    ReloadIcon,
    ChevronLeft: NavChevronLeftBoldIcon,
    ChevronRight: NavChevronRightBoldIcon,
    ChevronLeftRaw: ChevronLeftBoldRaw,
    ChevronRightRaw: ChevronRightBoldRaw,
  }),
}
