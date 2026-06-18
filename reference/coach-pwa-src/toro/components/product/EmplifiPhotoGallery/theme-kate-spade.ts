export default {
  baseStyle: ({ theme }) => ({
    title: {
      ...theme.typography['text-display2-s'],
      fontSize: 'var(--text-24)',
      fontWeight: 400,
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-24)',
        letterSpacing: '0',
      },
    },
    viewAllButton: {
      ...theme.typography['text-title2-s'],
      fontWeight: 500,
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-link2-xs'],
        fontWeight: 500,
        textTransform: 'none',
        svg: {
          display: 'block',
        },
      },
    },
    modalTitle: {
      ...theme.typography['text-display2-s'],
      fontWeight: 400,
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display1-xl'],
        fontSize: 'var(--text-44)',
        fontWeight: 400,
      },
    },
    readMoreButton: {
      ...theme.typography['text-link2-s'],
      fontWeight: 500,
      color: 'var(--color-grey-80)',
    },
    reviewTitle: {
      ...theme.typography['text-display2-s'],
      fontWeight: 400,
      // to beat some Coach styles
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display2-s'],
        color: 'var(--color-black-base)',
      },
    },
    reviewText: {
      ...theme.typography['text-title2-s'],
      fontWeight: 500,
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-m'],
        fontWeight: 400,
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-medium)',
        color: 'var(--color-black-base)',
        fontSize: 'var(--text-14)',
      },
    },
    responseUserInfo: {
      fontFamily: 'var(--font-face1-medium)',
      fontSize: 'var(--text-16)',
      fontWeight: 500,
    },
    responseText: {
      ...theme.typography['text-title2-s'],
      fontWeight: 500,
      fontFamily: 'var(--font-face1-normal)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        fontWeight: 400,
      },
    },
    userInfo: {
      '& p': {
        ...theme.typography['text-body2-xs'],
        fontSize: 'var(--text-12)',
        fontWeight: 500,
      },

      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '& p': {
          fontFamily: 'var(--font-face1-medium)',
          fontSize: 'var(--text-10)',
          lineHeight: 'var(--line-height-125)',
          color: 'var(--color-black-base)',
        },
      },
    },
    incentivizedBadge: {
      '& .incentivized-review-title': {
        fontSize: 'var(--text-12)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-black-base)',
        },
      },
    },
    recommendToFriend: {
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-140)',

      [`@media (max-width: ${theme.breakpoints.md})`]: {
        color: 'var(--color-black-base)',
      },
    },
    helpfulVotes: {
      backgroundColor: 'var(--color-product-image-bg)',
      '& p': {
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
      },
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '& p': {
          color: 'var(--color-black-base)',
        },
      },
    },
  }),
  variants: {
    pdpv5_1: ({ theme }) => ({
      title: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-28)',
          fontWeight: 400,
        },
      },
      viewAllButton: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-16)',
          fontWeight: 400,
        },
      },
      modalTitle: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-52)',
        },
      },
      userInfo: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& p': {
            fontFamily: 'var(--font-face1-medium)',
            fontSize: 'var(--text-14)',
            fontWeight: 500,
            lineHeight: 'var(--line-height-125)',
          },
        },
      },
      reviewTitle: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-28)',
        },
      },
      incentivizedBadge: {
        '& .incentivized-review-title': {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            fontFamily: 'var(--font-face1-medium)',
            fontSize: 'var(--text-10)',
            lineHeight: 'var(--line-height-140)',
          },
        },
        '& .incentivized-review-icon': {
          mt: '2px',
        },
      },
      reviewText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          lineHeight: 'var(--line-height-125)',
        },
      },
      responseText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          lineHeight: 'var(--line-height-125)',
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          color: 'var(--color-black-base)',
        },
      },
      responseUserInfo: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-medium)',
          fontSize: 'var(--text-16)',
          fontWeight: 500,
        },
      },
      recommendToFriend: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          lineHeight: 'var(--line-height-140)',
          color: 'var(--color-black-base)',
        },
      },
      helpfulVotes: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& p': {
            fontSize: 'var(--text-14)',
            lineHeight: 'var(--line-height-140)',
            color: 'var(--color-black-base)',
          },
        },
      },
    }),
  },
}
