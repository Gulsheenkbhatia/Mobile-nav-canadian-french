import {
  homepageCategories,
  homepageHeroes,
  homepageProductGridMeta,
  homepageProducts,
  homepageStories,
  homepageSubnavLinks,
} from '../../data/homepageData'
import { HomepageVideoHero } from './HomepageVideoHero'
import { MobileCategoryRail } from './MobileCategoryRail'
import { MobileHero } from './MobileHero'
import { MobileProductGrid } from './MobileProductGrid'
import { MobileStoryBlock } from './MobileStoryBlock'

/** Coach.com mobile homepage — scrollable page. */
export function CoachHomePage() {
  const [primaryHero, secondaryHero] = homepageHeroes

  return (
    <main className="pb-coach-xl">
      {primaryHero?.videoUrl && (
        <HomepageVideoHero
          title={primaryHero.title}
          primaryCta={primaryHero.primaryCta}
          videoSrc={primaryHero.videoUrl}
          posterSrc={primaryHero.imageUrl}
          subnavLinks={homepageSubnavLinks}
        />
      )}
      {secondaryHero && <MobileHero hero={secondaryHero} />}
      <MobileCategoryRail categories={homepageCategories} />
      <MobileProductGrid
        products={homepageProducts}
        title={homepageProductGridMeta.title}
        subtitle={homepageProductGridMeta.subtitle}
      />
      {homepageStories.map((story) => (
        <MobileStoryBlock key={story.id} story={story} />
      ))}
    </main>
  )
}
