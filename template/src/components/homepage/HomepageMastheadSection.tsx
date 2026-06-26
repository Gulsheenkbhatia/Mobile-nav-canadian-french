import type { HomepageMasthead } from '../../data/homepageContent'

type HomepageMastheadSectionProps = {
  masthead: HomepageMasthead
}

/** &Coach text masthead — coach-nav.vercel.app homepage hero copy block. */
export function HomepageMastheadSection({ masthead }: HomepageMastheadSectionProps) {
  return (
    <section className="px-coach-m pb-coach-lg pt-coach-xl text-center">
      {masthead.logoUrl ? (
        <img
          src={masthead.logoUrl}
          alt="&COACH"
          className="mx-auto block w-[60%] min-w-[210px] max-w-[238px]"
          loading="eager"
        />
      ) : (
        <p className="type-display-4 text-coach-black">&COACH</p>
      )}

      <div
        role="heading"
        aria-level={1}
        className="mx-auto mt-[42px] font-extended text-[24px] font-normal leading-[1.18] tracking-[0.2px] text-coach-black"
      >
        {masthead.title}
      </div>

      <div className="mx-auto mt-[20px] max-w-[21.5rem] font-extended text-[15px] font-normal leading-[1.5] tracking-[0.2px] text-coach-black">
        {masthead.body}
      </div>

      <div className="mt-[38px] flex flex-wrap items-center justify-center gap-x-[24px] gap-y-coach-s">
        <a
          href={masthead.primaryHref}
          className="font-extended text-[14px] font-bold tracking-[0.2px] text-coach-black underline underline-offset-[6px]"
          onClick={(e) => e.preventDefault()}
        >
          {masthead.primaryCta}
        </a>
        {masthead.secondaryCta && (
          <a
            href={masthead.secondaryHref ?? '#'}
            className="font-extended text-[14px] font-bold tracking-[0.2px] text-coach-black underline underline-offset-[6px]"
            onClick={(e) => e.preventDefault()}
          >
            {masthead.secondaryCta}
          </a>
        )}
      </div>
    </section>
  )
}
