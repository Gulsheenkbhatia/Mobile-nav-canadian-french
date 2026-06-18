export default {
  baseStyle: ({ theme }) => ({
    wrapper: {
      background: 'var(--color-neutral-light-1)',
      '& #recommendations-section .content-divider::before': {
        display: 'none',
      },
    },
    title: {
      ...theme.typography['text-display4-xxs'],
    },
    productCount: {
      ...theme.typography['text-body1-s'],
      color: 'var(--color-neutral-medium, #575757)',
    },

    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--spacing-6) var(--spacing-3) var(--spacing-4) var(--spacing-3)',
    },
    recommendationsSection: {
      padding: '0 var(--spacing-3) var(--spacing-3) var(--spacing-3)',
    },
    skeletonProductCount: {
      width: '59.37px',
      height: '16.8px',
    },
    recommendationsSkeletonGrid: {
      display: 'grid',
      mb: '27px',
      width: '100%',
      padding: 'var(--spacing-0)',
      gap: 'var(--spacing-1)',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    recommendationsSkeletonCell: {
      height: '366.16px',
    },
    recommendationsSkeletonImage: {
      height: '243.17px',
      borderRadius: '0px',
    },
    recommendationsSkeletonTitle: {
      width: 'calc(50vw - var(--spacing-8))',
      height: '19.59px',
      my: 'var(--spacing-2)',
      mx: 'auto',
    },
    recommendationsSkeletonPrice: {
      width: 'calc(50vw - var(--spacing-8))',
      height: '36.39px',
      mx: 'auto',
    },
    recommendationsSkeletonButton: {
      width: '108.63px',
      height: '36px',
      borderRadius: 'var(--border-radius-full)',
      my: 'var(--spacing-2)',
      mx: 'auto',
    },
  }),
}
