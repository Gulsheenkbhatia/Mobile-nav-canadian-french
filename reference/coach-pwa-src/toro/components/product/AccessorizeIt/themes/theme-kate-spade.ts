import { IPHONE_PRO_MAX_SCREEN_WIDTH } from 'toro/constants/adaptiveExperience'

const BUTTON_STYLES = {
  height: '54px',
  width: '100%',
  padding: 'var(--spacing-4) 0 var(--spacing-4) 0',
  borderRadius: 'var(--border-radius-full)',
  border: 'none',
  '& svg': {
    display: 'none',
  },
}
const BUTTON_TEXT_STYLES = ({ theme }) => ({
  ...theme.typography['text-cta2-m'],
  fontSize: 'var(--text-12)',
  fontWeight: 400,
  textTransform: 'none',
  [`@media (min-width: ${IPHONE_PRO_MAX_SCREEN_WIDTH}px)`]: {
    fontSize: 'var(--text-14)',
  },
})

export default {
  baseStyle: ({ theme }) => ({
    accessorizeItTitle: {
      ...theme.typography['text-display2-s'],
      fontWeight: 400,
      textAlign: 'center',
      fontSize: 'var(--text-28)',
    },
    accessorizeItSubtitle: {
      ...theme.typography['text-cta2-xs'],
      color: 'var(--border-color-neutral-base)',
      fontWeight: 400,
      padding: '0 var(--spacing-3)',
      textAlign: 'center',
    },
    accessorizeItImageContainer: {
      margin: 'var(--spacing-4) auto',
      display: 'flex',
      justifyContent: 'center',
      height: '258px',
    },
    accessorizeItImage: {
      height: '100%',
      objectFit: 'cover',
    },
    accessorizeItPriceLabel: {
      ...theme.typography['text-cta2-m'],
      color: 'var(--color-black-base)',
      textTransform: 'none',
    },
    accessorizeItPrice: {
      ...theme.typography['text-cta2-m'],
      color: 'var(--color-black-base)',
    },
    accessorizeItButtonWrapper: {
      position: 'absolute',
      top: 'var(--spacing-16)',
      right: 'var(--spacing-4)',
      zIndex: 10,
      h: '35px',
      w: '153px',
    },
    accessorizeItButtonText: {
      ...theme.typography['text-cta2-s'],
      color: 'var(--color-black-base)',
      fontWeight: 400,
      mr: 'var(--spacing-1)',
      mt: '2px',
      textTransform: 'none',
    },
    accessorizeItATBButton: {
      ...BUTTON_STYLES,
      ...theme.typography['text-cta2-m'],
      background: 'var(--color-black-base)',
      '&:hover': {
        backgroundColor: 'var(--color-black-base) !important',
      },
      '&:active': {
        backgroundColor: 'var(--color-black-base) !important',
      },
    },
    accessorizeItATBButtonText: {
      ...BUTTON_TEXT_STYLES({ theme }),
      color: 'var(--color-white-base)',
      [`@media (min-width: ${IPHONE_PRO_MAX_SCREEN_WIDTH}px)`]: {
        fontSize: '1rem',
      },
    },
    accessorizeItATBBundleButton: {
      ...BUTTON_STYLES,
      fontSize: '1rem',
      background: 'var(--color-white-base)',
    },
    accessorizeItATBBundleButtonText: {
      ...BUTTON_TEXT_STYLES({ theme }),
      [`@media (min-width: ${IPHONE_PRO_MAX_SCREEN_WIDTH}px)`]: {
        fontSize: '1rem',
      },
      color: 'var(--color-black-base)',
    },
  }),
}
