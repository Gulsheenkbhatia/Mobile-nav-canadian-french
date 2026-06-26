import type { HomepageCategory } from '../../data/homepageData'
import { CoachtopiaLogo, isCoachtopiaCategory } from '../nav/CoachLogos'

type MobileCategoryRailProps = {
  categories: HomepageCategory[]
  title?: string
  showShopAll?: boolean
}

export function MobileCategoryRail({
  categories,
  title,
  showShopAll = true,
}: MobileCategoryRailProps) {
  const sectionLabel = title ?? 'Shop by category'

  return (
    <section className="py-coach-lg" aria-label={sectionLabel}>
      {(title || showShopAll) && (
        <div className="mb-coach-m flex items-end justify-between px-coach-m">
          {title ? (
            <h2 className="type-title-2 text-coach-black">{title}</h2>
          ) : (
            <span className="type-title-2 text-coach-black">{sectionLabel}</span>
          )}
          {showShopAll && (
            <button
              type="button"
              className="text-sm tracking-[0.2px] text-coach-black underline underline-offset-2"
            >
              Shop all
            </button>
          )}
        </div>
      )}
      <div className="home-category-rail__scroll">
        {categories.map((category) => (
          <a
            key={category.id}
            href="#"
            className="home-category-rail__tile"
            onClick={(e) => e.preventDefault()}
          >
            <div
              className="home-category-rail__image"
              style={
                category.imageUrl
                  ? {
                      backgroundImage: `url(${category.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : { background: category.imageBg }
              }
            />
            <p className="mt-coach-xs flex justify-center text-sm font-bold tracking-[0.2px]">
              {isCoachtopiaCategory(category.id) ? (
                <CoachtopiaLogo height={14} />
              ) : (
                category.name
              )}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
