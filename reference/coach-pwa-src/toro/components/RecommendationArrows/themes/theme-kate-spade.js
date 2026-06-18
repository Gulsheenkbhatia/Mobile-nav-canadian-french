import ArrowLeft from 'design-tokens/icon/object/spade-left.svg'
import ArrowRight from 'design-tokens/icon/object/spade-right.svg'
import ChevronLeft from 'design-tokens/icon/utility/chevron-left.svg'
import ChevronRight from 'design-tokens/icon/utility/chevron-right.svg'

export default {
  baseStyle: () => ({
    ArrowLeft,
    ArrowRight,
  }),
  variants: {
    chevronArrows: () => ({
      ArrowLeft: ChevronLeft,
      ArrowRight: ChevronRight,
    }),
  },
}
