const tangibleeButton = {
  right: 'var(--spacing-3)',
  left: 'unset',
  transform: 'none',
  width: 'fit-content',
  height: 'auto',
  pb: '10px', // missing in the design token
  pr: 'var(--spacing-3)',
}

export default {
  parts: [
    'tangibleeButton',
    'tangibleeButtonCustomPaginationPosition',
    'tangibleeButtonContainer',
    'tangibleeLabel',
    'tangibleeButtonWrapper',
    'plusIcon',
  ],
  baseStyle: () => ({
    tangibleeButton: {
      position: 'absolute',
      bottom: '32px',
      left: '50%',
      transform: 'translate(-50%, 0)',
      zIndex: 10,
      padding: 'var(--spacing-3) var(--spacing-4)',
      borderRadius: 'var(--border-radius-full)',
    },
    tangibleeButtonContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
      '& svg': {
        width: 'var(--spacing-4)',
        height: 'var(--spacing-4)',
        '& > use': {
          color: 'var(--color-secondary)',
        },
      },
    },
    tangibleeLabel: {
      color: 'var(--color-secondary)',
      lineHeight: 'var(--line-height-115)',
      letterSpacing: 'var(--letter-spacing-xl)',
      fontSize: 'var(--text-12)',
      fontWeight: '400',
      textTransform: 'uppercase',
    },
    tangibleeButtonWrapper: {},
    bentoCarouselTangibleeButton: {
      minWidth: '65px',
    },
  }),
  variants: {
    pdpV3Redesign: ({ theme }) => ({
      tangibleeButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          bottom: 'var(--spacing-3)',
          right: 'var(--spacing-3)',
          left: 'unset',
          transform: 'none',
          width: 'fit-content',
          height: 'auto',
          pb: '10px', // missing in the design token
          pr: 'var(--spacing-3)',
        },
      },
      tangibleeButtonContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gap: 0,
          '& svg': {
            width: '11px', // missing in the design token
            height: '11px', // missing in the design token
            mb: '2px', // missing in the design token
            '& > use': {
              color: 'var(--color-white-base)',
              strokeWidth: '2px', // missing in the design token
              stroke: 'var(--color-white-base)',
            },
          },
        },
      },
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pr: '9px', // missing in the design token
          fontSize: 'var(--text-16)',
          fontWeight: 700,
          lineHeight: 'var(--line-height-s)',
          letterSpacing: 'var(--letter-spacing-xs)',
          textTransform: 'none',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      tangibleeButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          bottom: 'var(--spacing-4)',
          ...tangibleeButton,
        },
      },
      tangibleeButtonCustomPaginationPosition: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          bottom: '40px',
          ...tangibleeButton,
        },
      },
      tangibleeButtonContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gap: 0,
          '& svg': {
            width: '11px', // missing in the design token
            height: '11px', // missing in the design token
            mb: '2px', // missing in the design token
            '& > use': {
              color: 'var(--color-white-base)',
              strokeWidth: '2px', // missing in the design token
              stroke: 'var(--color-white-base)',
            },
          },
        },
      },
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pr: '9px', // missing in the design token
          fontSize: 'var(--text-16)',
          fontWeight: 700,
          lineHeight: 'var(--line-height-s)',
          letterSpacing: 'var(--letter-spacing-xs)',
          textTransform: 'none',
        },
      },
    }),
    adaptiveTabbedPDPNumericPagination: ({ theme }) => ({
      tangibleeButtonWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          position: 'absolute',
          display: 'flex',
          right: '0',
          justifyContent: 'center',
          width: '100%',
          bottom: '57px',
        },
      },
      tangibleeButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: '0 var(--spacing-4)',
          transform: 'none',
          position: 'static',
          height: '36px',
        },
      },
      tangibleeButtonContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gap: 0,
          '& svg': {
            width: '11px', // missing in the design token
            height: '11px', // missing in the design token
            mb: 0,
            '& > use': {
              color: 'var(--color-white-base)',
              strokeWidth: '2px', // missing in the design token
              stroke: 'var(--color-white-base)',
            },
          },
        },
      },
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pr: '9px', // missing in the design token
          ...theme.typography['text-cta2-xs'],
          fontSize: 'var(--text-12)',
          textTransform: 'none',
          mt: '4px',
        },
      },
    }),
    vpc: ({ theme }) => ({
      tangibleeButton: {
        bottom: '10px',
        padding: '19px 38px',
        height: 'auto',
        [`@media (max-height: 864px)`]: {
          height: '38px',
          bottom: '0',
          minWidth: '160px',
          p: '0',
        },
      },
      tangibleeLabel: {
        ...theme.typography['text-cta2-xs'],
        textTransform: 'none',
      },
      plusIcon: {
        display: 'none',
      },
    }),
  },
}
