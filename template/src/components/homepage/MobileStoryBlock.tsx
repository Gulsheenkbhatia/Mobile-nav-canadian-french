import { CoachButton } from './CoachButton'
import type { HomepageStory } from '../../data/homepageData'

type MobileStoryBlockProps = {
  story: HomepageStory
}

export function MobileStoryBlock({ story }: MobileStoryBlockProps) {
  const imageStyle = story.imageUrl
    ? {
        backgroundImage: `url(${story.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: story.imageBg }

  return (
    <section className="border-t border-coach-grey-20" aria-label={story.title}>
      <div className="home-story-block__image" style={imageStyle} aria-hidden />
      <div className="px-coach-m py-coach-xl">
        <p className="type-eyebrow mb-coach-s text-coach-grey-60">{story.eyebrow}</p>
        <h2 className="type-title-2 text-balance text-coach-black">{story.title}</h2>
        {story.body && (
          <p className="type-body-2 mt-coach-m text-coach-grey-70">{story.body}</p>
        )}
        <div className="mt-coach-lg flex flex-col items-start gap-coach-s">
          <CoachButton variant="primary">{story.cta}</CoachButton>
          {story.secondaryCta && (
            <button
              type="button"
              className="min-h-11 px-1 py-2 text-sm tracking-[0.3px] text-coach-black underline underline-offset-2"
            >
              {story.secondaryCta}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
