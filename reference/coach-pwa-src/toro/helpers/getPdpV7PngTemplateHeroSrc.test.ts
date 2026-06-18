import getPdpV7PngTemplateHeroSrc from 'toro/helpers/getPdpV7PngTemplateHeroSrc'

describe('getPdpV7PngTemplateHeroSrc', () => {
  const config = {
    enable: true,
    Scene7Template: 'pngTemplate',
    Preset: 'png',
    zoomPreset: 'pngZoom',
    offset: '0.035',
  }

  it('returns null when disabled or invalid', () => {
    expect(getPdpV7PngTemplateHeroSrc('', false, config)).toBeNull()
    expect(getPdpV7PngTemplateHeroSrc('not-a-url', false, config)).toBeNull()
    expect(
      getPdpV7PngTemplateHeroSrc(
        'https://katespade.scene7.com/is/image/KateSpade/KN185_600',
        false,
        {
          ...config,
          enable: false,
        }
      )
    ).toBeNull()
  })

  it('builds png template URL with $sku and $offset from standard product path', () => {
    const src = 'https://katespade.scene7.com/is/image/KateSpade/KN185_600?$mobileProductV3$'
    const result = getPdpV7PngTemplateHeroSrc(src, false, config)
    expect(result).toContain('/pngTemplate')
    expect(result).toContain('$sku=KN185_600')
    expect(result).toContain('$offset=0.035')
    expect(result).toContain('$png$')
  })
})
