export default {
  parts: [
    'pdpTxtNotifymeModalHeader',
    'pdpTxtNotifymeFormContainer',
    'successModalPopUpHeading1',
    'successModalPopUpHeading2',
  ],
  variants: {
    optInOnNotifyMe: ({ theme }) => ({
      pdpTxtNotifymeFormContainer: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          padding: '0 var(--spacing-3) var(--spacing-3) var(--spacing-3)',
        },
      },
      pdpTxtNotifymeModalHeader: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
          textAlign: 'left',
          fontWeight: 400,
          marginBottom: 'var(--spacing-3)',
        },
      },
      successModalPopUpHeading1: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
          textAlign: 'left',
          fontWeight: 400,
        },
      }),
      successModalPopUpHeading2: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          textAlign: 'left',
          color: 'var(--color-neutral-1, #6D6D6D)',
          paddingTop: 'var(--spacing-2)',
          fontWeight: 400,
        },
      }),
    }),
  },
}
