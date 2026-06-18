import isString from 'lodash/isString'

export const getExperiments = (envControlledExperiments: string, incomingExperiments: string) => {
  let sanitizedEnvControlledExperiments = ''
  let sanitizedIncomingExperiments = ''

  if (isString(envControlledExperiments) && envControlledExperiments.length > 0) {
    sanitizedEnvControlledExperiments = envControlledExperiments
  }

  if (isString(incomingExperiments) && incomingExperiments.length > 0) {
    sanitizedIncomingExperiments = incomingExperiments
  }

  return Array.from(
    new Set(
      sanitizedEnvControlledExperiments.split('-').concat(sanitizedIncomingExperiments.split('-'))
    )
  )
    .filter((expId) => expId.length > 0)
    .sort()
    .join('-')
}
