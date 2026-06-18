export default {
  parts: [],
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
          mr: 'var(--spacing-3)',
          boxSizing: 'content-box',
          border: 'var(--border-width-s) solid #DBDBDB',
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
          mr: 0,
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
          color: 'var(--color-black-base)',
          padding: 0,
          mt: 'var(--spacing-4)',
          mb: 0,
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
        pb: '21px',
        '& .tangiblee-cta_title--details': {
          ...theme.typography['text-eyebrow1-l'],
          fontWeight: 500,
        },
      },
    },
    tangibleeButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderBottom: 'var(--border-width-s) solid rgba(36, 34, 34, 0.20)',
        pb: '21px',
        '& .tangiblee-cta_title--details': {
          ...theme.typography['text-eyebrow1-l'],
          fontWeight: 500,
        },
      },
    },
    productPropertiesWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: '0 0 20px',
        '#description2': {
          pt: '18px',
          '& br': {
            display: 'none',
          },
          '& .product-props__details': {
            padding: '18px 0 var(--spacing-4)',
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
            ...theme.typography['text-body2-m'],
            fontFamily: 'var(--font-face1-normal)',
            fontWeight: 700,
            textTransform: 'Capitalize',
          },
          '& li': {
            color: 'var(--color-black-base)',
          },
          '& li > br': {
            display: 'block',
          },
        },
        '#description1': {
          ...theme.typography['text-body1-m'],
          color: 'var(--color-black-base)',
          pt: 'var(--spacing-4)',
          productCareWrapper: {
            border: 'none',
          },
          '& li': {
            fontFamily: 'var(--font-face1-normal)',
          },
        },
      },
    }),
    propertiesHtmlContentItem: {
      '.product-props__details': {
        ul: {
          li: {
            ...theme.typography['text-body1-m'],
          },
        },
      },
    },

    productCareHeading: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-m'],
        color: 'var(--color-black-base)',
        lineHeight: 1,
        padding: 0,
      },
    },
  }),
}
