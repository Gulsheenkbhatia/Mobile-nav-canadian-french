export default {
  parts: [
    'tangibleeButtonWrapper',
    'tangibleeButton',
    'tangibleeButtonContainer',
    'tangibleeLabel',
  ],
  baseStyle: {},
  variants: {
    vpc: ({ theme }) => ({
      tangibleeButton: {
        bottom: '0',
        height: '52px',
        width: '152px',
        borderRadius: 'var(--border-radius-m)',
      },
      tangibleeLabel: {
        ...theme.typography['text-cta2-xs'],
        fontWeight: '400',
        textTransform: 'none',
      },
      plusIcon: {
        display: 'none',
      },
    }),
    pdpV5: ({ theme }) => ({
      tangibleeButtonWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          position: 'absolute',
          bottom: 'var(--spacing-3)',
          right: 'var(--spacing-3)',
          zIndex: 10,
        },
      },
      tangibleeButton: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          position: 'relative',
          bottom: 'unset',
          left: 'unset',
          transform: 'none',
          padding: 'var(--spacing-3)',
          borderRadius: 'var(--border-radius-m)',
          backgroundColor: 'var(--color-white-base)',
          backdropFilter: 'blur(6px)',
          height: 'auto',
        },
      },
      tangibleeButtonContainer: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          gap: 'var(--spacing-1)',
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          width: '118px',
          '&.expanded.has-human-icon': {
            width: '91px',
          },
          overflow: 'hidden',
          '&.collapsed': {
            width: '25px',
          },
          '& svg': {
            width: '25px',
            height: '33px',
            flexShrink: 0,
            '& > use': {
              color: 'var(--color-black, #000)',
              stroke: 'var(--color-black, #000)',
            },
          },
        },
      },
      tangibleeLabel: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-cta2-xs'],
          color: 'var(--color-black, #000)',
          whiteSpace: 'normal',
          textTransform: 'none',
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.text-hidden': {
            opacity: 0,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          },
        },
      },
    }),
  },
}
