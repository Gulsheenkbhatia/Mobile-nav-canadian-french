export default {
  parts: ['fastShippingTitle', 'fastShippingSubtitle', 'learnMore'],
  baseStyle: ({ theme }: { theme: any }) => {
    return {
      fastShippingTitle: {
        ...theme.typography['text-body2-s'],
        fontWeight: 400,
      },
      fastShippingSubtitle: {
        ...theme.typography['text-cta2-xs'],
        color: 'var(--color-black-70)',
        fontWeight: 400,
      },
      learnMore: {
        ...theme.typography['text-link2-s'],
      },
    }
  },
}
