import { keyframes, css } from '@emotion/react'

const dotAnimation = keyframes`
  0% { content: ""; }
  33% { content: "."; }
  66% { content: ".."; }
  100% { content: "..."; }
`

const iconBounce = keyframes`
  0%,20%,53%,to {
    -webkit-animation-timing-function: cubic-bezier(.215,.61,.355,1);
    animation-timing-function: cubic-bezier(.215,.61,.355,1);
    -webkit-transform: translateZ(0);
    transform: translateZ(0)
  }
  40%,43% {
    -webkit-animation-timing-function: cubic-bezier(.755,.05,.855,.06);
    animation-timing-function: cubic-bezier(.755,.05,.855,.06);
    -webkit-transform: translate3d(0,-10px,0) scaleY(1.1);
    transform: translate3d(0,-10px,0) scaleY(1.1)
  }
  70% {
    -webkit-animation-timing-function: cubic-bezier(.755,.05,.855,.06);
    animation-timing-function: cubic-bezier(.755,.05,.855,.06);
    -webkit-transform: translate3d(0,-5px,0) scaleY(1.05);
    transform: translate3d(0,-5px,0) scaleY(1.05)
  }
  80% {
    -webkit-transform: translateZ(0) scaleY(.95);
    transform: translateZ(0) scaleY(.95);
    -webkit-transition-timing-function: cubic-bezier(.215,.61,.355,1);
    transition-timing-function: cubic-bezier(.215,.61,.355,1)
  }
  90% {
    -webkit-transform: translate3d(0,-3px,0) scaleY(1.02);
    transform: translate3d(0,-3px,0) scaleY(1.02)
  }
`

const GRADIENT_STOPS = '#E64040 0%, #E6B440 25%, #40CAE6 50%, #D040E6 75%, #672EEE 100%'

const gradientAngleRotate = keyframes`
  0% { --prompt-gradient-angle: 0deg; }
  100% { --prompt-gradient-angle: 360deg; }
`

export const promptGradientAngleProperty = css`
  @property --prompt-gradient-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
`

const slideInUp = keyframes`
  0% {
    -webkit-transform:translate3d(0,100%,0);
    transform:translate3d(0,100%,0);
    visibility:visible
  }
  to {
    -webkit-transform:translateZ(0);
    transform:translateZ(0)
  }
`

const slideOutDown = keyframes`
  0% {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  to {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
    visibility: hidden;
  }
`

const popIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
const scaleUp = keyframes`
  0% { transform: translate(-50%, -50%) scale(0); }
  100% { transform: translate(-50%, -50%) scale(1.2); }
  `

const giftBounce = keyframes`
  0% { transform: translateY(0); }
  20% { transform: translateY(-6px); }
  40% { transform: translateY(0); }
  60% { transform: translateY(-3px); }
  80% { transform: translateY(0); }
  100% { transform: translateY(0); }
`

const heartWind = keyframes`
  0%   { transform: translateX(-15px); }
  25%  { transform: translateX(20px); }
  50%  { transform: translateX(-25px); }
  75%  { transform: translateX(15px); }
  100% { transform: translateX(-10px); }
`

const heartFloat = keyframes`
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    transform: translateY(-120vh) scale(1.1);
    opacity: 0;
  }
`

