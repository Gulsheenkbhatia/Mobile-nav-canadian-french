export default {
  parts: ['bannerMainWrapper', 'bannerArrows', 'bannerContent'],

  baseStyle: ({ theme }) => ({
    bannerMainWrapper: {
      display: 'flex',
      '&.header-promo-banner path': {
        fill: 'var(--color-white-base)',
      },
      '@media (min-width: 1334px)': {
        '&.header-promo-banner': {
          '.btn-prev': {
            left: 'calc((100vw - 1334px)/2)',
          },
          '.btn-next': {
            right: 'calc((100vw - 1334px)/2)',
          },
        },
      },
      '.promo-item-wrapper': {
        margin: '0 auto',
        width: '100%',
        padding: '0 2rem',
        textAlign: 'center',
        color: 'var(--color-white-base)',
        fontSize: 'var(--text-10)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-l)',
        '@media (max-width: 544px)': {
          padding: '0 .5rem',
        },
      },
    },
    bannerTemplateWrapper: {
      width: '1344px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      padding: '0 var(--spacing-3)',
      '& .promo-item-wrapper': {
        fontSize: theme.fontSizes['2xs'],
        lineHeight: theme.lineHeights.short,
        letterSpacing: theme.letterSpacings.wider,
      },
      '@media (max-width: 544px)': {
        padding: '0 1.5rem',
      },
    },
    bannerContainer: {
      width: '1256px',
      margin: '0 auto',
      '@media (max-width: 1334px)': {
        width: 'calc(100% - 56px)',
      },
    },
    bannerArrows: {
      '& svg': {
        position: 'absolute',
        width: '24px',
        height: '24px',
        transform: 'scale(1.4)',
        color: 'var(--color-white-base)',
        '&.left-arrow': { left: '24px' },
        '&.right-arrow': { right: '24px' },
      },
      '&.splide__arrow--prev svg': {
        width: '24px !important',
        height: '24px !important',
      },
      '&.splide__arrow--next svg': {
        width: '24px !important',
        height: '24px !important',
      },
    },
    bannerTemplateArrows: {
      '& [class*="chevron-left"]': {
        left: '-2rem',
      },
      '& [class*="chevron-right"]': {
        right: '-2rem',
      },
      '@media (max-width: 769px)': {
        '& [class*="chevron-left"]': {
          left: '-1rem',
        },
        '& [class*="chevron-right"]': {
          right: '-1rem',
        },
      },
    },
    bannerContent: {
      color: theme.colors.main.white,
      fontSize: theme.fontSizes.xxs,
      lineHeight: theme.lineHeights.xl,
      letterSpacing: theme.letterSpacings.lg,
      my: 'auto',
      textAlign: 'center',
    },
  }),
}
