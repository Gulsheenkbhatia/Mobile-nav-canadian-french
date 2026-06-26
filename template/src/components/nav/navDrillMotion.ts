/** L2/L3 drill panel slide — matches `--transition-duration-drill`. */
export const NAV_DRILL_MS = 500

/** Menu shell slide — matches `--transition-duration-drawer`. */
export const NAV_DRAWER_MS = 400

/** L1 stagger starts while the drawer is still sliding in. */
export const NAV_DRAWER_CONTENT_DELAY_MS = 100

/** Drill stack frame — `title` is the nav row copy the user tapped. */
export type DrillStackEntry = {
  id: string
  title: string
}
