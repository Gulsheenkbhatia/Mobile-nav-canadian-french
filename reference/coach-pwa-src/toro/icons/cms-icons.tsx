import PlayCta from 'design-tokens/icon/video/play-cta.svg?raw'
import Play from 'design-tokens/icon/video/play.svg?raw'
import FullScreen from 'design-tokens/icon/video/fullscreen.svg?raw'
import FullScreenMinimize from 'design-tokens/icon/video/minimize.svg?raw'
import EmptyStar from 'design-tokens/icon/review/star-empty.svg?raw'
import HalfStar from 'design-tokens/icon/review/star-50.svg?raw'
import FullStar from 'design-tokens/icon/review/star.svg?raw'
import Pause from 'design-tokens/icon/video/pause.svg?raw'
import Mute from 'design-tokens/icon/video/mute.svg?raw'
import Volume from 'design-tokens/icon/video/volume.svg?raw'
import NavChevronDown from 'design-tokens/icon/utility/chevron-down.svg?raw'
import NavChevronUp from 'design-tokens/icon/utility/chevron-up.svg?raw'
import NavChevronLeft from 'design-tokens/icon/utility/chevron-left.svg?raw'
import NavChevronRight from 'design-tokens/icon/utility/chevron-right.svg?raw'
import Close from 'design-tokens/icon/utility/close.svg?raw'

import parseIcons from 'toro/icons/iconParser'

const rawCmsIcons = new Map<IconId, string>([
  ['play-cta', PlayCta],
  ['youtube-play', PlayCta],
  ['play', Play],
  ['pause', Pause],
  ['mute', Mute],
  ['volume', Volume],
  ['nav-chevron-down', NavChevronDown],
  ['nav-chevron-up', NavChevronUp],
  ['nav-chevron-left', NavChevronLeft],
  ['nav-chevron-right', NavChevronRight],
  ['close-large', Close],
  ['fullscreen', FullScreen],
  ['fullscreen-minimize', FullScreenMinimize],
  ['star', FullStar],
  ['review-star-filled', FullStar],
  ['half-star', HalfStar],
  ['review-star-half', HalfStar],
  ['empty-star', EmptyStar],
])

export default parseIcons(rawCmsIcons)
