export default {
  parts: [
    'productCardWrapper',
    'productCardBodyContainer',
    'productCardImageWrapper',
    'productCardTangibleeWrapper',
  ],
  baseStyle: ({ theme }) => ({
    productCardWrapper: {
      aspectRatio: '359 / 617',
      width: 'auto',
      height: 'calc(100vh - 350px)',
      minHeight: '425px',
      position: 'relative',
      flexDirection: 'column',
      borderRadius: '24px',
      overflow: 'hidden',
      border: '1.5px solid var(--color-neutral-light-2)',
      backgroundColor: 'var(--color-page-bg, #F0F0F0)',
      boxShadow:
        '0px 251px 70px 0px rgba(0, 0, 0, 0.00), 0px 161px 64px 0px rgba(0, 0, 0, 0.00), 0px 90px 54px 0px rgba(0, 0, 0, 0.02), 0px 40px 40px 0px rgba(0, 0, 0, 0.03), 0px 10px 22px 0px rgba(0, 0, 0, 0.03)',
      '&:hover': {
        '.productCardHeaderContainer > h2 + h3': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },
    },
    productCardTitleContainer: {
      flexDirection: 'column',
      padding: '28px 22px var(--spacing-4)',
      position: 'relative',
      zIndex: 3,
      '& > h3': {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-12)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-xxs)',
        letterSpacing: 'var(--letter-spacing-s)',
        fontWeight: 'normal',
        color: 'var(--color-neutral-medium)',
        marginBottom: '5px',
      },
      '& > h2': {
        ...theme.typography['text-display4-s'],
        fontWeight: '700',
        color: 'var(--color-black-base)',
        marginBottom: 0,
        whiteSpace: 'pre-line',
        [`@media (max-height: 864px)`]: {
          fontSize: 'var(--text-16)',
        },
      },
      '& > h2 + h3': {
        ...theme.typography['text-body1-l'],
        marginBottom: 0,
        marginTop: 'var(--spacing-2)',
        transition: 'all 400ms ease-in-out',
        opacity: 0,
        transform: 'translateY(-10px)',
        position: 'absolute',
        bottom: '-10px',
        [`@media (max-height: 864px)`]: {
          fontSize: 'var(--text-12)',
        },
      },
    },
    productCardBodyContainer: {
      width: '100%',
      flexGrow: 1,
    },
    productCardImageWrapper: {
      position: 'relative',
      width: '100%',
      height: 'auto',
      transition: 'all 400ms ease-in-out',
      zIndex: 2,
      _groupHover: {
        transform: 'translateY(25px)',
      },
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
