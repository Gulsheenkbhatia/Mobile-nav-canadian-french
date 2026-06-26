import type { HomepageCategoryGroup, HomepageLink, HomepageShoulderBags } from '../../data/homepageContent'

function UnderlinedLink({ label, href }: HomepageLink) {
  return (
    <a
      href={href}
      onClick={(e) => e.preventDefault()}
      className="text-sm font-bold tracking-[0.2px] text-coach-black underline underline-offset-4"
    >
      {label}
    </a>
  )
}

type HomepageLowerModulesProps = {
  shoulderBags: HomepageShoulderBags
  shopByCategory: HomepageCategoryGroup[]
  storiesSectionTitle: string
}

/** Shoulder bags feature, shop-by-category links, and editorial heading. */
export function HomepageLowerModules({
  shoulderBags,
  shopByCategory,
  storiesSectionTitle,
}: HomepageLowerModulesProps) {
  const [firstImage, secondImage] = shoulderBags.images

  return (
    <>
      <section aria-label="Bags feature">
        {firstImage && (
          <img src={firstImage.src} alt={firstImage.alt} loading="lazy" className="block w-full" />
        )}
        <div className="px-coach-m pt-coach-m">
          <h2 className="type-title-2 max-w-[20rem] text-balance text-coach-black">
            {shoulderBags.title}
          </h2>
          <div className="mt-coach-s flex flex-wrap items-center gap-x-coach-m gap-y-coach-s">
            {shoulderBags.links.map((link) => (
              <UnderlinedLink key={link.label} {...link} />
            ))}
          </div>
        </div>
        {secondImage && (
          <img
            src={secondImage.src}
            alt={secondImage.alt}
            loading="lazy"
            className="mt-coach-m block w-full"
          />
        )}
      </section>

      <section aria-label="Shop by category" className="mt-coach-m bg-coach-page py-coach-xl">
        <ul className="flex flex-col gap-coach-xl text-center">
          {shopByCategory.map((group) => (
            <li key={group.title}>
              <h3 className="type-title-2 text-coach-black">{group.title}</h3>
              <div className="mt-coach-m flex flex-col items-center gap-coach-s">
                {group.links.map((link) => (
                  <UnderlinedLink key={link.label} {...link} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Editorial" className="px-coach-m py-coach-xl text-center">
        <h2 className="type-title-1 text-coach-black">{storiesSectionTitle}</h2>
      </section>
    </>
  )
}
