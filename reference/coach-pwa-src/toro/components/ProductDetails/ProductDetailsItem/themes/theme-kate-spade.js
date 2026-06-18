import RulerIconSrc from 'components/assets/ks-tangiblee-bag.png'

export default {
  parts: [
    'tangibleeButtonTabbedPDP',
    'tabbedPDPWrapper',
    'content2TangibleeButton',
    'productPropertiesWrapper',
    'editorDescriptions',
  ],
  baseStyle: ({ theme }) => ({
    rulerIconSrc: RulerIconSrc,
    accordion_details: {
      ...theme.typography['text-body1-m'],
    },
    productPropertiesText: {
      ...theme.typography['text-body2-m'],
      fontWeight: 'normal',
    },
    productPropertiesWrapper: () => ({
      '#product-details > div': {
        marginLeft: 0,
      },
    }),
    accordianItem: {
      borderColor: 'var(--color-inactive)',
      '.ship-text::first-letter, li::first-letter, #description1::first-letter': {
        textTransform: 'capitalize',
      },
    },
    accordionSVG: {
      svg: {
        marginRight: 'var(--spacing-1)',
      },
    },
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      tangibleeButtonTabbedPDP: {
        '.tangiblee-cta_title--details': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontSize: 'var(--text-16)',
            textTransform: 'unset',
          },
        },
      },
      tabbedPDPWrapper: {
        '#description1, #description2': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            paddingTop: '0',
          },
        },
      },
      content2TangibleeButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderBottom: 'var(--border-width-s) solid var(--color-neutral-light-2)',
        },
      },

      productPropertiesWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '#description2': {
            '& br': {
              display: 'none',
            },
            '& .product-props__details': {
              padding: 'var(--spacing-6) 0 var(--spacing-6) 0',
            },
            '& .product-props__details:not(:first-of-type)': {
              borderTop: 'var(--border-width-s) solid var(--color-neutral-light-2)',
            },

            '& h2': {
              ...theme.typography['text-body2-m'],
              textTransform: 'none',
            },
            '& li': {
              color: 'var(--color-black-base)',
              ...theme.typography['text-body1-s'],
            },
          },
        },
      }),
      editorHeaderText: {
        ...theme.typography['text-body2-m'],
        fontWeight: 500,
      },
      editorWrapper: {
        padding: 'var(--spacing-6) 0 var(--spacing-6) 0',
        borderColor: 'var(--color-neutral-light-2)',
        '&.productCareActive': {
          paddingBottom: 'var(--spacing-6)',
        },
      },
      editorDescriptions: {
        ...theme.typography['text-body1-s'],
      },
    }),
  },
}
