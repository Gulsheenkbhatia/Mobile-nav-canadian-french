import ImageRetail from '@tapestry-inc/design-tokens/kate-spade/themes/europe/logo/primary-white.svg'
import ImageOutlet from '@tapestry-inc/design-tokens/kate-spade/themes/europe/logo/ks-outlet-logo-white.svg'

export default {
  baseStyle: () => ({
    buttonProps: {
      '.outletTab': { backgroundColor: 'var(--color-ks-green)' },
    },
    ImageRetail,
    ImageOutlet,
  }),
  variants: {
    oneCoachTabbedHeader: ({ theme, isTransparentHeader, transparentHeaderEnabled }) => ({
      buttonProps: {
        '&.outletTab': {
          backgroundColor: 'var(--color-ks-green)',
          '&.active': {
            'svg, svg path': {
              fill:
                !transparentHeaderEnabled || isTransparentHeader
                  ? 'var(--color-white-base)' || 'var(--color-black-base)'
                  : 'var(--color-black-base)',
            },
            backgroundColor:
              !transparentHeaderEnabled || isTransparentHeader
                ? 'var(--color-ks-green)' ||
                  (isTransparentHeader
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'var(--color-neutral-light-1)')
                : 'var(--color-white-base)',
          },
          '&.active:before': {
            boxShadow: `8px 0.3px 0 ${
              isTransparentHeader
                ? 'transparent'
                : transparentHeaderEnabled
                ? 'var(--color-white-base)'
                : 'var(--color-ks-green)' || 'var(--color-neutral-light-1)'
            }`,
          },
          '&.active::after': {
            boxShadow: `-8px 0.3px 0 ${
              isTransparentHeader
                ? 'transparent'
                : transparentHeaderEnabled
                ? 'var(--color-white-base)'
                : 'var(--color-ks-green)' || 'var(--color-neutral-light-1)'
            }`,
          },
          '&.one-coach-color-tab': {
            backgroundColor: `var(--color-ks-green) !important`,
            '&.active': {
              backgroundColor: `var(--color-ks-green) !important`,
            },
          },
          '&.one-coach-color-tab.active::after': {
            boxShadow: '-8px 0 0 var(--color-ks-green)',
          },
          '&.one-coach-color-tab.active::before': {
            boxShadow: '8px 0 0 var(--color-ks-green)',
          },
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          height: '40px !important',
          marginTop: '0 !important',
        },
        [`@media (min-width: 375px) and (max-width: 389px)`]: {
          padding: 'var(--spacing-4) 0 !important',
        },
        [`@media (min-width: 390px) and (max-width: 413px)`]: {
          padding: 'var(--spacing-4) var(--spacing-1) !important',
        },
        [`@media (min-width: 414px) and (max-width: 429px)`]: {
          padding: 'var(--spacing-4) var(--spacing-2) !important',
        },
        [`@media (min-width: 430px) and (max-width: 440px)`]: {
          padding: 'var(--spacing-4) var(--spacing-2) !important',
        },
      },
      logoPropsRetail: {
        height: '30px',
        width: '110px',
        viewBox: '0 0 112 55',
      },
      logoPropsOutlet: {
        height: '30px',
        width: '110px',
      },
      containerTabs: {
        '&.one-coach-fade-out': {
          '.oneCoachColorAdaptive.outletTab.active': {
            'svg, path': {
              fill: 'var(--color-black-base)',
            },
          },
        },
        '&.one-coach-fade-in': {
          '& button.oneCoachColorAdaptive.outletTab:not(.active)': {
            backgroundColor: 'var(--color-ks-green) !important',
          },
          '& button.active': {
            '&.outletTab': {
              backgroundColor: 'var(--color-ks-green) !important',
            },
          },
        },
      },
    }),
  },
}
