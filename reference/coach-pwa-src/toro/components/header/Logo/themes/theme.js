import ImageOutlet from '@tapestry-inc/design-tokens/coach-outlet/logo/primary-black.svg'

export default {
  parts: ['logoWrapper', 'brandLogo'],
  baseStyle: () => ({
    logoWrapper: ({ isOneCoachInOutletCategory }) =>
      isOneCoachInOutletCategory
        ? { w: '187px', h: '32px' }
        : { pt: 'var(--spacing-xs)', w: '115px', h: '13px' },
    brandLogo: ({ isOneCoachInOutletCategory }) =>
      isOneCoachInOutletCategory
        ? { width: 187, height: 32, viewBox: '0 0 1246.4 80.6' }
        : { width: 114, height: 14, viewBox: '0 0 252 28' },
    ImageOutlet,
  }),
}
