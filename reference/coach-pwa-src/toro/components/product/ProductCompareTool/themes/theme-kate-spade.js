import { TemplateName } from 'toro/constants/templates'

export default {
  baseStyle: ({ theme }) => ({
    headerTitle: {
      fontFamily: 'var(--font-face1-bold)',
      fontWeight: 700,
    },
    productName: {
      ...theme.typography['text-body1-s'],
      fontWeight: 400,
      textAlign: 'unset',
    },
    prictText: {
      fontFamily: 'var(--font-face1-bold)',
      fontWeight: 700,
      textAlign: 'unset',
    },
  }),
  variants: {
    [TemplateName.pdpv5_1]: ({ theme }) => ({
      linkWrapper: {
        marginLeft: 0,
        width: '100%',
        maxWidth: '270px',
        minWidth: 0,
      },
      currentProductBadge: {
        width: 'auto',
        position: 'absolute',
        top: '-36px',
        padding: 'var(--spacing-3) var(--spacing-6)',
        left: '50%',
        marginRight: '-50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--color-white-base)',
        color: 'var(--color-black-base)',
        ...theme.typography['text-body2-l'],
        fontSize: 'var(--text-16)',
        fontWeight: 500,
        lineHeight: 'var(--line-height-135)',
        textAlign: 'center',
        borderRadius: '130px',
        border: '1px solid var(--color-neutral-light-2)',
        '&::after': {
          display: 'none',
        },
      },
      skeletonImageWrapper: {
        width: '100%',
        aspectRatio: '4/5',
      },
      productItem: {
        width: '100%',
        paddingX: 'var(--spacing-3)',
        paddingBottom: 'var(--spacing-8)',
        textAlign: 'center',
        maxWidth: '270px',
      },
      currentProductItem: {
        paddingX: 0,
        paddingBottom: 'var(--spacing-8)',
        '.product-image': {
          maxWidth: '100%',
          marginBottom: '20px',
          borderRadius: 'var(--border-radius-l)',
          overflow: 'hidden',
        },
      },
      productImage: {
        paddingX: 'var(--spacing-3)',
      },
      productName: {
        marginTop: 0,
        marginBottom: 'var(--spacing-1)',
        textAlign: 'center',
        ...theme.typography['text-body1-l'],
      },
      prictText: {
        marginTop: 'var(--spacing-1)',
        marginBottom: '18px',
        textAlign: 'center',
        ...theme.typography['text-body1-s'],
        lineHeight: 'var(--line-height-140)',
      },
      addToBagButton: {
        button: {
          padding: 'var(--spacing-3) var(--spacing-6)',
          p: {
            ...theme.typography['text-body2-l'],
            fontSize: 'var(--text-16)',
            fontWeight: 500,
            lineHeight: 'var(--line-height-135)',
          },
        },
      },
      colorSwatchWrapper: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        marginTop: '18px',
        marginBottom: '18px',
      },
      productColorImage: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        textAlign: 'center',
      },
      colorText: {
        ...theme.typography['text-body1-s'],
        lineHeight: 'var(--line-height-140)',
        textDecorationLine: 'underline',
        color: 'var(--color-neutral-medium)',
      },
      productMaterialWrapper: {
        paddingX: 'var(--spacing-3)',
        paddingY: 'var(--spacing-8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
      productMaterialImage: {
        '& img': {
          width: '60px',
          height: '60px',
        },
      },
      productMaterialTitle: {
        marginBottom: 'var(--spacing-1)',
        ...theme.typography['text-display2-xs'],
        fontWeight: 400,
      },
      productWhatFitsInsideTitle: {
        ...theme.typography['text-display2-xs'],
        fontWeight: 400,
      },
      productMaterialItem: {
        '&:not(:last-of-type)': {
          marginBottom: 'var(--spacing-1)',
        },
      },
      producWhatFitsInsideWrapper: {
        paddingY: 'var(--spacing-8)',
      },

      featuresWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingTop: 'var(--spacing-8)',
        paddingBottom: 'var(--spacing-8)',
        borderTop: '1px solid var(--color-neutral-light-2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '0px',
        marginRight: '0px',
      },
      featuresTitle: {
        ...theme.typography['text-display2-xs'],
        fontWeight: 400,
        textAlign: 'center',
        display: 'flex',
      },
      featuresItems: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0px',
      },
      featuresItem: {
        textAlign: 'center',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-10)',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
      productMeasurementSpecsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingTop: 'var(--spacing-4)',
        paddingBottom: 'var(--spacing-4)',
        borderTop: '1px solid var(--color-neutral-light-2)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          paddingTop: 'var(--spacing-8)',
          paddingBottom: 'var(--spacing-8)',
        },
      },
      productMeasurementSpecsTitle: {
        ...theme.typography['text-display2-xs'],
        fontWeight: 400,
        color: 'var(--color-black-base)',
        textAlign: 'center',
        fontFeatureSettings: "'liga' off, 'clig' off",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      },
      productMeasurementSpecsItem: {
        color: 'var(--color-black-base)',
        textAlign: 'center',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-10)',
        fontWeight: 400,
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    }),
  },
}
