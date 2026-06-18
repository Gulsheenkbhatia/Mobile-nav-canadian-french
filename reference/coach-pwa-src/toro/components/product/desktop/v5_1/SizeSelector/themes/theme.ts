export default {
  baseStyle: () => ({
    sizeSelectorWrapper: {
      gap: 'var(--spacing-0)',
      maxWidth: '100%',
      height: 'auto',
      marginBottom: '18px',
      '& .scrollable-container': {
        justifyContent: 'flex-start',
      },
    },
    variationLabel: {
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-125)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
    variationLabelValue: {
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-125)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
    sizeButton: {
      color: 'var(--color-standout-primary, #333)',
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: '13px',
      lineHeight: 'var(--line-height-125)',
      letterSpacing: 'var(--letter-spacing-xs)',
      minWidth: 'auto',
      maxWidth: 'none',
      flex: '1 0 75px',
      height: '45px',
      p: '15px',
      borderColor: 'var(--color-neutral-light-2)',
    },
    sizeAreaHeader: {
      mb: '5px',
      '& p': {
        color: 'var(--color-black-base)',
      },
    },
    sizeAreaFooter: {
      mt: 'var(--spacing-2)',
      justifyContent: 'space-between',
      '& p': {
        color: 'var(--color-black-base)',
      },
      '& .fit-review-text-container': {
        '& p': {
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-100)',
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      },
    },
  }),
}
