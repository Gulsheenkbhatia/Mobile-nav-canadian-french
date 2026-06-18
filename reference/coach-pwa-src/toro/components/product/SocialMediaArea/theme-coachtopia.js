export default {
  baseStyle: ({ theme }) => ({
    '& .pdp-styling-advice>img': {
      objectFit: 'contain',
    },
    SocialMediaAreaLabel: {
      ...theme.typography['text-body1-m'],
    },
  }),
}
