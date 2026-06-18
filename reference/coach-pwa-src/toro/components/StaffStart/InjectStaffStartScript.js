import Script from 'next/script'
import { useAtomValue } from 'jotai/utils'
import { staffStartScriptsAtom } from 'store/scripts.atom'

const InjectStaffStartScripts = () => {
  const scripts = useAtomValue(staffStartScriptsAtom)
  if (!scripts?.length) return null

  return (
    <>
      {scripts.map((script) => {
        if (script.src) {
          return (
            <Script
              key={script.src}
              src={script.src}
              strategy="afterInteractive"
              className="staff-start-script"
            />
          )
        } else {
          return (
            <Script
              key={script?.id}
              id={`staff-start-inline-${script?.id}`}
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: script.content }}
              className="staff-start-script"
            />
          )
        }
      })}
    </>
  )
}

export default InjectStaffStartScripts
