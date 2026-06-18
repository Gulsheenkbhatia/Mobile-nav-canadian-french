function isLowPoweredDevice(deviceType: string) {
  const checkOutputVersion = (output?: string[], version?: number) =>
    Array.isArray(output) ? Number(output[1]?.trim()) < version : false

  const ua = window.navigator.userAgent
  const isMobile =
    Boolean(deviceType.match(/smartphone|mobile/)) ||
    Boolean(ua?.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))

  const isLegacyVersion =
    checkOutputVersion(/Android ([\d]+)/i.exec(ua), 10) ||
    checkOutputVersion(/OS ([\d]+)/i.exec(ua), 15)

  return isMobile && isLegacyVersion
}

export default isLowPoweredDevice
