export default {
  baseStyle: () => ({
    PromoProgressBar: ({ width }) => ({
      '& .col-12': {
        pl: '0',
      },
      '& .promo-gwp-wrapper': {
        p: 0,
        mt: '1rem',
        '& .icon': {
          display: 'inline-block',
          w: '32px',
          h: '24px',
          mr: '0.5rem',
        },
        '& .promo-gwp-content': {
          mr: 0,
          pl: '0.5rem',
          '& .promo-gwp-msg': {
            fontSize: '1rem',
            letterSpacing: '.0125rem',
            lineHeight: '1.35',
            justifyContent: 'center',
          },
          '& .promo-gwp-shopnow': {
            letterSpacing: '.07812rem',
            lineHeight: '1.15',
            textTransform: 'uppercase',
            fontSize: '.75rem',
            textDecoration: 'underline',
            fontWeight: '500',
          },
          '& .promo-gwp-threshold': {
            alignItems: 'center',
            pt: '0.25rem',
            fontSize: '.75rem',
            letterSpacing: '.07812rem',
            lineHeight: '1.15',
            textTransform: 'uppercase',
            '& .promo-gwp__start-limit, .promo-gwp__end-limit': {
              pr: '0.25rem',
            },
            '& .promo-gwp__end-limit': {
              pl: '0.25rem',
            },
          },
        },

        '& .promo-gwp-couponcode': {
          textTransform: 'uppercase',
          color: '#c00',
        },
        '& .promo-gwp-progressbar': {
          display: 'inline-block',
          position: 'relative',
          minWidth: '56%',
          h: '5px',
          top: '0',
          borderRadius: '20px',
          background: '#d8d8d8',
          '& .progressbar-width': {
            background: '#2D9D78',
            w: width,
            display: 'inline-block',
            position: 'absolute',
            h: '5px',
            borderRadius: '20px',
          },
        },
      },
    }),
  }),
}
