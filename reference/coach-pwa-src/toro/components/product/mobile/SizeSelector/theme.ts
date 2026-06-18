export default {
  baseStyle: ({ theme }) => ({
    sizeSelectorWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '13px',
      width: '100%',
      padding: 'var(--spacing-4) 0 var(--spacing-4) var(--spacing-3)',
      position: 'relative',
      '& .scrollableContent': {
        gap: 'var(--spacing-1)',
        '& button:last-child': {
          marginRight: 'var(--spacing-3)',
        },
      },
      '& .scrollable-container': {
        p: 0,
        justifyContent: 'start',
      },
    },
    variationLabel: {
      ...theme.typography['text-title1-s'],
      mr: 'var(--spacing-1)',
      fontFamily: 'var(--font-face1-extended-bold)',
    },
    variationLabelValue: {
      ...theme.typography['text-title1-s'],
      fontFamily: 'var(--font-face1-extended-bold)',
    },
    sizeButton: {
      fontFamily: 'var(--font-face1-extended-normal)',
      color: 'var(--color-neutral-dark-1)',
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 'var(--line-height-125)',
      letterSpacing: 'var(--letter-spacing-xs)',
      p: '16px 15px 13px',
      minWidth: '75px',
      minHeight: '47px', // Better touch target for mobile
      flexShrink: 0,
      borderRadius: '753px',
      border: '1px solid var(--color-neutral-light-3)',
      backgroundColor: 'var(--color-white-base)',
      '&.pdp-chosen-size': {
        color: 'var(--color-white-base)',
        backgroundColor: 'var(--color-black-base)',
        borderColor: 'var(--color-black-base)',
      },
      '&.pdp-unavailable-size': {
        color: 'var(--color-neutral-base)',
        position: 'relative',
        overflow: 'hidden',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '4%',
          width: '92%',
          height: '1.5px',
          backgroundColor: '#c6c6c7',
          transform: 'translateY(-50%) rotate(-35deg)',
        },
        '&.pdp-chosen-size': {
          borderColor: 'var(--color-neutral-base)',
          backgroundColor: '#C4C4C4',
          '&:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '4%',
            width: '92%',
            height: '1.5px',
            backgroundColor: 'var(--color-neutral-base)',
            transform: 'translateY(-50%) rotate(-35deg)',
          },
        },
      },
    },
    sizeAreaHeader: {
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    sizeAreaFooter: {
      mt: '2px',
      '& .size-guide-container button, & .fit-review-text-container p': {
        ...theme.typography['text-cta2-xs'],
        textTransform: 'none',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-100)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
      },
      '& .size-guide-container': {
        m: 0,
      },
      '& .fit-review-text-container p': {
        pr: 'var(--spacing-3)',
      },
    },
  }),
}
