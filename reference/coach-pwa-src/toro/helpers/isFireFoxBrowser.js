/**
 * Returns `true` if browser is Firefox and `false` if not
 * @return {Boolean}
 */
export default function isFireFoxBrowser() {
  return typeof InstallTrigger !== 'undefined'
}
