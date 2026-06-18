import ImageRetail from '@tapestry-inc/design-tokens/coach/logo/primary-black.svg'
import ImageOutlet from '@tapestry-inc/design-tokens/coach-outlet/logo/primary-black.svg'

export default {
  parts: [
    'container',
    'buttonProps',
    'logoPropsRetail',
    'logoPropsCoachtopia',
    'logoPropsOutlet',
    'containerTabs',
  ],
  baseStyle: () => ({
    container: {
      borderColor: 'rgba(0,0,0,0.1)',
      height: '40px',
    },

    buttonProps: {
      height: '40px',
      color: 'black',
      paddingLeft: '0px',
      paddingRight: '0px',
      '&:focus': {
        boxShadow: 'none',
      },
      '&:active': {
        background: 'white',
      },
      'svg, path': {
        fill: '#757575',
      },
      '&.active': {
        'svg, path': {
          fill: 'black',
        },
        borderBottom: `2px solid black`,
      },
      borderBottom: `2px solid transparent`,
      marginRight: '50px',
      '&.isSubBrand': {
        marginRight: '0px',
      },
    },
    logoPropsRetail: {
      height: '8px',
      width: '72px',
      viewBox: '0 0 252 28',
    },
    ImageRetail,
    ImageOutlet,
  }),
  variants: {
    globalHeaderV2: {
      buttonProps: {
        height: '44px',
        color: 'black',
        paddingLeft: '0px',
        paddingRight: '0px',
        marginRight: '24px',
        paddingBottom: '16px',
        borderBottom: `2px solid transparent`,
        '&:focus': {
          boxShadow: 'none',
        },
        '&:active': {
          background: 'white',
        },
        'svg, path': {
          fill: 'var(--color-neutral-dark)',
        },
        '&.isSubBrand': {
          marginRight: '0px',
          paddingBottom: '12px',
        },
        '&.isActive': {
          borderBottom: `2px solid black`,
        },
      },
      logoPropsRetail: {
        height: '10px',
        width: '88px',
        viewBox: '0 0 252 28',
      },
      logoPropsCoachtopia: {
        height: '19px',
        width: '100px',
      },
      container: {
        borderColor: 'rgba(0,0,0,0.1)',
        paddingTop: '0',
        height: '100%',
      },
    },
    oneCoachTabbedHeader: ({
      theme,
      hslColors,
      configuredTabColors,
      isTransparentHeader,
      transparentHeaderEnabled,
    }) => ({
      buttonProps: {
        height: '40px',
        padding: 'var(--spacing-4)',
        marginTop: 0,
        color: 'black',
        marginRight: 'var(--spacing-2)',
        border: 'none',
        borderRadius: '6px 6px 0 0',
        position: 'relative',
        backgroundColor: configuredTabColors?.inActive?.backgroundColor || '#404040',
        '&.active': {
          border: 'none',
          'svg, svg path': {
            fill:
              !transparentHeaderEnabled || isTransparentHeader
                ? configuredTabColors?.active?.textColor || 'var(--color-black-base)'
                : 'var(--color-black-base)',
          },
          backgroundColor:
            !transparentHeaderEnabled || isTransparentHeader
              ? configuredTabColors?.active?.backgroundColor ||
                (isTransparentHeader ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-neutral-light-1)')
              : 'var(--color-white-base)',
        },
        '&.active:before': {
          content: '""',
          position: 'absolute',
          backgroundColor: 'transparent',
          bottom: 0,
          left: '-20px',
          height: '10px',
          width: '20px',
          borderBottomRightRadius: '6px',
          boxShadow: `8px 0.3px 0 ${
            isTransparentHeader
              ? 'transparent'
              : transparentHeaderEnabled
              ? 'var(--color-white-base)'
              : configuredTabColors?.active?.backgroundColor || 'var(--color-neutral-light-1)'
          }`,
        },
        '&.active::after': {
          content: '""',
          position: 'absolute',
          backgroundColor: 'transparent',
          bottom: 0,
          right: '-20px',
          height: '10px',
          width: '20px',
          borderBottomLeftRadius: '6px',
          boxShadow: `-8px 0.3px 0 ${
            isTransparentHeader
              ? 'transparent'
              : transparentHeaderEnabled
              ? 'var(--color-white-base)'
              : configuredTabColors?.active?.backgroundColor || 'var(--color-neutral-light-1)'
          }`,
        },
        '&:focus': {
          boxShadow: 'none',
        },
        '&:active': {
          background: 'white',
        },
        'svg, path': {
          fill: configuredTabColors?.inActive?.textColor || 'var(--color-white-base)',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          height: '32px !important',
          padding: 'var(--spacing-3) var(--spacing-4) !important',
          marginTop: 'var(--spacing-2) !important',
          marginRight: 'var(--spacing-4) !important',

          '&.transparent-header': {
            backgroundColor: 'transparent',
            '&.active': {
              backgroundColor:
                configuredTabColors?.active?.backgroundColor ||
                (isTransparentHeader
                  ? 'rgba(255, 255, 255, 0.25)'
                  : 'var(--color-neutral-light-1)'),
            },
          },
        },
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '&.oneCoachColorAdaptive': {
            backgroundColor: ` ${hslColors?.second} !important`,
            '&:before': {
              content: 'unset',
            },
            '&:after': {
              content: 'unset',
            },
            'svg, path': {
              fill: 'var(--color-neutral-dark)',
            },
            '&.active': {
              backgroundColor: isTransparentHeader
                ? 'transparent'
                : ` ${hslColors?.main} !important`,
            },
          },
        },
        [`@media (min-width: 375px) and (max-width: 389px)`]: {
          padding: 'var(--spacing-4) var(--spacing-2) !important',
          marginRight: 'var(--spacing-3) !important',
        },
        [`@media (min-width: 390px) and (max-width: 413px)`]: {
          padding: 'var(--spacing-4) var(--spacing-3) !important',
          marginRight: 'var(--spacing-2) !important',
        },
        [`@media (min-width: 414px) and (max-width: 429px)`]: {
          padding: 'var(--spacing-4) !important',
          marginRight: 'var(--spacing-2) !important',
        },
        [`@media (min-width: 430px) and (max-width: 440px)`]: {
          padding: 'var(--spacing-4) !important',
          marginRight: '15px !important',
        },
        '&.one-coach-color-tab': {
          backgroundColor: `#404040 !important`,
          '&.active': {
            backgroundColor: `var(--color-white-base) !important`,
          },
        },
        '&.one-coach-color-tab.active::after': {
          boxShadow: '-8px 0 0 var(--color-white-base)',
        },
        '&.one-coach-color-tab.active::before': {
          boxShadow: '8px 0 0 var(--color-white-base)',
        },
      },
      logoPropsRetail: {
        height: '8px',
        width: '74px',
        viewBox: '0 0 252 28',
      },
      logoPropsOutlet: {
        height: '8px',
        width: '124px',
      },
      container: {
        backgroundColor: configuredTabColors?.inActive?.backgroundColor || '#404040',
        paddingTop: '0',
        height: '100%',
        borderColor: 'transparent',
      },
      containerTabs: {
        '&.one-coach-fade-out': {
          '& button:not(.active)': {
            visibility: 'hidden',
          },
          '& button.active': {
            backgroundColor: 'transparent !important',
          },
        },
        '&.one-coach-fade-in': {
          '& button': {
            transition: 'background-color 300ms ease-out',
          },
          '& button.oneCoachColorAdaptive:not(.active)': {
            backgroundColor: 'var(--color-neutral-dark) !important',
            'svg, path': {
              fill: 'var(--color-white-base)',
            },
          },
          '& button.active': {
            backgroundColor: 'var(--color-neutral-light-1) !important',
            '&:before': {
              content: '""',
            },
            '&:after': {
              content: '""',
            },
          },
        },
      },
    }),
  },
}
