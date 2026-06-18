export const baseStyles = {
  productCardWrapper: {
    width: '260px',
    position: 'relative',
    flexDirection: 'column',
    borderRadius: 'var(--border-radius-l)',
    overflow: 'hidden',
    backgroundColor: 'var(--color-page-bg, #F0F0F0)',
    boxShadow:
      '0px 10px 22px 0px #00000008, 0px 40px 40px 0px #00000008, 0px 90px 54px 0px #00000005, 0px 161px 64px 0px #00000000, 0px 251px 70px 0px #00000000',
  },
  productCardBodyContainer: {
    width: '100%',
    flexGrow: 1,
    height: '367px',
    marginTop: '65px',
  },
  productCardImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 'auto',
    zIndex: 2,
  },
  productCardImage: {
    width: '100%',
    objectFit: 'contain',
    height: 'auto',
  },
  productCardTangibleeWrapper: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translate(-50%, 0)',
    zIndex: 2,
  },
}
export default {
  parts: [
    'productCardWrapper',
    'productCardBodyContainer',
    'productCardImageWrapper',
    'productCardTangibleeWrapper',
    'productCardTitleContainer',
    'productCardImage',
  ],
  baseStyle: ({ theme }) => ({
    ...baseStyles,
    productCardBodyContainer: {
      ...baseStyles.productCardBodyContainer,
      '& > h2': {
        ...theme.typography['text-display4-xxs'],
        textAlign: 'center',
        fontWeight: '700',
        color: 'var(--color-white-base)',
        marginBottom: 0,
        whiteSpace: 'pre-line',
        display: 'block!important',
        mixBlendMode: 'difference',
        position: 'absolute',
        zIndex: 3,
        top: '32px',
        width: '100%',
      },
    },
  }),
  variants: {
    handleStrap: {
      productCardImageWrapper: {
        transform: 'none',
        _groupHover: {
          transform: 'translateY(32px)',
        },
      },
      productCardBodyContainer: {
        alignItems: 'flex-end',
        marginBottom: '23px',
      },
    },
  },
}
