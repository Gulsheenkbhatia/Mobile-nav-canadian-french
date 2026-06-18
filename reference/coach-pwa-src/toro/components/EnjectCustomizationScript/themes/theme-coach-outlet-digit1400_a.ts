export default {
  baseStyle: ({ theme }) => ({
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      '.customization_cta': {
        lineHeight: 1,
        fontSize: 'var(--text-12)',
        mt: '2px',
        mb: 'var(--spacing-4)',
      },
      'button.customization_link': {
        lineHeight: 1,
        color: 'var(--color-black-base)',
        fontSize: 'var(--text-12)',
      },
    },
  }),
  variants: {
    pdpv42: ({ theme }) => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '&': {
          alignSelf: 'start',
          mt: 'calc(var(--spacing-4) * -1)',
          mb: 'var(--spacing-4)',
        },
        '.customization_cta': {
          margin: '0',
        },
        'button.customization_link': {
          ...theme.typography['text-link2-s'],
          textDecoration: 'underline',
        },
        'button.customization_link.customization_link--edit:before': {
          display: 'none',
        },
        'button.customization_link.customization_link--another': {
          ml: 'var(--spacing-6)',
        },
        'button.customization_link.customization_link--another:before': {
          background: 'var(--color-neutral-light-3)',
          height: '70%',
          width: '1px',
          ml: 'calc(var(--spacing-3) * -1)',
          bottom: 'unset',
          left: 'unset',
        },
      },
    }),
  },
}
