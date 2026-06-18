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
        fontSize: 'var(--text-20)',
        lineHeight: 'var(--line-height-135)',
        display: 'flex',
        alignItems: 'center',
        svg: {
          p: 'var(--spacing-2)',
          mr: '11px',
          boxSizing: 'content-box',
          border: 'var(--border-width-s) solid #DBDBDB' /* doesn't exist in design token */,
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
          path: {
            fill: 'var(--color-black-base)',
          },
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
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          lineHeight: 'var(--line-height-140)',
          margin: 0,
          padding: 'var(--spacing-4) 0 0',
          color: 'var(--color-black-base)',
        },
      },
    },
    productCareWrapperV3: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: '18.5px 0 var(--spacing-3)',
        marginTop: '18px',
        borderTop: 'var(--border-width-s) solid rgba(36, 34, 34, 0.20)',
      },
    },
    productCareWrapperV3WithProductDetails: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: '1px 0 2px',
        marginTop: '18px',
        borderTop: 'none',
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
    propertiesHtmlContentItem: {
      '.product-props__details': {
        'h2, h3': {
          ...theme.typography['text-link3-s'],
          textDecoration: 'none',
        },
      },
    },
    productPropertiesWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: '0 0 21px',
        '#description2': {
          pt: '20px',
          '& br': {
            display: 'none',
          },
          '& .product-props__details': {
            padding: '18px 0 14px',
            '&:last-of-type': {
              paddingBottom: 0,
            },
          },
          '& .product-props__details:not(:first-of-type)': {
            borderTop: 'var(--border-width-s) solid rgba(36, 34, 34, 0.20)',
          },
          '& .product-props__details:first-of-type': {
            pt: 0,
          },
          '& h2': {
            fontFamily: 'var(--font-face1-extended-bold)',
            fontSize: 'var(--text-14)',
            letterSpacing: 'var(--letter-spacing-xs)',
            lineHeight: 1,
            fontWeight: 700,
            textTransform: 'Capitalize',
          },
          '& li': {
            color: 'var(--color-black-base)',
          },
        },
        '#description1': {
          pt: 'var(--spacing-4)',
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          lineHeight: 'var(--line-height-140)',
          color: 'var(--color-black-base)',
          productCareWrapper: {
            border: 'none',
          },
          '& li': {
            fontFamily: 'var(--font-face1-normal)',
          },
        },
      },
    }),

    productCareHeading: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 1,
        padding: 0,
        color: 'var(--color-black-base)',
      },
    },
    editorWrapper: {
      marginTop: '14px',
      paddingBottom: '26px',
      '&.productCareActive': {
        paddingBottom: '5px',
      },
    },
  }),
}
