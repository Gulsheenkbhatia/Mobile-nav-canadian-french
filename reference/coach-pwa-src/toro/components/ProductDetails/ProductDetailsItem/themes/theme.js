import RulerIconSrc from 'components/assets/ruler.png'

export default {
  parts: [
    'accordionButton',
    'accordionTextWrapper',
    'accordionText',
    'productPropertiesWrapper',
    'productPropertiesText',
    'propertiesHtmlContentHeading',
    'chevron',
    'productCareWrapper',
    'productCareHeading',
    'productCareModalButton',
    'productCareModalPanel',
    'accordionSVG',
    'rulerIconSrc',
    'productDetails',
    'editorNotes',
    'accordionWrapper',
    'accordianItem',
    'editorWrapper',
    'editorHeaderText',
    'editorDescription',
  ],
  baseStyle: ({ theme }) => ({
    rulerIconSrc: RulerIconSrc,
    accordionButton: {
      p: `${theme.space.m} 0`,
      borderColor: theme.colors.main.inactive,
    },
    accordionTextWrapper: {
      flex: '1',
      textAlign: 'left',
    },
    accordionText: {
      textTransform: 'uppercase',
      color: theme.colors.main.black,
    },
    productPropertiesWrapper: () => ({
      py: theme.space.s,
      px: '0',
      '#product-details>div': {
        marginLeft: 'initial',
      },
    }),
    productPropertiesText: {
      color: theme.colors.neutral.dark,
    },
    propertiesHtmlContent: {
      'li,a,u': {
        listStyle: 'none',
        fontFamily: theme.fontFamily.secondaryNormal,
      },
      '&': {
        fontFamily: theme.fontFamily.secondaryNormal,
      },
      '& a:hover': {
        textDecoration: 'underline',
      },
    },
    propertiesHtmlContentHeading: {
      py: '15px',
      textDecoration: 'underline',
      cursor: 'pointer',
      color: theme.colors.main.primary,
      fontFamily: theme.fontFamily.primaryNormal,
      fontSize: theme.fontSizes.sm,
    },
    propertiesHtmlContentItem: {
      '.product-props__details': {
        display: 'flex',
        position: 'relative',
        paddingTop: '3px',
        paddingBottom: '3px',
        'h2, h3': {
          flex: '50%',
          textTransform: 'uppercase',
          fontFamily: theme.fontFamily.primaryNormal,
          fontSize: theme.fontSizes.sm,
          color: theme.colors.main.black,
        },
        ul: {
          flex: '50%',
          li: {
            fontFamily: theme.fontFamily.primaryNormal,
            fontSize: theme.fontSizes.sm,
            color: '#4A4A4A',
          },
        },
      },
    },
    chevron: () => ({
      transition: '0.2s transform ease',
    }),
    chevronExpanded: {
      transform: 'rotate(-180deg)',
    },
    chevronCollapsed: {
      transform: 'rotate(0)',
    },
    productCareWrapper: {
      p: '20px 0',
    },
    productCareHeading: {
      py: '3px',
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      borderColor: '#000001',
      color: theme.colors.main.primary,
      fontFamily: theme.fontFamily.primaryNormal,
      fontSize: theme.fontSizes.md,
    },
    productCareModalButton: {
      p: 3,
    },
    productCareModalPanel: {
      pb: 4,
    },
    accordion_details: {
      color: 'var(--color-black-base)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-xl)',
      fontFamily: 'var(--font-face1-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontWeight: 'var(--chakra-fontWeights-normal)',
      textTransform: 'capitalize',
    },
    productCareModal: {
      '&.product-care-modal p': {
        fontFamily: 'var(--font-face2-normal)',
      },
      '&.product-care-modal p a': {
        fontFamily: 'inherit',
        textDecoration: 'underline',
      },
    },
    productDetails: {
      order: 1,
    },
    editorNotes: {
      order: 2,
      '&:last-of-type': {
        borderBottomWidth: '1px',
      },
    },
    accordionWrapper: {
      w: '100%',
      mt: '12px',
      display: 'flex',
      flexDirection: 'column',
    },
    tangibleeButtonTabbedPDP: {
      paddingBottom: '23px !important',
      '>div': {
        backgroundColor: 'var(--color-white-base)',
        border: '1px solid var(--color-inactive)',
        marginTop: '0',
      },
      '.tangiblee-cta_title--details': {
        color: 'var(--color-black-base)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-115)',
      },
      '.plusIcon path': {
        fill: 'var(--color-black-base) !important',
      },
    },
    tabbedPDPWrapper: {
      '#description1, #description2': {
        paddingTop: 'var(--spacing-6)',
      },
      ':has(.tangiblee-cta)': {
        paddingTop: 'var(--spacing-6)',
        '#description1': {
          paddingTop: '0',
        },
      },
    },
    editorWrapper: {
      borderTop: '1px solid rgba(36, 34, 34, 0.20)',
      paddingTop: '23px',
      paddingBottom: '17px',
      display: 'flex',
      '&.productCareActive': {
        paddingBottom: '25px',
      },
    },
    editorHeaderText: {
      flex: '50%',
      ...theme.typography['text-display1-xs'],
      fontFamily: 'var(--font-face1-extended-bold)',
      textTransform: 'none',
      lineHeight: 1,
      fontWeight: 700,
      fontSize: 'var(--text-14)',
      color: theme.colors.main.black,
    },
    editorDescriptions: {
      ...theme.typography['text-body1-m'],
      fontFamily: theme.fontFamily.primaryNormal,
      fontWeight: 400,
      fontSize: theme.fontSizes.sm,
      lineHeight: theme.lineHeights.xl,
      color: theme.colors.main.black,
      textTransform: 'none',
      '&.editor-notes': {
        overflow: 'hidden',
        display: '-webkit-box',
        lineClamp: 3,
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
      },
    },
    editorReadMoreButton: {
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-12)',
      color: '#000003',
      lineHeight: 'var(--line-height-140)',
      fontWeight: 700,
      textDecoration: 'underline',
      pt: '3px',
    },
  }),
  variants: {
    paidSocial: ({ theme }) => ({
      productDetails: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          border: '1px solid var(--color-inactive)',
          borderBottomWidth: '1px !important',
          borderTopWidth: '1px !important',
          borderRadius: '4px',
          '& #product-details': {
            margin: 'var(--spacing-4) var(--spacing-3)',
          },
          '& #product-details button': {
            backgroundColor: 'var(--color-secondary) !important',
            p: '20px 0 !important',
          },
          '& #product-details .chakra-accordion__item': {
            marginTop: '14px',
          },
          '&:last-of-type': {
            borderBottom: '1px solid var(--color-neutral-inactive)',
          },
        },
      },
      accordionSVG: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          p: '10px !important',
          backgroundColor: 'var(--color-background-cta-hover) !important',
          borderRadius: 'var(--border-radius-s)',
          '&[aria-expanded="true"]': {
            borderBottomRadius: '0px',
          },
        },
      },
      accordion_details: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          svg: {
            backgroundColor: 'var(--color-secondary)',
          },
        },
      },
      propertiesHtmlContent: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          li: {
            p: 'var(--spacing-5) 0',
            borderBottom: '1px solid var(--color-inactive)',
          },
        },
      },
    }),
    adaptiveTabbedPDP: () => ({
      tangibleeButtonTabbedPDP: {
        paddingBottom: 'var(--spacing-6)',
      },
    }),
  },
}
