export default {
  baseStyle: ({ theme }) => ({
    sizeSelectorWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      height: '50px',
      maxWidth: '25%',
      position: 'relative',
      '& .scrollableContent': {
        gap: 'var(--spacing-1)',
      },
      '& .scrollable-container': {
        p: 0,
      },
    },
    variationLabel: {
      ...theme.typography['text-cta2-xxs'],
      mr: 'var(--spacing-1)',
    },
    variationLabelValue: {
      ...theme.typography['text-cta2-xxs'],
    },
    sizeButton: {
      ...theme.typography['text-cta2-xxs'],
      p: 'var(--spacing-3) 21px 10px 21px',
      minWidth: 'auto',
      maxWidth: '100px',
      borderRadius: '100px',
      '&.pdp-chosen-size': {
        color: 'var(--color-secondary)',
        backgroundColor: 'var(--color-primary, #000003)',
        borderColor: 'var(--color-primary, #000003)',
      },
      '&.pdp-unavailable-size': {
        borderColor: 'var(--Neutrals-color-neutral-light-2, #E1E1E1)',
        backgroundColor: 'var(--Neutrals-color-neutral-light-2, #E1E1E1)',
        color: 'var(--Neutrals-color-neutral, #949494)',
        '&:after': {
          content: '""',
          position: 'absolute',
          top: '25%',
          left: '30%',
          width: '40%',
          height: '50%',
          background:
            'linear-gradient(to bottom right, transparent calc(50% - 1px), #949494, transparent calc(50% + 1px))',
        },
        '&.pdp-chosen-size': {
          borderColor: 'var(--Neutrals-color-neutral, #949494)',
          backgroundColor: '#C4C4C4', //missed in design token
        },
      },
    },
    arrows: {
      position: 'absolute',
      top: '0%',
      w: '20px',
      h: '40px',
      '& svg': {
        width: '26px',
        height: '26px',
      },
      borderRadius: 'none',
      '&[data-qa="d_plp_left_arrow_swatch"]': {
        left: '-4%',
        zIndex: 2,
      },
      '&[data-qa="d_plp_right_arrow_swatch"]': {
        right: 0,
      },
      '&[disabled]': {
        display: 'none',
      },
    },
    sizeAreaHeader: {
      justifyContent: 'space-between',
      '& p': {
        color: 'var(--color-neutral-1, #6D6D6D)',
      },
      '& .fit-review-text-container': {
        '& p': {
          ...theme.typography['text-cta2-xxs'],
        },
      },
    },
  }),
}
