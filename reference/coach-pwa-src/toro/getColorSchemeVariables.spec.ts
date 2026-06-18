import { generateVariableDeclarations } from './getColorSchemeVariables'

describe('generateVariableDeclarations should return list of declared CSS variables for color scheming', () => {
  it('returns correct declarations', () => {
    const schemeName = 'darkThemeNAV'
    const variables = {
      'bg-color': 'var(--color-neutral-dark-1, #161616)',
      'text-color': 'var(--color-neutral-light)',
    }
    const result = generateVariableDeclarations(schemeName, variables)

    expect(result).toEqual({
      '--scheme-bg-color':
        'var(--scheme-darkThemeNAV-bg-color, var(--scheme-default-bg-color, var(--color-neutral-dark-1, #161616)))',
      '--scheme-text-color':
        'var(--scheme-darkThemeNAV-text-color, var(--scheme-default-text-color, var(--color-neutral-light)))',
    })
  })
})
