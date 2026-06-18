export default {
  parts: ['qvCarousel', 'productImageOnPurposeBadgeContainer', 'productImageOnPurposeBadge'],
  baseStyle: {
    qvCarousel: {
      alignItems: 'start',
    },
    productImageOnPurposeBadgeContainer: {
      cursor: 'pointer',
      position: 'absolute',
      left: 2,
      top: 9,
      zIndex: 5,
    },
    productImageOnPurposeBadge: {
      height: 12,
      width: 'auto',
    },
  },
}
