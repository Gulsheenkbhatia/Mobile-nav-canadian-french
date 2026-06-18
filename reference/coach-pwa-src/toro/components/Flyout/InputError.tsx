import { memo } from 'react'
import Text from 'toro/components/Text'

function InputError({ error, color, ...props }: { error?: string; color: string }) {
  if (!error) return null

  return (
    <Text as="div" variant="body-primary" size="sm" color={color} pt="s" mt="xs" {...props}>
      {error}
    </Text>
  )
}

export default memo(InputError)
