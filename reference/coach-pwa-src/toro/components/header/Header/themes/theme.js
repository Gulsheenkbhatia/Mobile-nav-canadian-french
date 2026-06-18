const iconStylesV2 = {
  '& svg use[href="#icon-menuSearchV2"]': {
    transform: 'scale(1.1) translateY(-10%)',
  },
  '& svg use[href="#icon-menu-coachtopiaV2"]': {
    transform: 'scale(1.2) translateY(-13%)',
  },
  '& svg use[href="#icon-bagV2"]': {
    transform: 'translateX(-2px) translateY(-15%) scale(1.3)',
  },
}

export default {
  parts: [
    'headerPageContainer',
    'headerPageInnerContainer',
    'miniCartPopUpPosition',
    'styleForStickyHeader',
    'scrollableHeaderContainer',
    'headerFullBleed',
    'headerDynamicAssetContrast',
    'coachOneTabPDPMobile',
  ],
  baseStyle: ({ theme }) => ({
    headerPageContainer: {
      boxShadow: 'none',
      '& svg:focus': {
        outline: 'none',
      },
    },
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
      '&.transparentHeader': {
        '& svg path': {
          fill: 'var(--color-white-base)',
        },
        '& svg use[href="#icon-bagV2"], & svg use[href="#icon-menuSearchV2"], & svg use[href="#icon-searchV2"], & svg use[href="#icon-accountV2"]':
          {
            fill: 'var(--color-white-base)',
          },
        '& .chakra-input__group': {
          backgroundColor: 'transparent',
          borderColor: 'var(--color-white-base)',
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
      '&:has(.exposed-search-wrapper)': {
        boxShadow: 'none',
      },
      backgroundColor: theme.colors.main.white,
    }),
    promoBannerNotch: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'absolute',
      width: '100%',
      zIndex: 16,
      '& > button': {
        all: 'unset',
        height: '12px',
        width: '37px',
        borderRadius: '0 0 80px 80px',
        backgroundColor: 'var(--color-black-base)',
        display: 'flex',
        justifyContent: 'center',
        '&:active, &:hover': {
          backgroundColor: 'var(--color-black-base)!important',
        },
        '&:focus-visible': {
          boxShadow: 'none',
        },
        '& svg': {
          transform: 'translate(0px, -1px) scale(1.8)',
          color: 'var(--color-white-base)',
        },
      },
    },
    promoBannerNotchLine: {
      width: '100%',
      backgroundColor: 'var(--color-black-base)',
    },
    miniCartPopUpPosition: (isDesktop, isStaticHeader) => ({
      top: isDesktop ? (isStaticHeader ? '110px' : '70px') : '90px',
      right: isDesktop ? (isStaticHeader ? '37px' : '-11px') : '15px',
    }),
    styleForUpperRows: ({ fixed, promoBannerIsHidden }) => ({
      visibility: fixed ? 'visible' : 'hidden',
      zIndex: '13',
      '& .cms-slot': {
        overflow: 'hidden',
        height: promoBannerIsHidden ? 0 : null,
      },
    }),
    scrollableHeaderContainer: {
      overflowY: 'auto',
      height: '100vh',
      width: '100%',
      position: 'fixed',
      zIndex: '13',
      top: '0px',
      backgroundColor: 'var(--color-white-base)',
    },
    coachOneTabPDPMobile: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '&:has(.one-coach-fade-out)': {
          backgroundColor: 'transparent',
          '& .upper-right-icons svg, .upper-right-icons path': {
            fill: 'var(--color-black-base)',
          },
        },
        '&:has(.one-coach-fade-in)': {
          '&.scrolled-header': {
            '&:after': {
              content: '""',
              position: 'absolute',
              top: '0',
              right: '-12px',
              bottom: 0,
              left: 0,
              zIndex: 1,
              pointerEvents: 'none',
              background: 'var(--chakra-colors-black)',
              opacity: '0.5',
            },
            '& button.active': {
              '&:before': {
                content: '""',
                position: 'absolute',
                backgroundColor: 'transparent',
                bottom: 0,
                left: '-20px',
                height: '10px',
                width: '20px',
                borderBottomRightRadius: '6px',
                boxShadow: `8px 0px 0 ${'var(--color-neutral-light-1)'}`,
              },
              '&:after': {
                content: '""',
                position: 'absolute',
                backgroundColor: 'transparent',
                bottom: 0,
                right: '-20px',
                height: '10px',
                width: '20px',
                borderBottomLeftRadius: '6px',
                boxShadow: `-8px 0px 0 ${'var(--color-neutral-light-1)'}`,
              },
            },
          },
          backgroundColor: 'var(--color-neutral-dark)',
          '& .upper-right-icons svg, .upper-right-icons path': {
            fill: 'var(--color-white-base)',
          },
          '& .bag-icon-container p': {
            color: 'var(--color-white-base)',
          },
        },
      },
    },
  }),
  variants: {
    withBackdrop: ({ theme }) => ({
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
      headerPageInnerContainer: () => ({
        '&.withBackdrop': {
          backgroundColor: 'var(--color-neutral-light-1)',
          color: 'var(--color-black-base)',
          '& p:not(.bag-icon-container p)': {
            color: 'var(--color-black-base)',
          },
          '& svg path:not(.storelocator svg path, .desktop-input-search svg path)': {
            fill: 'var(--color-black-base)',
          },
          '& input#SearchInput::placeholder': {
            color: 'var(--color-black-base) !important',
          },
          '& .menu-tier-1': {
            boxShadow: 'none',
          },
          '& .sub-menu-wrapper': {
            borderRadius: '0px 0px 18px 18px',
          },
        },
        '&:hover': {
          backgroundColor: 'var(--color-white-base)',
          '& .menu-tier-1': {
            boxShadow: theme.boxShadow.header,
          },
        },
        '&:has(.sub-menu-wrapper)': {
          backgroundColor: 'var(--color-white-base)',
        },
        '& .desktop-menu-overlay': {
          display: 'none',
        },
      }),
    }),
    transparentStickyHeader: ({ theme }) => ({
      headerPageInnerContainer: ({
        transparentStickyFadeIn,
        isOneCoachTabbedHeaderActive = false,
      }) => ({
        ...iconStylesV2,
        backgroundColor: isOneCoachTabbedHeaderActive
          ? 'var(--color-neutral-light-2)'
          : transparentStickyFadeIn
          ? theme.colors.main.white
          : 'transparent',
        transition: 'all 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
        '& .storelocator > div': {
          background: 'transparent!important',
        },
      }),
    }),
    globalHeaderV2: ({ theme }) => ({
      headerPageInnerContainer: ({ isOneCoachTabbedHeaderActive = false, isMobile }) => ({
        ...iconStylesV2,
        backgroundColor:
          isMobile && isOneCoachTabbedHeaderActive
            ? 'var(--color-neutral-light-2)'
            : `${theme.colors.main.white}`,
        '&.transparentHeader': {
          backgroundColor: isMobile && isOneCoachTabbedHeaderActive ? 'transparent' : 'initial',
          '& *, & p': {
            backgroundColor: 'transparent',
            color:
              isMobile && isOneCoachTabbedHeaderActive
                ? 'var(--color-black-base)'
                : 'var(--color-white-base)',
          },
          '& .exposed-search-wrapper::before': {
            color: 'var(--color-white-base)',
          },
          '& svg.location_svg__icon-navigation-location path, & svg.hamburger_svg__icon-navigation-hamburger path, & svg use[href="#icon-menu-coachtopiaV2"] path':
            {
              fill: 'var(--color-white-base)',
            },
          '& svg use[href="#icon-bagV2"], & svg use[href="#icon-menuSearchV2"], & svg use[href="#icon-searchV2"], & svg use[href="#icon-menu-coachtopiaV2"]':
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
            backgroundColor:
              isMobile && isOneCoachTabbedHeaderActive
                ? 'var(--color-neutral-light-2) !important'
                : `${theme.colors.main.white}!important`,
            '& *, & p': {
              color: 'var(--color-primary)',
            },
            '& svg path, & svg path:not(.storelocator svg path)': {
              fill: 'var(--color-black-base)',
            },
            '& svg use[href="#icon-bagV2"], & svg use[href="#icon-menuSearchV2"], & svg use[href="#icon-searchV2"], & svg use[href="#icon-accountV2"], & svg use[href="#icon-menu-coachtopiaV2"]':
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
      }),
    }),
    transparentStickyHeaderFullBleed: () => ({
      headerPageInnerContainer: ({ transparentStickyFadeIn }) => ({
        ...iconStylesV2,
        backgroundColor: transparentStickyFadeIn ? 'var(--color-white-base)' : 'transparent',
        transition: 'all 300ms cubic-bezier(0.62, 0.18, 0.38, 0.98)',
        '& .storelocator > div': {
          background: 'transparent!important',
        },
      }),
      headerFullBleed: {
        mixBlendMode: 'difference',
        filter: 'invert(1)',
      },
      headerDynamicAssetContrast: {
        '& svg path': {
          fill: 'var(--color-black-base)',
        },
      },
    }),
  },
}
