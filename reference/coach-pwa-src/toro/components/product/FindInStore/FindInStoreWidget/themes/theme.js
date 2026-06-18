const secondaryText = {
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-12)',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'var(--line-height-140)',
  letterSpacing: 'var(--letter-spacing-xs)',
  textTransform: 'none',
}

export default {
  parts: [
    'FindInStoreWrapper',
    'AvailableAtWrapper',
    'changeLink',
    'PickUpInStoreWrapper',
    'pickUpMainText',
    'pickUpLowerText',
    'pickUpTextWrapper',
    'pickUpSearchStoreWrapper',
    'pickUpSearchStoreButton',
    'pickUpLowerLink',
  ],
  baseStyle: ({ theme }) => ({
    FindInStoreWrapper: {
      w: '100%',
      mb: '3',
    },
    AvailableAtWrapper: {
      p: 'mar',
      bg: theme.colors.neutral.light,
      mb: 's',
      mt: 's',
    },
    AvailableAtWrapperMobile: {
      p: 'mar',
      bg: theme.colors.neutral.light,
      mb: 's',
      mt: 's',
      fontSize: theme.fontSizes.xs,
      fontWeight: 'normal',
      fontFamily: theme.fontFamily.primaryNormal,
    },
    locationName: {
      paddingRight: 2,
    },
  }),
  variants: {
    bopisV3Redesign: ({ theme }) => ({
      PickUpInStoreWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          m: 'var(--spacing-4) 0',
          border: '1px solid var(--color-inactive)',
          borderRadius: 'var(--border-radius-s)',
          p: '10px 4.5px 10px 17px',
        },
      },
      pickUpMainText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-black-base)',
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          fontWeight: 700,
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          textTransform: 'none',
          textAlign: 'start',
        },
      },
      pickUpLowerText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          ...secondaryText,
          color: 'var(--color-neutral-medium)',
          textAlign: 'start',
        },
      },
      pickUpTextWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ml: '13px',
        },
      },
      changeLink: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...secondaryText,
          borderBottom: '1px solid var(--color-primary)',
          borderRadius: 'unset',
          color: 'var(--color-primary)',
        },
      },
    }),
    bopisV4Enhanced: ({ theme }) => ({
      PickUpInStoreWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          m: 'var(--spacing-4) var(--spacing-4) 28px',
          borderRadius: 'var(--border-radius-m)',
          p: '11px 5.5px 9.5px var(--spacing-3)',
          background: 'var(--color-white-base)',
          boxShadow: '0px 10px 28px 0px rgba(0, 0, 0, 0.08)',
        },
      },
      pickUpMainText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-black-base)',
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          fontWeight: 400,
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          textTransform: 'none',
          textAlign: 'start',
        },
      },
      pickUpLowerText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          ...secondaryText,
          color: 'var(--color-neutral-medium)',
          textAlign: 'start',
        },
      },
      pickUpTextWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ml: '9px',
        },
      },
      changeLink: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...secondaryText,
          borderBottom: '1px solid var(--color-black-base)',
          borderRadius: 'unset',
          color: 'var(--color-black-base)',
        },
      },
    }),
  },
}