export default {
  parts: [
    'shellContainer',
    'headerContainer',
    'newChatButton',
    'toggleButton',
    'toggleButtonContainer',
    'productDivider',
    'actions',
    'collapseButton',
    'chatMessageContainer',
    'loading',
    'scrollAnchor',
    'chatIntroContainer',
    'chatIntroDescription',
    'chatIntroContent',
    'info',
    'infoText',
    'wrapper',
    'wrapperUser',
    'wrapperAssistant',
    'bubble',
    'bubbleUser',
    'bubbleTool',
    'bubbleProductResults',
    'bubbleTransparent',
    'messageText',
    'messageTextUser',
    'messageTextAssistant',
    'productImagesContainer',
    'productImageContainerGrid',
    'productImagesTitle',
    'productGrid',
    'productTile',
    'productTileGrid',
    'productTileWrapper',
    'productDetails',
    'productDetailsGrid',
    'productTitle',
    'productPrice',
    'priceContainer',
    'originalPrice',
    'salePrice',
    'discountText',
    'productResults',
    'productResultItem',
    'productResultId',
    'productResultExcerpt',
    'productResultPriceHint',
    'moreProducts',
    'timestamp',
    'viewDetailsButton',
    'thinkingWrapper',
    'thinkingContainer',
    'spadeIcon',
    'thinkingText',
    'chatInputContainer',
    'chatInputWrapper',
    'chatInput',
    'chatSendButtonWrapper',
    'chatSendButton',
    'promptSuggestionsContainer',
    'promptContainer',
    'promptText',
    'chatLauncherContainer',
    'chatLauncherButton',
    'minusIconContainer',
    'chatLauncherContent',
    'chatLauncherText',
    'chatLauncherTextWrapper',
    'chatLauncherTooltip',
    'chatLauncherTooltipBody',
    'chatLauncherTooltipCta',
    'chatLauncherTooltipText',
    'feedbackContainer',
    'feedbackLabel',
    'feedbackButton',
    'feedbackButtonContainer',
    'productImageGallery',
    'productImageItem',
    'productImageContainer',
    'productImageView',
    'debugPanelContainer',
    'debugPanelContainerFilled',
    'debugPanelHeader',
    'debugPanelEmpty',
    'debugPanelEvent',
    'debugPanelEventHeader',
    'debugPanelEventName',
    'debugPanelEventTime',
    'debugPanelEventId',
    'debugPanelTotal',
    'chatToggleButton',
    'errorContainer',
    'errorAlert',
    'errorLeft',
    'errorIcon',
    'errorBody',
    'errorTitle',
    'errorDescription',
    'errorActionButton',
    'errorText',
    'retryButton',
    'promptRow',
    'promptRowTop',
    'promptRowBottom',
    'promptTile',
    'promptTileIconWrapper',
    'promptTileText',
    'promptSuggestionsWrapper',
    'circleContainer',
    'particle',
    'character',
    'chatStarterContainer',
    'centerContent',
    'chatStarterIllustration',
    'chatStarterHeading',
    'giftWrapper',
    'giftHeart',
    'giftHeartWind',
    'promptRowTrackRight',
    'infoDisclaimer',
    'addToBagContainer',
  ],

  baseStyle: ({ theme }) => ({
    shellContainer: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '500px',
      height: 'min(800px, calc(100vh - 40px))',
      boxShadow: '0px 4px 20px rgba(132, 77, 77, 0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overscrollBehavior: 'contain',

      '&.animate-in': {
        animation: `${slideInUp} 0.5s ease-in`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
        },
      },

      '&.is-closing': {
        animation: `${slideOutDown} 0.5s ease-out forwards`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
        },
      },

      [`@media (max-width: ${theme.breakpoints.md})`]: {
        width: '100%',
        height: ['100dvh', '-webkit-fill-available', '100vh'],
        WebkitTransform: 'translateZ(0)',
        WeebkitOverflowScrolling: 'touch',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        bottom: 0,
        right: 0,
        left: 0,
        inset: 0,
      },
      '*': {
        fontSmooth: 'always',
        '--webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
      },
    },
    headerContainer: {
      position: 'absolute',
      width: '100%',
      p: 'var(--spacing-4)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: '100',
      height: 'var(--spacing-20)',
    },

    newChatButton: {
      ...theme.typography['text-body1-l'],
      px: 'var(--spacing-4)',
      py: 'var(--spacing-2)',
      height: 'var(--spacing-10)',
      borderRadius: 'var(--border-radius-full)',
      bg: 'var(--color-white-base)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      textTransform: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-1)',

      _hover: {
        bg: 'var(--color-white-base)',
      },

      _active: {
        bg: 'var(--color-white-base)',
      },
    },

    productDivider: {
      border: 0,
      borderTop: '1px solid var(--color-neutral-light-3)',
      marginTop: 'var(--spacing-6)',
    },

    toggleButtonContainer: {
      pt: 'var(--spacing-4)',
    },

    toggleButton: {
      ...theme.typography['text-title1-m'],
      px: 'var(--spacing-4)',
      py: 'var(--spacing-3)',
      minHeight: '44px',
      borderRadius: 'var(--border-radius-full)',
      bg: 'var(--color-white-base)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      textTransform: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
      width: '100%',

      _hover: {
        bg: 'var(--color-white-base)',
      },

      _active: {
        bg: 'var(--color-white-base)',
      },
    },

    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
    },

    collapseButton: {
      p: '0',
      width: 'var(--spacing-10)',
      height: 'var(--spacing-10)',
      borderRadius: 'var(--border-radius-full)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bg: 'var(--color-white-base)',
      color: 'var(--color-neutral-dark)',
    },

    chatMessageContainer: {
      flex: '1',
      overflowY: 'auto',
      p: 'var(--spacing-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-4)',
      py: 'var(--spacing-20)',
      height: '100%',
      scrollBehavior: 'auto',
    },

    loading: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-4)',
    },

    scrollAnchor: {
      width: '100%',
      height: '1px',
    },

    chatIntroContainer: {
      color: 'var(--color-primary)',
    },

    chatIntroDescription: {
      ...theme.typography['text-body1-l'],
      fontSize: 'var(--text-16)',
      fontWeight: 'normal',
      mb: 'var(--spacing-4)',
    },

    chatIntroContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-4)',
    },

    info: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
      color: 'var(--color-neutral-mid)',
    },

    wrapper: {
      display: 'flex',
    },

    wrapperUser: {
      alignSelf: 'flex-end',
      justifyContent: 'flex-end',
      scrollMarginTop: 'var(--spacing-20)',
    },

    wrapperAssistant: {
      alignSelf: 'flex-start',
      width: '100%',
    },

    bubble: {
      borderTopRadius: '20px',
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '0',
      fontSize: 'var(--text-16)',
    },

    bubbleUser: {
      bg: 'var(--color-dark-green)',
      color: 'var(--color-secondary)',
      p: 'var(--spacing-3)',
    },

    bubbleTool: {
      bg: 'var(--color-neutral-medium)',
      color: 'var(--color-secondary)',
      p: 'var(--spacing-3)',
    },

    bubbleProductResults: {
      bg: 'var(--color-success-light)',
      color: 'var(--color-primary)',
      p: 'var(--spacing-3)',
    },

    bubbleTransparent: {
      bg: 'transparent',
      p: '0',
    },

    messageText: {
      ...theme.typography['text-body1-l'],
      fontSize: 'var(--text-16)',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },

    messageTextUser: {
      ...theme.typography['text-body1-l'],
      color: 'var(--color-white-base)',
      fontWeight: 400,
    },

    messageTextAssistant: {
      color: 'var(--color-primary)',
      fontWeight: 400,
    },

    productImagesContainer: {
      p: 'var(--spacing-3)',
      borderRadius: 'var(--border-radius-s)',
    },

    productImagesTitle: {
      fontSize: 'var(--text-14)',
      color: 'var(--color-primary)',
      mb: 'var(--spacing-2)',
    },

    productTileWrapper: {
      width: '100%',
    },

    productGrid: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--spacing-4) var(--spacing-3)',
      width: '100%',
    },

    productTile: {
      bg: 'var(--color-white-base)',
      border: '1px solid var(--color-neutral-light)',
      borderRadius: 'var(--border-radius-xl)',
      overflow: 'hidden',
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      maxHeight: '200px',
      textDecoration: 'none',
      display: 'flex',
      p: 'var(--spacing-4)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      alignItems: 'center',
      height: '100%',
      _hover: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
        textDecoration: 'none',
      },
      WebkitTapHighlightColor: 'transparent',
    },

    productTileGrid: {
      flexDirection: 'column',
      maxHeight: 'auto',
    },

    productDetails: {
      p: 'var(--spacing-4)',
      alignItems: 'center',
    },

    productDetailsGrid: {
      padding: 'var(--spacing-3) 0 0',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
    },
    productDetailsComparable: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    priceContainerComparable: {
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: 'var(--spacing-2)',
      marginTop: 'auto',
    },
    comparablePriceRow: {
      display: 'flex',
      gap: 'var(--spacing-1)',
    },

    productTitle: {
      ...theme.typography['text-title1-s'],
      fontFamily: 'var(--font-face1-medium)',
      color: 'var(--color-primary)',
      mb: 'var(--spacing-2)',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      lineClamp: 2,
      WebkitLineClamp: 2,
      overflow: 'hidden',
      whiteSpace: 'normal',
      height: '36px',
      textAlign: 'center',
    },

    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 'var(--spacing-2)',
    },

    productPrice: {
      ...theme.typography['text-body1-m'],
      fontWeight: 400,
    },

    originalPrice: {
      ...theme.typography['text-body1-m'],
      textDecoration: 'line-through',
      fontSize: '15px',
      lineHeight: 'var(--line-height-100)',
      fontWeight: 400,
      opacity: 0.5,
    },

    salePrice: {
      ...theme.typography['text-body1-m'],
      fontWeight: 400,
    },
    comparablePriceText: {
      ...theme.typography['text-body1-s'],
      color: 'var(--color-neutral-dark, #4a4a4a)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-140)',
    },

    discountText: {
      ...theme.typography['text-body1-m'],
      fontSize: '15px',
      lineHeight: 'var(--line-height-100)',
      color: 'var(--color-green-500)',
      fontWeight: 400,
    },
    comparableDiscountText: {
      color: 'var(--color-primary, #101820)',
      fontWeight: 400,
    },
    productResults: {
      mt: 'var(--spacing-2)',
      maxHeight: '200px',
      overflowY: 'auto',
    },

    productResultItem: {
      p: 'var(--spacing-2)',
      mb: 'var(--spacing-2)',
      bg: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-s)',
      border: '1px solid var(--color-neutral-light)',
    },

    productResultId: {
      fontSize: 'var(--text-12)',
      fontWeight: 'bold',
      color: 'var(--color-primary)',
    },

    productResultExcerpt: {
      fontSize: 'var(--text-11)',
      color: 'var(--color-neutral-dark)',
      mt: 'var(--spacing-1)',
    },

    productResultPriceHint: {
      fontSize: 'var(--text-11)',
      fontWeight: 'bold',
      color: 'var(--color-success-dark)',
      mt: 'var(--spacing-1)',
    },

    moreProducts: {
      fontSize: 'var(--text-11)',
      color: 'var(--color-neutral-medium)',
      textAlign: 'center',
    },
    viewDetailsButton: {
      ...theme.typography['text-title1-m'],
      width: 'fit-content',
      fontSize: 'var(--text-16)',
      fontWeight: 'normal',
      color: 'var(--color-primary)',
      bg: 'transparent',
      textDecoration: 'underline',

      _hover: {
        textDecoration: 'none',
      },
      p: 0,
    },

    thinkingWrapper: {
      alignSelf: 'flex-start',
    },

    thinkingContainer: {
      p: 'var(--spacing-3)',
      borderRadius: 'var(--border-radius-s)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
    },

    spadeIcon: {
      display: 'flex',
      alignItems: 'center',
      animation: `${iconBounce} 1.2s ease-in-out infinite`,
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },

    thinkingText: {
      fontSize: 'var(--text-16)',
      fontWeight: '600',
      color: 'var(--color-primary)',

      _after: {
        content: '""',
        animation: `${dotAnimation} 1.4s steps(3, end) infinite`,
        marginLeft: '2px',
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
        },
      },
    },

    chatInputContainer: {
      px: 'var(--spacing-3)',
      py: 'var(--spacing-4)',
      position: 'absolute',
      bg: 'transparent',
      bottom: 0,
      width: '100%',
    },

    chatInputWrapper: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 4px 64px 0 rgba(133, 133, 133, 0.25)',
      background: 'var(--color-white-base)',
      borderRadius: 'var(--text-100)',
    },

    chatInput: {
      ...theme.typography['text-title1-m'],
      p: 'var(--spacing-4)',
      borderRadius: 'var(--text-100)',
      color: 'var(--color-black-base)',
      minHeight: 'var(--spacing-12)',
      transition: 'all 0.2s ease-in-out',
      border: 'none',

      '&.chat-input__field': {
        '&::placeholder': {
          ...theme.typography['text-title1-m'],
          color: 'var(--color-black-base)',
        },

        '&:focus': {
          border: 'none',
        },
      },
    },

    chatSendButtonWrapper: {
      position: 'absolute',
      right: 'var(--spacing-1)',
      bottom: '2.5px',
      top: 'var(--spacing-1)',
    },

    chatSendButton: {
      borderRadius: 'var(--spacing-8)',
      width: 'var(--spacing-10)',
      height: 'var(--spacing-10)',
      p: '0',
      bg: 'var(--color-primary)',
      color: 'var(--color-white-base)',
      cursor: 'pointer',
    },
    promptSuggestionsContainer: {
      spacing: 'var(--spacing-3)',
    },
    promptContainer: {
      width: 'fit-content',
      minHeight: 'var(--spacing-12)',
      p: 'var(--spacing-3) var(--spacing-6)',
      borderRadius: 'var(--border-radius-full)',
      border: '2px solid transparent',
      bg: `linear-gradient(var(--color-secondary), var(--color-secondary)) padding-box, linear-gradient(var(--prompt-gradient-angle), ${GRADIENT_STOPS}) border-box`,
      fontSize: 'var(--text-14)',
      justifyContent: 'flex-start',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'relative',
      height: 'auto',
      textTransform: 'none',
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      textAlign: 'left',
      animation: `${gradientAngleRotate} 5s linear infinite`,
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
      },

      _hover: {
        animation: 'none',
        bg: 'var(--color-secondary)',
      },

      _active: {
        animation: 'none',
        bg: 'var(--color-secondary)',
      },
    },

    promptText: {
      ...theme.typography['text-title1-m'],
      fontWeight: 400,
      whiteSpace: 'normal',
    },

    chatLauncherContainer: {
      position: 'fixed',
      bottom: 'var(--spacing-20)',
      right: 'var(--spacing-4)',
      zIndex: 1000,
    },

    chatLauncherButton: {
      bg: 'var(--color-dark-green)',
      color: 'var(--color-secondary)',
      borderRadius: '100px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      textTransform: 'none',
      height: '56px',
      width: 'fit-content',

      '&:hover:not(:disabled), &:active': {
        bg: 'var(--color-dark-green)',
      },
    },

    chatLauncherContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--spacing-2)',
    },

    chatLauncherTextWrapper: {
      display: 'flex',
      gap: 'var(--spacing-2)',
      minWidth: 0,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      marginLeft: 'auto',
      alignItems: 'center',
    },

    chatLauncherText: {
      ...theme.typography['text-body1-l'],
      fontWeight: 400,
      fontSize: 'var(--text-16)',
      color: 'var(--color-secondary)',
    },

    minusIconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 'var(--spacing-6)',
      height: 'var(--spacing-6)',
      borderRadius: 'var(--border-radius-full)',
      backgroundColor: 'var(--color-white-base)',
      cursor: 'pointer',
      padding: 'var(--spacing-1) 3px ',
    },

    chatLauncherTooltip: {
      bg: 'var(--color-primary)',
      borderRadius: 'var(--border-radius-m)',
      border: 'none',
      w: 'fit-content',
      maxW: 150,
      m: '0 var(--spacing-2)',
      p: 'var(--spacing-1)',
    },
    chatLauncherTooltipBody: {
      p: 'var(--spacing-2)',
    },
    chatLauncherTooltipText: {
      color: 'var(--color-secondary)',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-l)',
      strong: {
        fontFamily: 'var(--font-face1-medium)',
        fontSize: 'var(--text-12)',
        fontWeight: 700,
      },
    },
    chatLauncherTooltipCta: {
      bg: 'var(--color-secondary)',
      borderRadius: 'var(--border-radius-l)',
      color: 'var(--color-primary)',
      fontSize: 'var(--text-12)',
      height: '1.25rem',
      marginTop: 'var(--spacing-2)',
      p: 'var(--spacing-1) var(--spacing-2)',
      textTransform: 'none',
    },

    feedbackContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-3)',
      marginTop: 'var(--spacing-4)',
    },

    feedbackLabel: {
      ...theme.typography['text-title1-s'],
      color: 'var(--color-neutral-medium)',
      fontWeight: 'normal',
    },

    feedbackButton: {
      size: 'm',
      variant: 'ghost',
    },
    feedbackButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
    },

    productImageGallery: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--spacing-2)',
      maxWidth: '100%',
      marginTop: 'var(--spacing-2)',
    },

    productImageItem: {
      cursor: 'pointer',
      borderRadius: 'var(--border-radius-s)',
      overflow: 'hidden',
      border: '1px solid var(--color-neutral-light)',
      background: 'var(--color-white-base)',
      transition: 'all 0.2s ease',

      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },

      _focus: {
        outline: '2px solid var(--color-primary)',
        outlineOffset: '2px',
        transform: 'translateY(-2px)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },

    productImageContainer: {
      width: '136px',
      minWidth: '136px',
      height: '170px',
      borderRadius: 'var(--border-radius-m)',
      overflow: 'hidden',
      objectFit: 'cover',
      aspectRatio: '1/1',
    },

    productImageContainerGrid: {
      width: '100%',
      height: 'auto',
    },

    productImageView: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },

    debugPanelContainer: {
      bg: 'rgba(255, 243, 205, 0.8)',
      border: '2px solid rgba(255, 193, 7, 0.3)',
      borderRadius: 'var(--border-radius-s)',
      p: 'var(--spacing-4)',
      mb: 'var(--spacing-4)',
      width: '100%',
      minHeight: '100px',
    },

    debugPanelContainerFilled: {
      bg: 'rgba(255, 243, 205, 0.8)',
      border: '2px solid rgba(255, 193, 7, 0.3)',
      borderRadius: 'var(--border-radius-s)',
      p: 'var(--spacing-4)',
      mb: 'var(--spacing-4)',
      maxHeight: '300px',
      overflowY: 'auto',
      width: '100%',
      minHeight: '120px',
    },

    debugPanelHeader: {
      fontSize: 'var(--text-13)',
      fontWeight: 'bold',
      color: '#856404',
      mb: 'var(--spacing-2)',
      display: 'block',
      lineHeight: 'var(--line-height-140)',
    },

    debugPanelEmpty: {
      fontSize: 'var(--text-12)',
      color: 'var(--color-neutral-medium)',
      fontStyle: 'italic',
      display: 'block',
      lineHeight: '1.3',
    },

    debugPanelEvent: {
      bg: 'var(--color-white-base)',
      border: '1px solid var(--color-neutral-light)',
      borderRadius: 'var(--border-radius-xs)',
      p: 'var(--spacing-3)',
      mb: 'var(--spacing-2)',
      width: '100%',
      minHeight: '70px',
    },

    debugPanelEventHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      mb: 'var(--spacing-1)',
    },

    debugPanelEventName: {
      fontSize: 'var(--text-12)',
      fontWeight: 'bold',
      color: '#0066cc',
      display: 'block',
      lineHeight: '1.3',
    },

    debugPanelEventTime: {
      fontSize: 'var(--text-11)',
      color: 'var(--color-neutral-medium)',
      display: 'block',
      lineHeight: '1.3',
    },

    debugPanelEventId: {
      fontSize: 'var(--text-11)',
      color: 'var(--color-neutral-1)',
      fontFamily: 'monospace',
      display: 'block',
      lineHeight: '1.3',
    },

    debugPanelTotal: {
      fontSize: 'var(--text-11)',
      color: 'var(--color-neutral-medium)',
      textAlign: 'center',
      mt: 'var(--spacing-1)',
      display: 'block',
      lineHeight: '1.3',
    },

    chatToggleButton: {
      bg: 'var(--color-primary)',
      color: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-full)',
      width: '60px',
      height: '60px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      _hover: { bg: 'var(--color-primary-dark)' },
    },
    confirmCta: {
      bg: 'var(--color-black-base)',
      borderRadius: 'var(--border-radius-full)',
      textTransform: 'capitalize',
    },
    cancelCta: {
      bg: 'var(--Neutrals-color-neutral-light-1, #F0F0F0)',
      borderRadius: 'var(--border-radius-full)',
      textTransform: 'capitalize',
    },
    confirmationOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'var(--Scrim-color-scrim-dark, rgba(0, 0, 0, 0.75))',
    },
    confirmationLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 2000,
    },
    confirmationContainer: {
      display: 'flex',
      flexDirection: 'column',
      bg: 'var(--color-white-base)',
      gap: 'var(--spacing-2)',
      maxWidth: '338px',
      minWidth: '338px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      p: 'var(--spacing-8)',
      borderRadius: 'var(--border-radius-xl)',
      zIndex: 2000,
    },
    confirmationButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: 'var(--spacing-2)',
    },
    confirmationTitle: {
      ...theme.typography['text-display1-ms'],
      fontFamily: 'var(--font-face2-normal)',
      fontSize: 'var(--text-28)',
      fontWeight: 700,
      lineHeight: 'var(--line-height-100)',
    },
    confirmationBody: {
      ...theme.typography['text-body1-m'],
    },
    confirmationBodyContainer: {
      display: 'grid',
      gap: 'var(--spacing-4)',
    },
    errorText: {
      color: 'var(--color-error-primary)',
      fontWeight: 'bold',
      fontSize: 'var(--text-16)',
    },

    retryButton: {
      ...theme.typography['text-title1-m'],
      width: 'fit-content',
      fontSize: 'var(--text-16)',
      fontWeight: 'normal',
      color: 'var(--color-primary)',
      bg: 'transparent',
      textDecoration: 'underline',
    },

    errorContainer: {
      px: 'var(--spacing-4)',
      pb: 'var(--spacing-20)',
    },
    errorAlert: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--spacing-3)',
      p: 'var(--spacing-3)',
      bg: '#FEF0F3',
      border: '1px solid #FCD7DF',
      borderRadius: 'var(--border-radius-xl)',
    },

    errorLeft: {
      display: 'flex',
      gap: 'var(--spacing-3)',
    },

    errorIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '24px',
    },

    errorBody: {
      display: 'flex',
      flexDirection: 'column',
    },

    errorTitle: {
      ...theme.typography['text-title1-s'],
      color: 'var(--color-error-primary)',
      fontWeight: '700',
    },

    errorDescription: {
      ...theme.typography['text-title1-s'],
      fontWeight: '400',
      color: 'var(--color-error-primary)',
    },

    errorActionButton: {
      ...theme.typography['text-body1-m'],
      padding: 'var(--spacing-2) var(--spacing-3)',
      borderRadius: 'var(--border-radius-full)',
      bg: 'var(--color-white-base)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
      textTransform: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
      background: 'var(--color-white-base)',
      color: 'var(--color-black-base)',

      _hover: {
        bg: 'var(--color-white-base)',
      },

      _active: {
        bg: 'var(--color-white-base)',
      },
    },
    thumbIconCta: {
      width: 'var(--spacing-6)',
      height: 'var(--spacing-6)',
      svg: { path: { fill: 'var(--Neutrals-color-neutral-dark, #4A4A4A);' } },
    },
    thumbIcons: {
      width: '19px',
      height: '17px',
    },

    promptRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-3)',
      width: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
    },

    promptRowTop: {
      display: 'flex',
      gap: 'var(--spacing-3)',
      overflowX: 'auto',
      overflowY: 'hidden',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },

    promptRowBottom: {
      display: 'flex',
      gap: 'var(--spacing-3)',
      overflowX: 'auto',
      overflowY: 'hidden',
      paddingLeft: 'var(--spacing-4)',
      scrollbarWidth: 'none',

      '&::-webkit-scrollbar': {
        display: 'none',
      },

      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        paddingRight: '20vw',
      },
    },

    promptTile: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-3)',
      padding: 'var(--spacing-3)',
      borderRadius: 'var(--border-radius-xl)',
      bg: 'var(--color-secondary)',
      width: 'fit-content',
      textAlign: 'left',
      cursor: 'pointer',
      flexShrink: 0,
      transition: 'all 0.2s ease',

      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        transform: 'translateY(-1px)',
      },

      '&:active': {
        transform: 'translateY(0)',
      },
    },

    promptTileIconWrapper: {
      width: 'var(--spacing-6)',
      height: 'var(--spacing-6)',
      borderRadius: 'var(--border-radius-m)',
      bg: '#F0EEEA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    promptTileText: {
      fontSize: 'var(--text-16)',
      lineHeight: 'var(--line-height-m)',
      color: 'var(--color-primary)',
      fontWeight: 'normal',
    },

    promptSuggestionsWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-3)',
    },

    circleContainer: {
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    },

    particle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      opacity: 0,
      animation: `${popIn} 0.3s ease-out both`,
      transform: `
      translate(-50%, -50%)
      rotate(var(--angle))
      translate(var(--radius))
      rotate(calc(-1 * var(--angle)))
    `,
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        opacity: 1,
      },
    },

    character: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '338px',
      height: '338px',
      zIndex: 2,
      animation: `${scaleUp} 0.5s ease-out forwards`,
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        transform: 'translate(-50%, -50%) scale(1)',
      },
    },

    chatStarterContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: 'var(--spacing-4)',
      overflow: 'hidden',
      justifyContent: 'center',
    },

    centerContent: {
      position: 'absolute',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '@media (max-height: 660px)': {
        top: '36%',
      },
    },

    chatStarterIllustration: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'visible',
      img: {
        '@media (max-height: 660px)': {
          width: '275px',
          height: '275px',
        },
      },
    },

    chatStarterHeading: {
      ...theme.typography['text-display1-l'],
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '47px',
      lineHeight: '47px',
      color: '#470314',
    },

    giftWrapper: {
      position: 'relative',
      display: 'inline-flex',
      animation: `${giftBounce} 2.5s ease-in-out infinite`,

      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },

    giftHeart: {
      position: 'absolute',
      left: '50%',
      top: '-10px',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      animation: `${heartFloat} 12s linear forwards`,
      willChange: 'transform, opacity',
    },

    giftHeartWind: {
      animation: `${heartWind} 4s ease-in-out infinite`,
      willChange: 'transform',
    },

    infoText: {
      color: '#470314',
      fontWeight: 'normal',
      fontSize: 'var(--text-14)',
      opacity: 0.8,
    },

    infoDisclaimer: {
      position: 'absolute',
      bottom: 'var(--spacing-20)',
      left: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--spacing-1)',

      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: 'var(--spacing-2)',
      },
    },

    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-1)',
    },

    privacyLink: {
      textAlign: 'center',
      fontSize: 'var(--text-14)',
      color: '#470314',
      textDecoration: 'underline',
      cursor: 'pointer',
      opacity: 0.8,
    },

    addToBagContainer: {
      marginTop: 'auto',
      width: '100%',
    },

    chatStarterTextWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--spacing-4)',
      marginBottom: 'var(--spacing-6)',
    },

    chatStarterSubText: {
      color: '#470314',
      textAlign: 'center',
      fontSize: 'var(--text-14)',
      fontWeight: 'normal',
      lineHeight: 'var(--line-height-135)',
      paddingInline: 'var(--spacing-4)',
    },
  }),
}
