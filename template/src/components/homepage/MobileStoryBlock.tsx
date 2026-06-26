import { CoachButton } from './CoachButton'
import type { HomepageStory } from '../../data/homepageData'

type MobileStoryBlockProps = {
  story: HomepageStory
}

export function MobileStoryBlock({ story }: MobileStoryBlockProps) {
  return (
    <section className="border-t border-coach-grey-20" aria-label={story.title}>
      <div
        className="home-story-block__image"
        style={{ background: story.imageBg }}
        aria-hidden
      />
      <div className="px-coach-m py-coach-xl">
        <p className="type-eyebrow mb-coach-s text-coach-grey-60">{story.eyebrow}</p>
        <h2 className="type-title-2 text-balance text-coach-black">{story.title}</h2>
        <p className="type-body-2 mt-coach-m text-coach-grey-70">{story.body}</p>
        <div className="mt-coach-lg">
          <CoachButton variant="primary">{story.cta}</CoachButton>
        </div>
      </div>
    </section>
  )
}
