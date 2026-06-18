export default {
  baseStyle: ({ theme }) => ({
    accordion_details: {
      ...theme.typography['text-display1-xs'],
      color: 'var(--color-black)',
    },
    propertiesHtmlContent: {
      'li,a,u,strong': {
        listStyle: 'none',
        ...theme.typography['text-cta1-s'],
        color: 'var(--color-neutral-dark)',
      },
      strong: {
        fontWeight: '400',
      },
      '&': {
        fontFamily: theme.fontFamily.secondaryNormal,
      },
      '& a:hover': {
        textDecoration: 'underline',
      },
    },
    productPropertiesWrapper: () => ({
      '#description1 > div': {
        ...theme.typography['text-body1-s'],
        mt: 'var(--spacing-3)',
      },
      '#description1': {
        ...theme.typography['text-body1-s'],
        mt: 'var(--spacing-3)',
      },
    }),
    accordianItem: {
      borderColor: 'var(--color-inactive)',
      '.ship-text::first-letter, li::first-letter, #description1::first-letter': {
        textTransform: 'capitalize',
      },
      '.ship-text': {
        ...theme.typography['text-body1-s'],
        mt: 'var(--spacing-3)',
      },
      '.ship-text>a': {
        ...theme.typography['text-body1-s'],
      },
    },
    accordionSVG: {
      svg: {
        marginRight: 'var(--spacing-1)',
      },
    },
    productDetails: {
      order: 2,
      borderBottomWidth: '1px',
    },
    editorNotes: {
      order: 1,
      '&:last-of-type': {
        borderBottomWidth: '0px',
      },
    },
  }),
}
