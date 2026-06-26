import { formatPrototypeBuildTimestamp, PROTOTYPE_BUILD_TIME } from '../../utils/prototypeBuildMeta'
import { MenuSearchIconV2 } from '../nav/HeaderIcons'

/** Nav prototype — replaces live homepage content. */
export function PrototypeHomePlaceholder() {
  return (
    <main className="prototype-intro flex flex-1 flex-col bg-coach-white px-coach-m py-coach-xl">
      <div className="prototype-intro__body w-full min-w-0">
        <p className="font-extended text-[20px] font-bold leading-[1.3] tracking-[0.4px] text-coach-black">
          Click{' '}
          <span
            className="mx-0.5 inline-flex align-middle [&_svg]:h-[1.15em] [&_svg]:w-[1.15em]"
            role="img"
            aria-label="menu and search icon"
          >
            <MenuSearchIconV2 />
          </span>{' '}
          to view prototype.
        </p>

        <p className="mt-coach-xl font-extended text-[16px] leading-[1.5] tracking-[0.4px] text-coach-black">
          Best viewed on a mobile device or resize your browser to mobile.
        </p>

        <p className="mt-coach-xl font-extended text-[12px] leading-[1.35] tracking-[0.2px] text-coach-grey-60">
          Last updated {formatPrototypeBuildTimestamp(PROTOTYPE_BUILD_TIME)}.
        </p>
      </div>
    </main>
  )
}
