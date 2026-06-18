export default {
  parts: ['accordion_details'],
  baseStyle: ({ theme }) => ({
    accordion_details: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-l'],
        display: 'flex',
        alignItems: 'center',
        svg: {
          mr: '11px' /* doesn't exist in design token */,
          width: '16px',
          height: '16px',
        },
      },
    },
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      productPropertiesWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          padding: '0 0 21px',
          '#description2': {
            paddingTop: '1px !important',
            '& br': {
              display: 'none',
            },
            '& .product-props__details': {
              padding: '21px 0 20px',
              borderTop: 'var(--border-width-s) solid rgba(36, 34, 34, 0.20)',
            },
            '& h2': {
              ...theme.typography['text-display1-xs'],
              textTransform: 'Capitalize',
            },
            '& li': {
              color: 'var(--color-black-base)',
              fontWeight: 500,
            },
          },
          '#description1': {
            pt: 'var(--spacing-4)',
            ...theme.typography['text-body2-m'],
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
    }),
  },
}
