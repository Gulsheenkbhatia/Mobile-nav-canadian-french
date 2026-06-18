const variationOptionTheme = ({ theme }) => ({
  '&:focus, &[data-focus]': {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      borderColor: 'var(--color-black-base)',
    },
  },
  '&:disabled:after, &.allow-disabled:after': {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(
          to bottom right,
          transparent calc(50% - 1px),
          #e6e6e6,
          transparent calc(50% + 1px)
          )`,
    },
  },
  '&.selected': {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      backgroundColor: 'var(--color-black-base)',
      color: 'var(--color-white-base)',
      borderColor: 'var(--color-black-base)',
    },
  },
  '&.allow-disabled.selected': {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      backgroundColor: 'var(--color-background-cta-disabled)',
      borderColor: 'var(--color-neutral-base)',
      color: 'var(--color-white-base)',
      '&:after': {
        background:
          'linear-gradient(to bottom right,transparent calc(50% - 1px),var(--color-white-base),transparent calc(50% + 1px))',
      },
    },
  },
  '&.allow-disabled': {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      color: 'var(--color-neutral-base)',
      backgroundColor: 'var(--color-white-base)',
    },
  },
})

export default {
  variants: {
    'variation-option': variationOptionTheme,
    'megaPDP-variation-option': variationOptionTheme,
  },
}
