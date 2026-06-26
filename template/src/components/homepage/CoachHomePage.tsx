import { homepageContent } from '../../data/homepageContent'
import { HomepageLowerModules } from './HomepageLowerModules'
import { HomepageMastheadSection } from './HomepageMastheadSection'
import { HomepagePrimarySubnav } from './HomepagePrimarySubnav'
import { HomepageShowcase } from './HomepageShowcase'

type CoachHomePageProps = {
  /** Hide the in-page primary subnav when the retail header is shown (coach-nav default). */
  showSubnav?: boolean
}

/** Coach.com mobile homepage — matches coach-nav.vercel.app scrollable content. */
export function CoachHomePage({ showSubnav = true }: CoachHomePageProps) {
  const { masthead, cards, primarySubnav, shoulderBags, shopByCategory, storiesSectionTitle } =
    homepageContent

  return (
    <>
      {showSubnav && <HomepagePrimarySubnav links={primarySubnav} />}

      <main className="pb-coach-xl">
        <HomepageMastheadSection masthead={masthead} />
        <HomepageShowcase cards={cards} />
        <HomepageLowerModules
          shoulderBags={shoulderBags}
          shopByCategory={shopByCategory}
          storiesSectionTitle={storiesSectionTitle}
        />
      </main>
    </>
  )
}
