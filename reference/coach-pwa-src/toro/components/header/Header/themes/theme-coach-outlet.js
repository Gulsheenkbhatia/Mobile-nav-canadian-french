export default {
  parts: [
    'headerPageInnerContainer',
    'miniCartPopUpPosition',
    'styleForStickyHeader',
    'headerPageContainer',
  ],
  baseStyle: ({ theme }) => ({
    miniCartPopUpPosition: (isDesktop, isStaticHeader) => ({
      right: isDesktop ? (isStaticHeader ? '37px' : '-11px') : '15px',
      top: isDesktop ? (isStaticHeader ? '110px' : '75px') : '90px',
    }),
    styleForStickyHeader: ({
      isStickyHeader,
      bannerHeight,
      isHeaderHidden,
      isTransparentHeader,
    }) => {
      return (
        isStickyHeader && {
          position: isTransparentHeader ? 'fixed' : 'sticky',
          top: isTransparentHeader || isHeaderHidden ? 'initial' : -bannerHeight,
          width: '100%',
          zIndex: 21,
          transition: 'top 150ms ease-in-out',
        }
      )
    },
    headerPageInnerContainer: () => ({
      backgroundColor: `${theme.colors.main.white}`,
      '&.transparentHeader': {
        '& *, & p': {
          backgroundColor: 'transparent',
          color: 'var(--color-white-base)',
        },
        '& svg path, & svg.hamburger_svg__icon-navigation-hamburger path': {
          fill: 'var(--color-white-base)',
        },
        '& svg use[href="#icon-bagV2"], & svg use[href="#icon-menuSearchV2"], & svg use[href="#icon-searchV2"]':
          {
            fill: 'var(--color-white-base)',
          },
        '& svg use[href="#icon-accountV2"]': {
          fill: 'var(--color-white-base)',
        },
        '& .chakra-input__group': {
          borderColor: 'var(--color-white-base)',
        },
        '& .storelocator .chakra-tabs': {
          backgroundColor: 'transparent',
        },
        '& .storelocator button.active': {
          borderBottomColor: 'var(--color-white-base)!important',
        },
        '& input#SearchInput::placeholder': {
          color: 'var(--color-white-base)',
        },
        '&.headerV2FadeIn': {
          backgroundColor: `${theme.colors.main.white}!important`,
          '& *, & p': {
            color: 'var(--color-primary)',
          },
          '& svg path, & svg path:not(.storelocator svg path)': {
            fill: 'var(--color-black-base)',
          },
          '& svg use[href="#icon-bagV2"], & svg use[href="#icon-menuSearchV2"], & svg use[href="#icon-searchV2"], & svg use[href="#icon-accountV2"]':
            {
              fill: 'var(--color-black-base)',
              stroke: 'none',
            },
          '& svg.hamburger_svg__icon-navigation-hamburger path': {
            fill: 'var(--color-primary)!important',
          },
          '& .chakra-input__group': {
            borderColor: 'var(--color-neutral-light-2)',
            backgroundColor: 'var(--color-neutral-light)',
          },
          '& .storelocator button.active': {
            borderBottomColor: 'var(--color-primary)!important',
          },
          '& input#SearchInput::placeholder': {
            color: 'var(--color-neutral-dark)!important',
          },
        },
      },

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        '&.transparentHeader': {
          boxShadow: 'none',
        },
      },
      '&:not(.transparentHeader)': {
        boxShadow: theme.boxShadow.header,
      },
    }),
  }),
  variants: {
    withBackdrop: () => ({
      headerPageContainer: {
        '&:has(div.headerPageInnerContainer)': {
          '& button.one-coach-color-tab.active': {
            backgroundColor: 'var(--color-neutral-light-1) !important',
            '&::after': {
              boxShadow: '-8px 0 0 var(--color-neutral-light-1) !important',
            },
            '&::before': {
              boxShadow: '8px 0 0 var(--color-neutral-light-1) !important',
            },
          },
        },
        '&:has(div.headerPageInnerContainer:hover)': {
          '& button.one-coach-color-tab.active': {
            backgroundColor: 'var(--color-white-base) !important',
            '&::after': {
              boxShadow: '-8px 0 0 var(--color-white-base) !important',
            },
            '&::before': {
              boxShadow: '8px 0 0 var(--color-white-base) !important',
            },
          },
        },
      },
    }),
  },
}
