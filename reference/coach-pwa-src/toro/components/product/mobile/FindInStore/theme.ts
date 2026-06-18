export default {
  baseStyle: ({ theme }) => ({
    pickUpMainText: {
      ...theme.typography['text-title1-s'],
      textTransform: 'initial',
    },
    pickUpLowerText: {
      ...theme.typography['text-title1-xs'],
      color: 'var(--color-black-70)',
      textTransform: 'initial',
    },
    pickUpTextWrapper: {
      alignItems: 'start',
    },
    PickUpInStoreWrapper: {
      padding: 'var(--spacing-4) var(--spacing-3)',
      borderTop: '1px solid var(--color-neutral-light-2, #E1E1E1)',
      borderBottom: '1px solid var(--color-neutral-light-2, #E1E1E1)',
      alignItems: 'center',
      backgroundColor: 'var(--color-neutral-light)',
    },
    pickUpSearchStoreButton: {
      ...theme.typography['text-title1-s'],
      textTransform: 'initial',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
      color: 'var(--color-grey-80)',
      justifyContent: 'center',
      textDecoration: 'underline',
      m: 'auto',
      mr: 'unset',
    },
    pickUpLowerLink: {
      textDecoration: 'underline',
      marginLeft: 'var(--spacing-1)',
    },
    pickUpSearchStoreIcon: {
      marginRight: 'var(--spacing-2)',
    },
    changeLink: {
      ...theme.typography['text-title1-xs'],
      textTransform: 'initial',
      textDecoration: 'underline',
      color: 'var(--color-black-base)',
      opacity: 0.7,
    },
    productInfoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        background: 'var(--color-neutral-light)',
        marginBottom: 'var(--spacing-4)',
        padding: 'var(--spacing-4) var(--spacing-3)',
        borderRadius: 'var(--border-radius-none)',
      },
    },
  }),
}
