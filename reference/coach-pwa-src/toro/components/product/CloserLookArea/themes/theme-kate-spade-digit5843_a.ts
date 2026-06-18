export default {
  parts: [
    'mobileCloserlookHeading',
    'mobileCloserlookText',
    'closerLookContainer',
    'mainContainer',
    'mobileCloserlookWrapper',
    'mobileCloserlookImageWrapper',
  ],
  baseStyle: ({ theme }) => ({
    mainContainer: () => ({
      marginBottom: '10px',
      '&:has(+ .occasion-module:not(:empty))': {
        mb: '22px',
      },
    }),
    closerLookContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        textAlign: 'start',
        margin: '17px var(--spacing-3) 0',
        padding: 0,
      },
    },
    mobileCloserlookHeading: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: 'var(--color-black-base)',
        textAlign: 'start',
        fontFamily: 'var(--font-face2-normal)',
        fontSize: 'var(--text-24)',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 'var(--line-height-s)',
        textTransform: 'none',
        marginBottom: '12.5px',
      },
    }),
    mobileCloserlookText: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: 'var(--color-primary)',
        letterSpacing: 'var(--letter-spacing-xs)',
        margin: '0',
        textAlign: 'start',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-140)',
        fontStyle: 'normal',
        fontWeight: 400,
      },
    }),
    mobileCloserlookWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: '0px',
      },
    }),
    mobileCloserlookImageWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: '0px',
      },
    }),
    hiddenWrapperCloserLook: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        overflowX: 'unset',
      },
    },
  }),
}
