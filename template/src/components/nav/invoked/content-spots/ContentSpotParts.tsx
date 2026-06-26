import type { StoryBlock } from '../../../../data/v1ContentSpots'
import { toNavHeadlineCase } from '../../../../utils/toNavHeadlineCase'

export function ContentSpotHero({ block }: { block: StoryBlock }) {
  return (
    <button type="button" className="content-spot__hero">
      <img src={block.imageUrl} alt="" className="content-spot__hero-img" />
      <span className="content-spot__hero-copy">
        {block.subtitle && (
          <span className="content-spot__eyebrow">
            {toNavHeadlineCase(block.subtitle)}
          </span>
        )}
        <span className="content-spot__title">{toNavHeadlineCase(block.title)}</span>
      </span>
    </button>
  )
}

export function ContentSpotDuo({ tiles }: { tiles: StoryBlock[] }) {
  return (
    <div className="content-spot__duo">
      {tiles.map((tile) => (
        <button key={tile.id} type="button" className="content-spot__tile">
          <img src={tile.imageUrl} alt="" className="content-spot__tile-img" />
          <span className="content-spot__tile-label">
            {toNavHeadlineCase(tile.title)}
          </span>
        </button>
      ))}
    </div>
  )
}
