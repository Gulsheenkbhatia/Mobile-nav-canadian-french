import { formatPrototypeBuildTimestamp, PROTOTYPE_BUILD_TIME } from '../../utils/prototypeBuildMeta'

/** Nav prototype — replaces live homepage content. */
export function PrototypeHomePlaceholder() {
  return (
    <main className="prototype-intro flex flex-1 flex-col bg-coach-white px-coach-m py-coach-xl">
      <div className="prototype-intro__body w-full min-w-0">
        <p className="font-extended text-[16px] leading-[1.5] tracking-[0.4px] text-coach-black">
          This is a demo of Mobile Navigation redesign, it has the latest UI
          refinements, interaction patterns and UI styles. For best experience
          view on a mobile device or resize your browser.
        </p>

        <p className="mt-coach-xl font-extended text-[12px] leading-[1.35] tracking-[0.2px] text-coach-grey-60">
          Last updated {formatPrototypeBuildTimestamp(PROTOTYPE_BUILD_TIME)}.
        </p>
      </div>
    </main>
  )
}
