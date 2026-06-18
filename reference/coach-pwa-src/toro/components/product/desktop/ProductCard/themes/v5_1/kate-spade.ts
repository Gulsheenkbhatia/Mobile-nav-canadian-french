export default {
  baseStyle: () => ({
    productCardWrapper: {
      backgroundColor: 'var(--color-neutral-light-1, #F0F0F0)',
    },
    productCardTitleContainer: {
      '& > h3': {
        fontFamily: 'var(--font-face1-light)',
      },
      '& > h2': {
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-24)',
        lineHeight: 'var(--line-height-120)',
        fontWeight: '400',
        textAlign: 'center',
      },
    },
    productCardImageWrapper: {
      transition: 'none',
      _groupHover: {
        transform: 'translateY(0)',
      },
    },
  }),
}
