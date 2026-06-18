export const DESKTOP_SLIDE_WIDTH = 'min(calc(min(100vh - 204px, 700px) * 1.6), 90vw)'
export const COLLAPSED_REVIEW_TEXT_HEIGHT = 60

export default {
  parts: [
    'container',
    'header',
    'title',
    'divider',
    'viewAllButton',
    'photoContainer',
    'arrows',
    'modalContent',
    'modalCloseButton',
    'modalContainer',
    'modalTitle',
    'modalGrid',
    'modalPhoto',
    'carouselModal',
    'carouselCloseButton',
    'carouselContainer',
    'carouselItem',
    'reviewContent',
    'ratingStars',
    'userInfo',
    'reviewTitle',
    'incentivizedBadge',
    'responseContainer',
    'responseUserInfo',
    'responseText',
    'reviewGrid',
    'reviewPhoto',
    'photoIndicators',
    'photoIndicatorDot',
    'photoIndicatorDotActive',
    'reviewText',
    'recommendToFriend',
    'helpfulVotes',
    'thumbsContainer',
    'carouselThumbnails',
    'carouselThumbnail',
    'activeCarouselThumbnail',
    'reviewContentInner',
    'reviewTopSection',
    'carouselArrows',
    'readMoreButton',
    'userName',
    'userAge',
  ],
  baseStyle: ({ theme }) => ({
    container: {
      mb: 'var(--spacing-8)',
    },
    header: {
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 'var(--spacing-4)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
    title: {
      ...theme.typography['text-display4-xs'],
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display1-xs'],
      },
    },
    divider: {
      h: 'var(--spacing-6)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        mt: '48px',
        mb: '48px',
        width: '100%',
        height: '1px',
        backgroundColor: 'var(--color-neutral-light-3)',
      },
    },
    viewAllButton: {
      ...theme.typography['text-title1-s'],
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
      color: 'var(--color-black-base)',
      svg: {
        width: '14px',
        height: '14px',
        filter: 'brightness(0) saturate(100%)',
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-cta1-s'],
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-100)',
        textTransform: 'uppercase',
        svg: {
          display: 'none',
        },
      },
    },
    photoContainer: {
      flexShrink: 0,
      borderRadius: 0,
      overflow: 'hidden',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        width: '100%',
        aspectRatio: '0.8',
        img: {
          objectFit: 'cover',
        },
      },
      img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
      cursor: 'pointer',
      border: 'none',
      padding: 0,
      background: 'none',
      '&:hover': {
        opacity: 0.8,
        transform: 'scale(1.02)',
        transition: 'all 0.2s ease-in-out',
      },
    },
    arrows: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      width: '60px',
      height: '60px',
      backgroundColor: 'var(--color-white-base)',
      borderRadius: '50%',
      border: '1px solid var(--color-neutral-light-2)',
      '&:first-child': {
        left: '20px',
      },
      '&:last-child': {
        right: '20px',
      },
      '& svg': {
        width: '24px',
        height: '24px',
        m: 'auto',
        outline: 'none',
        border: 'none',
        pointerEvents: 'none',
      },
    },
    modalContent: {
      maxWidth: '100vw',
      maxHeight: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    modalCloseButton: {
      color: 'var(--black-base)',
      backgroundColor: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-full)',
      right: '20px',
      top: 'var(--spacing-16)',
      width: '40px',
      height: '40px',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        width: '42px',
        height: '42px',
        right: '60px',
        top: '75px',
      },
      '& svg': {
        width: '12px',
        height: '12px',
      },
      zIndex: 2,
    },
    modalContainer: {
      padding: '20px',
      paddingTop: '60px',
      height: '100vh',
      overflowY: 'auto',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        padding: '60px',
        paddingTop: '75px',
      },
    },
    modalTitle: {
      ...theme.typography['text-display4-xs'],
      color: 'var(--color-white-base)',
      mb: 'var(--spacing-4)',
      width: '150px',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-30)',
        mb: '44px',
        width: '100%',
      },
    },
    modalGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '6.5px',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 'var(--spacing-4)',
      },
      [`@media (min-width: ${theme.breakpoints.lg})`]: {
        gridTemplateColumns: 'repeat(6, 1fr)',
      },
    },
    modalPhoto: {
      width: '100%',
      aspectRatio: '0.8',
      objectFit: 'cover',
      borderRadius: 'var(--spacing-2)',
      cursor: 'pointer',
    },
    carouselModal: {
      maxWidth: '100vw',
      maxHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        flexDirection: 'column-reverse',
      },
    },
    carouselCloseButton: {
      width: DESKTOP_SLIDE_WIDTH,
      '& p': {
        display: 'none',
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        width: '100%',
        '& p': {
          display: 'block',
          ...theme.typography['text-title1-s'],
          color: 'var(--color-white-base)',
          textAlign: 'center',
          mt: 'var(--spacing-3)',
          textDecoration: 'underline',
        },
      },
      '& > button': {
        position: 'static',

        color: 'var(--black-base)',
        backgroundColor: 'var(--color-white-base)',
        borderRadius: 'var(--border-radius-full)',
        width: '40px',
        height: '40px',
        m: '0 0 20px auto',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: '42px',
          height: '42px',
          m: '0 0 30px auto',
        },
        '& svg': {
          width: '12px',
          height: '12px',
        },
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          m: '20px auto 0',
        },
      },
    },
    carouselContainer: {
      width: '100%',
    },
    carouselItem: {
      backgroundColor: 'var(--color-white-base)',
      h: '100%',
      img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        borderRadius: 'var(--spacing-2)',
      },
    },
    reviewGrid: {
      display: 'flex',
      h: '100%',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        '& > div': {
          flex: '0 0 50%',
        },
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
        p: '20px 10px',
      },
    },
    reviewPhoto: {
      position: 'relative',
      h: '100%',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        order: 1,
        aspectRatio: '0.8',
        h: 'auto',
        img: {
          borderRadius: 'var(--spacing-2)',
          aspectRatio: '0.8',
          h: '100%',
          w: '100%',
        },
      },
    },
    photoIndicators: {
      position: 'absolute',
      bottom: 'var(--spacing-4)',
      left: '50%',
      transform: 'translateX(-50%)',
      gap: 'var(--spacing-2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoIndicatorDot: {
      width: '6px',
      height: '6px',
      borderRadius: 'full',
      backgroundColor: 'var(--color-white-base)',
      flexShrink: 0,
      transition: 'width 0.25s ease, background-color 0.25s ease, opacity 0.25s ease',
    },
    photoIndicatorDotActive: {
      width: '20px',
      height: '6px',
      borderRadius: 'full',
      backgroundColor: 'var(--color-black-base)',
      flexShrink: 0,
      transition: 'width 0.25s ease, background-color 0.25s ease, opacity 0.25s ease',
    },
    reviewContent: {
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      p: 'var(--spacing-6)',
      '& > div': {
        flexShrink: 0,
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'contents',
      },
    },
    carouselArrows: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'none',
      },
    },
    reviewContentInner: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'contents',
      },
    },
    reviewTopSection: {
      order: 0,
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        mb: '10px',
      },
    },
    ratingStars: {
      mb: '12px',
      // we don't want to paint #icon-empty-star
      '& svg:has(use[href="#icon-star"])': {
        filter: 'brightness(0) saturate(100%)',
      },
    },
    userInfo: {
      order: 3,
      '& p': {
        ...theme.typography['text-body2-s'],
        fontSize: 'var(--text-14)',
        fontWeight: '400',
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '& p': {
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-10)',
          lineHeight: 'var(--line-height-140)',
          color: 'var(--color-neutral-dark)',
        },
        display: 'flex',
        flexWrap: 'wrap',
      },
    },
    userName: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        textTransform: 'uppercase',
        '&::after': {
          content: '","',
          mr: 'var(--spacing-1)',
        },
      },
    },
    userAge: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        textTransform: 'uppercase',
        flexBasis: '100%',
      },
    },
    reviewTitle: {
      order: 3,
      ...theme.typography['text-display1-s'],
      mt: '42px',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mt: '10px',
        color: 'var(--color-neutral-dark)',
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-14)',
      },
    },
    incentivizedBadge: {
      order: 3,
      '& p': {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        fontWeight: '400',
      },
      mt: 'var(--spacing-1)',
      gap: '4px',
      '& .incentivized-review-content': {
        borderRadius: 'var(--border-radius-l)',
        border: 'none',
        w: '196px',
        backgroundColor: 'var(--color-neutral-dark)',
        _focus: { outline: 'none' },
      },
      '& .incentivized-review-title': {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        color: 'var(--color-black-base)',
        textAlign: 'center',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-neutral-dark)',
        },
      },
      '& .incentivized-review-icon': {
        mt: '3px',
        "& svg > use[href='#icon-form-error-outline']": {
          color: 'var(--color-black-base)',
        },
      },
      '& .incentivized-review-body': {
        gap: '8px',
        p: '14px var(--spacing-2)',
        maxW: '196px',
        alignItems: 'center',
        flexDirection: 'column',
      },
      '& .incentivized-review-body-button': {
        ...theme.typography['text-title1-s'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        color: 'var(--color-black-base)',
        textAlign: 'center',
        backgroundColor: 'var(--color-white-base)',
        cursor: 'pointer',
        w: '88px',
        textTransform: 'none',
        p: '10px var(--spacing-6) var(--spacing-2) var(--spacing-6)',
        borderRadius: '100px',
        fontWeight: '500',
      },
      '& .incentivized-review-body-text': {
        ...theme.typography['text-cta2-xs'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        color: 'var(--color-white-base)',
        textAlign: 'center',
        fontWeight: '500',
      },
    },
    reviewText: {
      order: 3,
      ...theme.typography['text-body2-m'],
      fontWeight: '400',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-dark)',
        fontSize: 'var(--text-12)',
        my: '6px',
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        display: 'block',
        fontSize: 'var(--text-16)',
        WebkitLineClamp: 'unset',
        overflow: 'visible',
        my: '18px',
      },
    },
    reviewTextCollapsed: {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
      overflow: 'hidden',
      maxHeight: `${COLLAPSED_REVIEW_TEXT_HEIGHT}px`,
      flex: '0 0 auto',
    },
    responseContainer: {
      order: 3,
      pl: '14px',
      borderLeft: '1px solid var(--color-neutral-light-2)',
      my: '18px',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'none',
      },
    },
    responseUserInfo: {
      ...theme.typography['text-display1-xs'],
    },
    responseText: {
      ...theme.typography['text-body2-m'],
      fontWeight: '400',
      fontSize: 'var(--text-16)',
      mt: '8px',
    },
    recommendToFriend: {
      order: 3,
      ...theme.typography['text-body1-s'],
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      fontWeight: '400',
      my: '18px',

      [`@media (max-width: ${theme.breakpoints.md})`]: {
        color: 'var(--color-neutral-dark)',
      },
    },
    helpfulVotes: {
      order: 3,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'var(--color-neutral-light)',
      my: '18px',
      h: '50px',
      p: 'var(--spacing-3)',
      '& p': {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-14)',
        fontWeight: '400',
        fontFamily: 'var(--font-face1-normal)',
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        my: '6px',
        '& p': {
          color: 'var(--color-neutral-dark)',
        },
      },
      '& svg': {
        pointerEvents: 'none',
      },
    },
    thumbsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-2)',
      h: '100%',
      '& > div': {
        backgroundColor: 'var(--color-white-base)',
        border: '1px solid var(--border-color-inactive)',
        borderRadius: 'var(--spacing-1)',
        h: '100%',
        p: 'var(--spacing-1) var(--spacing-2)',
      },
    },
    carouselThumbnails: {
      order: 2,
      m: 'auto 0 0',
      gap: 'var(--spacing-2)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mt: ' 10px',
      },
    },
    carouselThumbnail: {
      width: '78px',
      height: '98px',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        width: '64px',
        height: '64px',
        borderRadius: '6px',
        overflow: 'hidden',
      },
      flexShrink: 0,
      objectFit: 'cover',
    },
    activeCarouselThumbnail: {
      border: '2px solid var(--color-black-base)',
    },
    readMoreButton: {
      ...theme.typography['text-link3-s'],
      display: 'flex',
      textAlign: 'start',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
      order: 3,
      color: 'var(--color-grey-80)',
      '& svg': {
        transition: 'transform 0.3s ease-in-out',
      },

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        display: 'none',
      },
    },
  }),
  variants: {
    pdpv5_1: ({ theme }) => ({
      photoContainer: {
        borderRadius: 'var(--spacing-2)',
      },
      title: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-20)',
        },
      },
      modalTitle: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-28)',
        },
      },
      viewAllButton: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extended-normal)',
          textTransform: 'none',
          fontSize: 'var(--text-14)',
          lineHeight: 'var(--line-height-125)',
        },
      },
      userInfo: {
        '& p': {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-12)',
        },
        '& > :not(:first-child)': {
          color: 'var(--color-neutral-1)',
        },
      },
      responseUserInfo: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-12)',
      },
      responseText: {
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-dark)',
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-125)',
      },
      reviewTitle: {
        ...theme.typography['text-display4-xxs'],
      },
      incentivizedBadge: {
        '& .incentivized-review-title': {
          ...theme.typography['text-link2-xs'],
          fontFamily: 'var(--font-face1-extended-normal)',
          fontWeight: '400',
          h: 'fit-content',
          mt: '5px',
          textDecoration: 'none',
        },
      },
      reviewText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
        },
      },
      recommendToFriend: {
        ...theme.typography['text-link2-xs'],
        fontFamily: 'var(--font-face1-extended-normal)',
        textDecoration: 'none',
        color: '#000003',
      },
      helpfulVotes: {
        '& p': {
          ...theme.typography['text-title1-s'],
          mt: '2px !important',
          color: 'var(--color-neutral-dark)',
        },
      },
      carouselItem: {
        p: 'var(--spacing-3)',
        borderRadius: 'var(--spacing-4)',
      },
      reviewPhoto: {
        borderRadius: 'var(--spacing-4)',
        img: {
          borderRadius: 'var(--spacing-4)',
        },
      },
      reviewContent: {
        pt: '30px',
        pb: 0,
        px: 'var(--spacing-3)',
      },
      carouselThumbnail: {
        borderRadius: 'var(--spacing-2)',
        overflow: 'hidden',
      },
      divider: {
        display: 'none',
      },
    }),
  },
}
