export default {
  baseStyle: {},
  variants: {
    pdpv42: ({ theme }) => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '&': {
          alignSelf: 'start',
          mt: 'var(--spacing-2)',
          mb: 'var(--spacing-2)',
          ml: 'var(--spacing-3)',
        },
        'button.customization_link': {
          ...theme.typography['text-title1-s'],
        },
        'button.customization_link.customization_link--another': {
          ml: 'var(--spacing-4)',
        },
        'button.customization_link.customization_link--another:before': {
          ml: 'calc(var(--spacing-2) * -1)',
        },
      },
    }),
  },
}
