export default {
  parts: [
    'accordion_details',
    'accordionSVG',
    'editorNotes',
    'accordianItem',
    'productPropertiesWrapper',
  ],
  baseStyle: ({ theme }) => ({
    accordion_details: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-xl'],
        fontFamily: theme.fontFamily.primaryNormal,
        fontSize: theme.fontSizes.lg,
        fontWeight: 400,
        lineHeight: theme.lineHeights.lg,
        textTransform: 'capitalize',
        display: 'flex',
        alignItems: 'center',
        svg: {
          p: theme.space.s,
          mr: theme.space.mar,
          boxSizing: 'content-box',
          border: '1px solid #DBDBDB' /* doesn't exist in design token */,
          borderRadius: '50%',
        },
      },
    },
    accordionSVG: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: '20px 0px',
        svg: {
          width: 'var(--spacing-4)',
          height: 'var(--spacing-4)',
          color: theme.colors.main.primary,
        },
      },
    },
    productDetails: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        order: -2,
        borderBottomWidth: 0,
        borderTopWidth: 0,
        '&:last-of-type': {
          borderBottom: '0',
        },
      },
    },
    editorNotes: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        order: -1,
        '&:last-of-type': {
          borderBottomWidth: 0,
        },
      },
    },
    accordionWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: 0,
      },
    },
    shippingReturns: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& .ship-text': {
          ...theme.typography['text-body1-m'],
          fontFamily: theme.fontFamily.primaryNormal,
          fontWeight: 400,
          fontSize: theme.fontSizes.sm,
          lineHeight: theme.lineHeights.xl,
          my: 'var(--spacing-4)',
          color: theme.colors.main.primary,
        },
      },
    },
    content2TangibleeButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderBottom: 'var(--border-width-s) solid rgba(36, 34, 34, 0.20)',
        pb: '20px' /* doesn't exist in design token */,
      },
    },
    tangibleeButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderBottom: 0,
        pb: 0,
      },
    },
    productPropertiesWrapper: () => ({
      px: 0,
      pb: 0,
      paddingTop: 0,
      '#description1': {
        ...theme.typography['text-body1-m'],
        fontFamily: theme.fontFamily.primaryNormal,
        fontWeight: 400,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.xl,
        color: theme.colors.main.primary,
        mt: '15px',
        mb: '12px',
      },
      '#description1 > div': {
        ...theme.typography['text-body1-m'],
        fontFamily: theme.fontFamily.primaryNormal,
        fontWeight: 400,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.xl,
        mt: 0,
        '.product-care-content': {
          mb: '10.5px',
        },
      },
    }),
    productCareWrapperV3: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: 'var(--spacing-4) 0 var(--spacing-3)',
        borderTop: 'var(--border-width-s) solid rgba(36, 34, 34, 0.20)',
      },
    },
    productCareWrapperV3WithProductDetails: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: '1px 0 2px',
        marginTop: 'var(--spacing-4)',
        borderTop: 'none',
      },
    },
    productCareHeading: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        textDecoration: 'underline',
        py: 0,
        border: 'none',
        pb: '10px',
      },
    },
    propertiesHtmlContent: {
      'li,a,u,strong': {
        fontFamily: theme.fontFamily.primaryNormal,
        fontWeight: 400,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.xl,
        color: theme.colors.main.primary,
      },
    },
    propertiesHtmlContentItem: {
      '& > br': {
        display: 'none',
      },
      '.product-props__details': {
        display: 'flex',
        alignItems: 'start',
        position: 'relative',
        py: '18px',
        borderBottom: '1px solid rgba(36, 34, 34, 0.20)',
        '&:last-of-type': {
          border: 'none',
        },
        'h2, h3': {
          flex: '50%',
          ...theme.typography['text-display1-xs'],
          fontFamily: 'var(--font-face1-extended-bold)',
          textTransform: 'none',
          lineHeight: 1,
          fontWeight: 700,
          fontSize: 'var(--text-14)',
          color: theme.colors.main.black,
        },
        ul: {
          flex: '50%',
          li: {
            ...theme.typography['text-body1-m'],
            fontFamily: theme.fontFamily.primaryNormal,
            fontWeight: 400,
            fontSize: theme.fontSizes.sm,
            lineHeight: theme.lineHeights.xl,
            color: theme.colors.main.black,
            textTransform: 'none',
          },
        },
      },
    },
  }),
}
