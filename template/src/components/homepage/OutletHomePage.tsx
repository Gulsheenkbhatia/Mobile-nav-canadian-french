import {
  outletHomepageCategories,
  outletHomepageHeroes,
  outletHomepageProductGridMeta,
  outletHomepageProducts,
  outletHomepageStories,
} from '../../data/homepageData'
import { MobileCategoryRail } from './MobileCategoryRail'
import { MobileHero } from './MobileHero'
import { MobileProductGrid } from './MobileProductGrid'
import { MobileStoryBlock } from './MobileStoryBlock'

/** Coach Outlet mobile homepage — scrollable page with outlet pseudo content. */
export function OutletHomePage() {
  const [primaryHero, secondaryHero] = outletHomepageHeroes

  return (
    <main className="pb-coach-xl">
      {primaryHero && <MobileHero hero={primaryHero} />}
      {secondaryHero && <MobileHero hero={secondaryHero} />}
      <MobileCategoryRail categories={outletHomepageCategories} />
      <MobileProductGrid
        products={outletHomepageProducts}
        title={outletHomepageProductGridMeta.title}
        subtitle={outletHomepageProductGridMeta.subtitle}
      />
      {outletHomepageStories.map((story) => (
        <MobileStoryBlock key={story.id} story={story} />
      ))}
    </main>
  )
}
