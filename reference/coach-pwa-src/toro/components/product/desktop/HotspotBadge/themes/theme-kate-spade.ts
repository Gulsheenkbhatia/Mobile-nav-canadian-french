export default {
  parts: ['hotspotWrapper'],
  baseStyle: ({ theme }) => ({
    hotspotWrapper: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
      '& > svg': {
        width: 'var(--spacing-6)',
        height: 'var(--spacing-6)',
      },
      '&.horizontal': {
        '& > svg': {
          transform: 'rotate(90deg)',
        },
      },
      '&.diagonal': {
        '& > svg': {
          transform: 'rotate(-45deg)',
        },
      },
      '&.plus svg': {
        width: '19px',
        height: '19px',
      },
    },
    hotspotTitle: {
      color: 'var(--color-black-base)',
      leadingTrim: 'both',
      textAlign: 'center',
      textEdge: 'cap',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-16)',
      lineHeight: 'var(--line-height-s)',
      mt: 'var(--spacing-1)',
      whiteSpace: 'pre-line',
      [`@media (max-height: 864px)`]: {
        fontSize: 'var(--text-14)',
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-m'],
      },
    },
    tooltipWrapper: {
      borderRadius: '50%',
      display: 'flex',
      border: '1px solid var(--border-color-inactive)',
      backgroundColor: 'var(--chakra-colors-white)',
      aspectRatio: '1/1',
      padding: '6px',
      transition: 'all 400ms ease-in-out',
      cursor: 'pointer',
      '&.open': {
        transform: 'rotate(45deg)',
      },
    },
    tooltip: {
      borderRadius: '800px',
      padding: '14px 20px',
      background: 'var(--chakra-colors-white)',
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-xxs)',
      letterSpacing: 'var(--letter-spacing-xs)',
      boxShadow: '0px 12px 20px 0px rgba(0, 0, 0, 0.05)',
      textAlign: 'center',

      '& .chakra-tooltip__arrow': {
        bg: 'var(--color-white-base) !important', // need to re-write chakra inline styles
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-m'],
      },
    },
  }),
  variants: {
    handleStrap: {
      hotspotWrapper: {
        width: '190px',
        top: 'unset',
        bottom: '365px',
      },
    },
  },
}
