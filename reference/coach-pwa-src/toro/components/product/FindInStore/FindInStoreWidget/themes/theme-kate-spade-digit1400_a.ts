export default {
  baseStyle: ({ theme }) => ({
    FindInStoreWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: 'var(--color-black-base)',
        marginTop: '18px' /* This value is not in design-tokens */,
        marginBottom: '0',
      },
    },
    AvailableAtWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        background: 'var(--color-white-base)',
        margin: '0',
        padding: '0',
      },
    },
    locationName: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        marginLeft: '2px',
        paddingRight: 'var(--spacing-6)',
        width: '100%',
      },
    },
    PickUpButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-l'],
        borderBottom: 'var(--border-width-s) solid rgba(0, 0, 0, 0.08)',
        borderRadius: 'var(--border-radius-none)',
        display: 'flex',
        fontWeight: '400',
        height: '42px',
        marginBottom: '0',
        paddingTop: 'var(--spacing-3)',
        paddingBottom: 'var(--spacing-4)',
        textTransform: 'none',
        '&:has(+ div:not(:empty))': {
          marginBottom: 'var(--spacing-4)',
        },
      },
    },
    FindStoreButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        textDecoration: 'underline',
        textTransform: 'none',
      },
    },
    availableAtContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        alignItems: 'center',
      },
    },
  }),
}
