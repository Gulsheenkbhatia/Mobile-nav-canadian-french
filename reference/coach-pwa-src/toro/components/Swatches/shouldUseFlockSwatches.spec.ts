import shouldUseFlockSwatches from './shouldUseFlockSwatches'

describe('shouldUseFlockSwatches', () => {
  const testCases = [
    // [description, expected, enableFlockColorSwatches, isPDPv6, currentCategoryId]

    // enableFlockColorSwatches = false cases
    ['both flags false, matching category', false, false, false, 'women-handbags'],
    ['both flags false, bags category', false, false, false, 'bags-something'],
    ['both flags false, women-bags category', false, false, false, 'women-bags'],
    ['enableFlock false, matching category', false, false, true, 'women-handbags'],
    ['enableFlock false, bags category', false, false, true, 'bags-something'],
    ['enableFlock false, women-bags category', false, false, true, 'women-bags'],

    // isPDPv6 = false cases
    ['isPDPv6 false, matching category', false, true, false, 'women-handbags'],
    ['isPDPv6 false, bags category', false, true, false, 'bags-something'],
    ['isPDPv6 false, women-bags category', false, true, false, 'women-bags'],
    ['isPDPv6 false, null category', false, true, false, null],

    // Both flags true, matching categories (without prefixes)
    ['both flags true, exact match women-handbags', true, true, true, 'women-handbags'],
    ['both flags true, includes women-handbags', true, true, true, 'some-women-handbags-category'],
    ['both flags true, contains women-handbags', true, true, true, 'prefix-women-handbags-suffix'],
    ['both flags true, exact match bags', true, true, true, 'bags'],
    ['both flags true, starts with bags', true, true, true, 'bags-something'],
    ['both flags true, bags with numbers', true, true, true, 'bags-123'],
    ['both flags true, exact match women-bags', true, true, true, 'women-bags'],
    ['both flags true, includes women-bags', true, true, true, 'some-women-bags-category'],
    ['both flags true, contains women-bags', true, true, true, 'prefix-women-bags-suffix'],

    // Both flags true, matching categories with outlet- prefix
    ['both flags true, outlet-women-handbags', true, true, true, 'outlet-women-handbags'],
    [
      'both flags true, outlet-women-handbags with suffix',
      true,
      true,
      true,
      'outlet-women-handbags-something',
    ],
    ['both flags true, outlet-bags', true, true, true, 'outlet-bags'],
    ['both flags true, outlet-bags with suffix', true, true, true, 'outlet-bags-something'],
    ['both flags true, outlet-bags with numbers', true, true, true, 'outlet-bags-123'],
    ['both flags true, outlet-women-bags', true, true, true, 'outlet-women-bags'],
    [
      'both flags true, outlet-women-bags with suffix',
      true,
      true,
      true,
      'outlet-women-bags-something',
    ],

    // Both flags true, matching categories with retail- prefix
    ['both flags true, retail-women-handbags', true, true, true, 'retail-women-handbags'],
    [
      'both flags true, retail-women-handbags with suffix',
      true,
      true,
      true,
      'retail-women-handbags-something',
    ],
    ['both flags true, retail-bags', true, true, true, 'retail-bags'],
    ['both flags true, retail-bags with suffix', true, true, true, 'retail-bags-something'],
    ['both flags true, retail-bags with numbers', true, true, true, 'retail-bags-123'],
    ['both flags true, retail-women-bags', true, true, true, 'retail-women-bags'],
    [
      'both flags true, retail-women-bags with suffix',
      true,
      true,
      true,
      'retail-women-bags-something',
    ],

    // Both flags true, non-matching categories
    ['both flags true, men-handbags', false, true, true, 'men-handbags'],
    ['both flags true, shoes category', false, true, true, 'shoes'],
    ['both flags true, accessories category', false, true, true, 'accessories'],
    ['both flags true, bags not at start', false, true, true, 'something-bags'],
    ['both flags true, wrong order', false, true, true, 'handbags-women'],
    ['both flags true, other category', false, true, true, 'other-category'],

    // Both flags true, non-matching categories with prefixes
    ['both flags true, outlet-men-handbags', false, true, true, 'outlet-men-handbags'],
    ['both flags true, outlet-shoes', false, true, true, 'outlet-shoes'],
    ['both flags true, retail-men-handbags', false, true, true, 'retail-men-handbags'],
    ['both flags true, retail-shoes', false, true, true, 'retail-shoes'],
    ['both flags true, outlet with bags not at start', false, true, true, 'outlet-something-bags'],
    ['both flags true, retail with bags not at start', false, true, true, 'retail-something-bags'],

    // Edge cases: missing/invalid categoryId
    ['both flags true, null category', false, true, true, null],
    ['both flags true, undefined category', false, true, true, undefined],
    ['both flags true, empty string category', false, true, true, ''],

    // Edge cases: case sensitivity
    ['both flags true, uppercase women-handbags', false, true, true, 'WOMEN-HANDBAGS'],
    ['both flags true, uppercase bags', false, true, true, 'BAGS'],
    ['both flags true, uppercase women-bags', false, true, true, 'WOMEN-BAGS'],

    // Edge cases: partial matches
    ['both flags true, missing s in handbag', false, true, true, 'women-handbag'],
    ['both flags true, bag without s', false, true, true, 'bag'],
    ['both flags true, women-bag without s', false, true, true, 'women-bag'],
  ] as const

  it.each(testCases)(
    '%s - should return %s',
    (description, expected, enableFlock, isPDPv6, categoryId) => {
      expect(shouldUseFlockSwatches(enableFlock, isPDPv6, categoryId)).toBe(expected)
    }
  )
})
