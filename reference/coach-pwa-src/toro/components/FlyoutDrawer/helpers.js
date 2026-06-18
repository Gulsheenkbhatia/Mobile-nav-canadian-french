import Text from 'toro/components/Text'
import useTheme from 'toro/hooks/useTheme'
import pick from 'lodash/pick'

export const RenderError = (errors, fieldName, props = {}) => {
  const { colors } = useTheme()

  return errors?.[fieldName]?.message ? (
    <Text
      as="div"
      variant="body-primary"
      size="sm"
      color={colors.error.primary}
      pt="s"
      mt="xs"
      {...props}
    >
      {errors[fieldName].message}
    </Text>
  ) : null
}

export const mapLoginServerErrorToClient = (setError) => (fieldNames) => {
  for (const name of fieldNames) {
    setError(name, { type: 'serverError' })
  }
}

export const mapRegisterServerErrorsToClient = (setError) => (fields) => {
  const keys = Object.keys(fields)
  if (keys.length) {
    return keys.forEach((key) => setError(key, { type: 'serverError' }))
  }
}

export const pickFlyoutProps = (cheerioEl) => {
  let text = cheerioEl
    .contents()
    .filter((_, el) => el.type === 'text')
    .text()
    .trim()
  if (!text?.length) {
    text = cheerioEl.text().trim()
  }
  return {
    ...pick(cheerioEl.get(0), ['attribs', 'name']),
    text,
  }
}
