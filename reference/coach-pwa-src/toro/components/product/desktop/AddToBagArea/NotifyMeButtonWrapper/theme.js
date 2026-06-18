import {
  alterCtaCommonHoverStyles,
  alterCtaCommonStyles,
} from 'toro/components/product/desktop/AddToBagArea/themes/theme'

export default {
  baseStyle: ({ theme }) => ({
    notifyMeButton: {
      ...alterCtaCommonStyles,
      ...theme.typography['text-cta2-m'],
      '&:hover:not(:disabled), &:active': alterCtaCommonHoverStyles,
      textTransform: 'none',
      fontSize: 'var(--text-12)',
    },
  }),
}
