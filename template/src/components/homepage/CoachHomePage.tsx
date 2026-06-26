import {
  homepageCategories,
  homepageHeroes,
  homepagePromoModules,
  homepageStories,
  homepageStoriesSectionTitle,
  homepageSubnavLinks,
} from '../../data/homepageData'
import { HomepageSubnav } from './HomepageSubnav'
import { MobileCategoryRail } from './MobileCategoryRail'
import { MobileHero } from './MobileHero'
import { MobileStoryBlock } from './MobileStoryBlock'

/** Coach.com mobile homepage — scrollable page. */
export function CoachHomePage() {
  const [primaryHero, shoulderBagsHero] = homepageHeroes

  return (
    <main className="pb-coach-xl">
      {primaryHero && <MobileHero hero={primaryHero} />}
      <HomepageSubnav links={homepageSubnavLinks} />
      {homepagePromoModules.map((promo) => (
        <MobileHero key={promo.id} hero={promo} />
      ))}
      {shoulderBagsHero && <MobileHero hero={shoulderBagsHero} />}
      <MobileCategoryRail categories={homepageCategories} showShopAll={false} />
      <section className="px-coach-m pt-coach-xl" aria-label={homepageStoriesSectionTitle}>
        <h2 className="type-title-2 mb-coach-lg text-coach-black">
          {homepageStoriesSectionTitle}
        </h2>
        {homepageStories.map((story) => (
          <MobileStoryBlock key={story.id} story={story} />
        ))}
      </section>
    </main>
  )
}
