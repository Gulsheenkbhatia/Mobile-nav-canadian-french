/**
 * Static Coach-style nav tree for the browser template.
 * Swap or extend this file — it is not wired to SFCC.
 */

export type NavLinkItem = {
  id: string
  label: string
  /** If no children, row is a plain link */
  href?: string
  children?: { id: string; label: string; href: string }[]
}

export type Tier1Category = {
  id: string
  label: string
  items: NavLinkItem[]
}

export const coachNavMock: Tier1Category[] = [
  {
    id: 'women',
    label: 'Women',
    items: [
      { id: 'w-all', label: 'View All', href: '#' },
      { id: 'w-new', label: 'New', href: '#' },
      {
        id: 'w-best',
        label: 'Bestsellers',
        children: [
          { id: 'w-best-1', label: 'Shop All Bestsellers', href: '#' },
          { id: 'w-best-2', label: 'Bags', href: '#' },
        ],
      },
      {
        id: 'w-bags',
        label: 'Bags',
        children: [
          { id: 'w-bags-1', label: 'View All Bags', href: '#' },
          { id: 'w-bags-2', label: 'Crossbody', href: '#' },
          { id: 'w-bags-3', label: 'Shoulder Bags', href: '#' },
        ],
      },
      {
        id: 'w-wallets',
        label: 'Wallets',
        children: [
          { id: 'w-wal-1', label: 'View All Wallets', href: '#' },
          { id: 'w-wal-2', label: 'Small Wallets', href: '#' },
        ],
      },
      { id: 'w-charms', label: 'Charms & Straps', href: '#' },
      {
        id: 'w-shoes',
        label: 'Shoes',
        children: [
          { id: 'w-sh-1', label: 'View All Shoes', href: '#' },
          { id: 'w-sh-2', label: 'Sneakers', href: '#' },
        ],
      },
      {
        id: 'w-clothing',
        label: 'Clothing',
        children: [
          { id: 'w-cl-1', label: 'View All Clothing', href: '#' },
          { id: 'w-cl-2', label: 'Outerwear', href: '#' },
        ],
      },
      {
        id: 'w-acc',
        label: 'Accessories',
        children: [
          { id: 'w-ac-1', label: 'View All Accessories', href: '#' },
          { id: 'w-ac-2', label: 'Belts', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'men',
    label: 'Men',
    items: [
      { id: 'm-all', label: 'View All', href: '#' },
      { id: 'm-new', label: 'New', href: '#' },
      {
        id: 'm-bags',
        label: 'Bags',
        children: [
          { id: 'm-b1', label: 'Messenger', href: '#' },
          { id: 'm-b2', label: 'Backpacks', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'bags',
    label: 'Bags',
    items: [
      { id: 'b-all', label: 'View All', href: '#' },
      { id: 'b-cross', label: 'Crossbody Bags', href: '#' },
      { id: 'b-tote', label: 'Totes', href: '#' },
    ],
  },
  {
    id: 'new',
    label: 'New',
    items: [
      { id: 'n-all', label: 'View All New', href: '#' },
      { id: 'n-bags', label: 'New Bags', href: '#' },
    ],
  },
  {
    id: 'gifts',
    label: 'Gifts',
    items: [
      { id: 'g-all', label: 'View All Gifts', href: '#' },
      { id: 'g-personal', label: 'Personalization', href: '#' },
    ],
  },
  {
    id: 'coachtopia',
    label: 'Coachtopia',
    items: [
      { id: 'c-all', label: 'View All', href: '#' },
      { id: 'c-bags', label: 'Bags', href: '#' },
    ],
  },
]

export const footerUtilityMock = [
  { id: 'login', label: 'Login', icon: 'user' as const },
  { id: 'usd', label: '$USD', icon: 'flag' as const },
  { id: 'track', label: 'Track Order', icon: 'box' as const },
  { id: 'help', label: 'Help', icon: 'chat' as const },
]
