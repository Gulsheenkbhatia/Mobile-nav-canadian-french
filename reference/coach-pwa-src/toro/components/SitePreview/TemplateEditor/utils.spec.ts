import type {
  ITemplateComponentConfig,
  ITemplateComponentsKeys,
} from 'toro/helpers/templating/types'
import {
  collectComponentsFromTree,
  convertComponentsMapToList,
  convertTemplateConfigToTree,
  convertTreeToConfig,
  getAvailableComponents,
  getTemplateConfigChanges,
  insertAt,
  insertChildAt,
  removeById,
} from './utils'
import type { ComponentType } from 'react'
import type {
  TemplateTree,
  TemplateTreeNode,
} from 'toro/components/SitePreview/TemplateEditor/types'
import type { UniqueIdentifier } from '@dnd-kit/core'

jest.mock('uuid', () => ({ v4: () => 'uuidv4' }))

describe('convertTemplateConfigToTree', () => {
  it('converts slots into a slot-ordered tree', () => {
    const config: ITemplateComponentConfig['slots'] = {
      SLOT_1: { component: 'MainStage' },
      SLOT_2: {
        component: 'ProductAccordions',
        children: [{ component: 'ProductDetailsAccordion' }, { component: 'DynamicAccordionOne' }],
      },
      SLOT_3: { component: 'Breadcrumbs' },
    }
    const tree = convertTemplateConfigToTree(config)

    expect(tree).toEqual([
      { id: 'uuidv4', component: 'MainStage' },
      {
        id: 'uuidv4',
        component: 'ProductAccordions',
        children: [
          { id: 'uuidv4', component: 'ProductDetailsAccordion' },
          { id: 'uuidv4', component: 'DynamicAccordionOne' },
        ],
      },
      { id: 'uuidv4', component: 'Breadcrumbs' },
    ])
  })

  it('converts nested children at all levels', () => {
    const config = {
      SLOT_1: {
        component: 'MainStage' as const,
        children: [
          {
            component: 'PayInInstallments' as const,
            children: [{ component: 'FreeShippingAndReturns' as const }],
          },
        ],
      },
    }
    const tree = convertTemplateConfigToTree(config)

    expect(tree).toEqual([
      {
        id: 'uuidv4',
        component: 'MainStage',
        children: [
          {
            id: 'uuidv4',
            component: 'PayInInstallments',
            children: [{ id: 'uuidv4', component: 'FreeShippingAndReturns' }],
          },
        ],
      },
    ])
  })
})

describe('convertTreeToConfig', () => {
  it.each([
    {
      name: 'returns empty object for empty tree',
      tree: [] as TemplateTree,
      expected: {},
    },
    {
      name: 'converts single node without children',
      tree: [{ id: 'a', component: 'MainStage' }] as TemplateTree,
      expected: {
        SLOT_1: { component: 'MainStage' },
      },
    },
    {
      name: 'converts single node with children',
      tree: [
        {
          id: 'a',
          component: 'ProductAccordions',
          children: [
            { id: 'b', component: 'ProductDetailsAccordion' },
            { id: 'c', component: 'DynamicAccordionOne' },
          ],
        },
      ] as TemplateTree,
      expected: {
        SLOT_1: {
          component: 'ProductAccordions',
          children: [
            { component: 'ProductDetailsAccordion' },
            { component: 'DynamicAccordionOne' },
          ],
        },
      },
    },
    {
      name: 'converts multiple nodes with mixed children',
      tree: [
        { id: 'a', component: 'MainStage' },
        {
          id: 'b',
          component: 'ProductAccordions',
          children: [
            { id: 'c1', component: 'ProductDetailsAccordion' },
            { id: 'c2', component: 'DynamicAccordionOne' },
          ],
        },
        { id: 'd', component: 'Breadcrumbs' },
      ] as TemplateTree,
      expected: {
        SLOT_1: { component: 'MainStage' },
        SLOT_2: {
          component: 'ProductAccordions',
          children: [
            { component: 'ProductDetailsAccordion' },
            { component: 'DynamicAccordionOne' },
          ],
        },
        SLOT_3: { component: 'Breadcrumbs' },
      },
    },
    {
      name: 'strips ids from output',
      tree: [
        { id: 'uuid-123', component: 'MainStage' },
        { id: 'uuid-456', component: 'Breadcrumbs' },
      ] as TemplateTree,
      expected: {
        SLOT_1: { component: 'MainStage' },
        SLOT_2: { component: 'Breadcrumbs' },
      },
    },
    {
      name: 'omits children when empty array',
      tree: [
        {
          id: 'a',
          component: 'ProductAccordions',
          children: [],
        },
      ] as TemplateTree,
      expected: {
        SLOT_1: { component: 'ProductAccordions' },
      },
    },
    {
      name: 'preserves nested children at all levels',
      tree: [
        {
          id: 'a',
          component: 'MainStage',
          children: [
            {
              id: 'b',
              component: 'PayInInstallments',
              children: [{ id: 'c', component: 'FreeShippingAndReturns' }],
            },
          ],
        },
      ] as TemplateTree,
      expected: {
        SLOT_1: {
          component: 'MainStage',
          children: [
            {
              component: 'PayInInstallments',
              children: [{ component: 'FreeShippingAndReturns' }],
            },
          ],
        },
      },
    },
  ])('$name', ({ tree, expected }) => {
    expect(convertTreeToConfig(tree)).toEqual(expected)
  })
})

describe('convertComponentsMapToList', () => {
  it('returns unique component keys as strings', () => {
    const componentsMap = {
      MainStage: (() => null) as ComponentType,
      Breadcrumbs: (() => null) as ComponentType,
      ProductAccordions: (() => null) as ComponentType,
    } as Record<ITemplateComponentsKeys, ComponentType>

    expect(convertComponentsMapToList(componentsMap)).toEqual([
      'MainStage',
      'Breadcrumbs',
      'ProductAccordions',
    ])
  })
})

describe('collectComponentsFromTree', () => {
  it.each([
    {
      name: 'returns empty array for empty tree',
      tree: [] as TemplateTree,
      expected: [],
    },
    {
      name: 'collects from multiple nesting levels',
      tree: [
        {
          id: 'a',
          component: 'ProductAccordions',
          children: [
            {
              id: 'b',
              component: 'ProductDetailsAccordion',
              children: [{ id: 'c', component: 'DynamicAccordionOne' }],
            },
          ],
        },
      ] as TemplateTree,
      expected: ['ProductAccordions', 'ProductDetailsAccordion', 'DynamicAccordionOne'],
    },
    {
      name: 'skips empty children',
      tree: [
        {
          id: 'a',
          component: 'ProductAccordions',
          children: [],
        },
      ] as TemplateTree,
      expected: ['ProductAccordions'],
    },
  ])('$name', ({ tree, expected }) => {
    expect(collectComponentsFromTree(tree)).toEqual(expected)
  })
})

describe('getAvailableComponents', () => {
  it.each([
    {
      name: 'excludes root-level components',
      components: ['MainStage', 'Breadcrumbs', 'FAQComponent'] as ITemplateComponentsKeys[],
      tree: [
        { id: 'a', component: 'MainStage' },
        {
          id: 'b',
          component: 'ProductAccordions',
          children: [
            { id: 'c', component: 'ProductDetailsAccordion' },
            { id: 'd', component: 'DynamicAccordionOne' },
          ],
        },
        { id: 'e', component: 'Breadcrumbs' },
      ] as TemplateTree,
      expected: ['FAQComponent'],
    },
    {
      name: 'excludes nested children recursively',
      components: [
        'MainStage',
        'ProductAccordions',
        'ProductDetailsAccordion',
        'DynamicAccordionOne',
        'Breadcrumbs',
        'FAQComponent',
      ] as ITemplateComponentsKeys[],
      tree: [
        { id: 'a', component: 'MainStage' },
        {
          id: 'b',
          component: 'ProductAccordions',
          children: [
            { id: 'c', component: 'ProductDetailsAccordion' },
            { id: 'd', component: 'DynamicAccordionOne' },
          ],
        },
        { id: 'e', component: 'Breadcrumbs' },
      ] as TemplateTree,
      expected: ['FAQComponent'],
    },
    {
      name: 'excludes components from multiple nesting levels',
      components: [
        'ProductAccordions',
        'ProductDetailsAccordion',
        'DynamicAccordionOne',
        'FAQComponent',
      ] as ITemplateComponentsKeys[],
      tree: [
        {
          id: 'a',
          component: 'ProductAccordions',
          children: [
            {
              id: 'b',
              component: 'ProductDetailsAccordion',
              children: [{ id: 'c', component: 'DynamicAccordionOne' }],
            },
          ],
        },
      ] as TemplateTree,
      expected: ['FAQComponent'],
    },
    {
      name: 'returns all components when tree is empty',
      components: ['MainStage', 'Breadcrumbs'] as ITemplateComponentsKeys[],
      tree: [] as TemplateTree,
      expected: ['MainStage', 'Breadcrumbs'],
    },
    {
      name: 'returns empty array when all components are used',
      components: ['MainStage', 'Breadcrumbs'] as ITemplateComponentsKeys[],
      tree: [
        { id: 'a', component: 'MainStage' },
        { id: 'b', component: 'Breadcrumbs' },
      ] as TemplateTree,
      expected: [],
    },
  ])('$name', ({ components, tree, expected }) => {
    expect(getAvailableComponents(components, tree)).toEqual(expected)
  })
})

describe('insertAt', () => {
  const a: TemplateTreeNode = { id: 'a', component: 'MainStage' }
  const b: TemplateTreeNode = { id: 'b', component: 'Breadcrumbs' }
  const c: TemplateTreeNode = { id: 'c', component: 'ProductAccordions' }
  const d: TemplateTreeNode = { id: 'd', component: 'FAQComponent' }
  const item: TemplateTreeNode = { id: 'new', component: 'UGCContainer' }

  it.each`
    name                           | array           | index | expected
    ${'inserts at index 0'}        | ${[a, b, c, d]} | ${0}  | ${[item, a, b, c, d]}
    ${'inserts at index 3'}        | ${[a, b, c, d]} | ${3}  | ${[a, b, c, item, d]}
    ${'inserts at last position'}  | ${[a, b, c]}    | ${3}  | ${[a, b, c, item]}
    ${'index beyond array length'} | ${[a, b, c]}    | ${10} | ${[a, b, c, item]}
    ${'negative index'}            | ${[a, b, c]}    | ${-1} | ${[a, b, item, c]}
  `('$name', ({ array, index, expected }) => {
    expect(insertAt({ array, index, item })).toEqual(expected)
  })
})

describe('insertChildAt', () => {
  const item: TemplateTreeNode = { id: 'childId', component: 'FAQComponent' }

  it.each([
    {
      name: 'inserts at index 0 when parent has existing children',
      array: [
        { id: 'uuidv4', component: 'MainStage' },
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [
            { id: 'uuidv4', component: 'ProductDetailsAccordion' },
            { id: 'uuidv4', component: 'DynamicAccordionOne' },
          ],
        },
        { id: 'uuidv4', component: 'Breadcrumbs' },
      ] as TemplateTree,
      index: 0,
      parentId: 'parentId' as UniqueIdentifier,
      expected: [
        { id: 'uuidv4', component: 'MainStage' },
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [
            item,
            { id: 'uuidv4', component: 'ProductDetailsAccordion' },
            { id: 'uuidv4', component: 'DynamicAccordionOne' },
          ],
        },
        { id: 'uuidv4', component: 'Breadcrumbs' },
      ],
    },
    {
      name: 'inserts at index 0 when parent has no children',
      array: [
        { id: 'uuidv4', component: 'MainStage' },
        { id: 'parentId', component: 'ProductAccordions' },
        { id: 'uuidv4', component: 'Breadcrumbs' },
      ] as TemplateTree,
      index: 0,
      parentId: 'parentId' as UniqueIdentifier,
      expected: [
        { id: 'uuidv4', component: 'MainStage' },
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [item],
        },
        { id: 'uuidv4', component: 'Breadcrumbs' },
      ],
    },
    {
      name: 'inserts at second children level',
      array: [
        {
          id: 'level1',
          component: 'ProductAccordions',
          children: [
            {
              id: 'level2Parent',
              component: 'ProductDetailsAccordion',
              children: [
                { id: 'uuidv4', component: 'DynamicAccordionOne' },
                { id: 'uuidv4', component: 'DynamicAccordionTwo' },
              ],
            },
          ],
        },
      ] as TemplateTree,
      index: 1,
      parentId: 'level2Parent' as UniqueIdentifier,
      expected: [
        {
          id: 'level1',
          component: 'ProductAccordions',
          children: [
            {
              id: 'level2Parent',
              component: 'ProductDetailsAccordion',
              children: [
                { id: 'uuidv4', component: 'DynamicAccordionOne' },
                item,
                { id: 'uuidv4', component: 'DynamicAccordionTwo' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'inserts in the middle of children',
      array: [
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [
            { id: 'uuidv4', component: 'ProductDetailsAccordion' },
            { id: 'uuidv4', component: 'DynamicAccordionOne' },
            { id: 'uuidv4', component: 'DynamicAccordionTwo' },
          ],
        },
      ] as TemplateTree,
      index: 2,
      parentId: 'parentId' as UniqueIdentifier,
      expected: [
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [
            { id: 'uuidv4', component: 'ProductDetailsAccordion' },
            { id: 'uuidv4', component: 'DynamicAccordionOne' },
            item,
            { id: 'uuidv4', component: 'DynamicAccordionTwo' },
          ],
        },
      ],
    },
    {
      name: 'inserts at the end of children',
      array: [
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [
            { id: 'uuidv4', component: 'ProductDetailsAccordion' },
            { id: 'uuidv4', component: 'DynamicAccordionOne' },
          ],
        },
      ] as TemplateTree,
      index: 2,
      parentId: 'parentId' as UniqueIdentifier,
      expected: [
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [
            { id: 'uuidv4', component: 'ProductDetailsAccordion' },
            { id: 'uuidv4', component: 'DynamicAccordionOne' },
            item,
          ],
        },
      ],
    },
    {
      name: 'appends when index is beyond children length',
      array: [
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [
            { id: 'uuidv4', component: 'ProductDetailsAccordion' },
            { id: 'uuidv4', component: 'DynamicAccordionOne' },
          ],
        },
      ] as TemplateTree,
      index: 10,
      parentId: 'parentId' as UniqueIdentifier,
      expected: [
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [
            { id: 'uuidv4', component: 'ProductDetailsAccordion' },
            { id: 'uuidv4', component: 'DynamicAccordionOne' },
            item,
          ],
        },
      ],
    },
  ])('$name', ({ array, index, parentId, expected }) => {
    expect(insertChildAt({ array, index, parentId, item })).toEqual(expected)
  })
})

describe('removeById', () => {
  it.each([
    {
      name: 'removes root-level node by id',
      array: [
        { id: 'a', component: 'MainStage' },
        { id: 'toRemove', component: 'ProductAccordions' },
        { id: 'b', component: 'Breadcrumbs' },
      ] as TemplateTree,
      id: 'toRemove' as UniqueIdentifier,
      expected: [
        { id: 'a', component: 'MainStage' },
        { id: 'b', component: 'Breadcrumbs' },
      ],
    },
    {
      name: 'removes nested child by id',
      array: [
        { id: 'a', component: 'MainStage' },
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [
            { id: 'keep', component: 'ProductDetailsAccordion' },
            { id: 'toRemove', component: 'DynamicAccordionOne' },
          ],
        },
        { id: 'b', component: 'Breadcrumbs' },
      ] as TemplateTree,
      id: 'toRemove' as UniqueIdentifier,
      expected: [
        { id: 'a', component: 'MainStage' },
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [{ id: 'keep', component: 'ProductDetailsAccordion' }],
        },
        { id: 'b', component: 'Breadcrumbs' },
      ],
    },
    {
      name: 'removes child at second nesting level',
      array: [
        {
          id: 'level1',
          component: 'ProductAccordions',
          children: [
            {
              id: 'level2Parent',
              component: 'ProductDetailsAccordion',
              children: [
                { id: 'a', component: 'DynamicAccordionOne' },
                { id: 'toRemove', component: 'DynamicAccordionTwo' },
              ],
            },
          ],
        },
      ] as TemplateTree,
      id: 'toRemove' as UniqueIdentifier,
      expected: [
        {
          id: 'level1',
          component: 'ProductAccordions',
          children: [
            {
              id: 'level2Parent',
              component: 'ProductDetailsAccordion',
              children: [{ id: 'a', component: 'DynamicAccordionOne' }],
            },
          ],
        },
      ],
    },
    {
      name: 'removes last child and clears children',
      array: [
        {
          id: 'parentId',
          component: 'ProductAccordions',
          children: [{ id: 'toRemove', component: 'ProductDetailsAccordion' }],
        },
      ] as TemplateTree,
      id: 'toRemove' as UniqueIdentifier,
      expected: [{ id: 'parentId', component: 'ProductAccordions' }],
    },
    {
      name: 'returns tree unchanged when id not found',
      array: [
        { id: 'a', component: 'MainStage' },
        { id: 'b', component: 'Breadcrumbs' },
      ] as TemplateTree,
      id: 'missing' as UniqueIdentifier,
      expected: [
        { id: 'a', component: 'MainStage' },
        { id: 'b', component: 'Breadcrumbs' },
      ],
    },
  ])('$name', ({ array, id, expected }) => {
    expect(removeById({ array, id })).toEqual(expected)
  })
})

describe('getTemplateConfigChanges', () => {
  const baseConfig: ITemplateComponentConfig['slots'] = {
    SLOT_1: { component: 'MainStage' },
    SLOT_2: { component: 'Breadcrumbs' },
    SLOT_3: {
      component: 'ProductAccordions',
      children: [{ component: 'ProductDetailsAccordion' }, { component: 'DynamicAccordionOne' }],
    },
  }

  it.each([
    {
      name: 'includes changed slot when slot root id is in uniqueIds',
      tree: [
        { id: 'slot1', component: 'MainStage' },
        { id: 'slot2', component: 'FAQComponent' },
        {
          id: 'slot3',
          component: 'ProductAccordions',
          children: [
            { id: 's3c1', component: 'ProductDetailsAccordion' },
            { id: 's3c2', component: 'DynamicAccordionOne' },
          ],
        },
      ] as TemplateTree,
      uniqueIds: ['slot2'],
      expected: {
        SLOT_2: { component: 'FAQComponent' },
      },
    },
    {
      name: 'includes changed slot when a descendant id is in uniqueIds',
      tree: [
        { id: 'slot1', component: 'MainStage' },
        { id: 'slot2', component: 'Breadcrumbs' },
        {
          id: 'slot3',
          component: 'ProductAccordions',
          children: [
            { id: 's3c2', component: 'DynamicAccordionOne' },
            { id: 's3c1', component: 'ProductDetailsAccordion' },
          ],
        },
      ] as TemplateTree,
      uniqueIds: ['s3c2'],
      expected: {
        SLOT_3: {
          component: 'ProductAccordions',
          children: [
            { component: 'DynamicAccordionOne' },
            { component: 'ProductDetailsAccordion' },
          ],
        },
      },
    },
  ])('$name', ({ tree, uniqueIds, expected }) => {
    expect(getTemplateConfigChanges(baseConfig, tree, uniqueIds)).toEqual(expected)
  })

  it('includes only the touched root slot when reordering roots (merge mode can shift others)', () => {
    const baseConfig = {
      SLOT_1: { component: 'MainStage' },
      SLOT_2: { component: 'Breadcrumbs' },
      SLOT_3: {
        component: 'ProductAccordions',
        children: [{ component: 'ProductDetailsAccordion' }, { component: 'DynamicAccordionOne' }],
      },
    }

    const tree = [
      { id: 'slot2', component: 'Breadcrumbs' },
      {
        id: 'slot3',
        component: 'ProductAccordions',
        children: [
          { id: 's3c1', component: 'ProductDetailsAccordion' },
          { id: 's3c2', component: 'DynamicAccordionOne' },
        ],
      },
      { id: 'slot1', component: 'MainStage' },
    ] as TemplateTree

    expect(getTemplateConfigChanges(baseConfig as any, tree, ['slot1'])).toEqual({
      SLOT_3: { component: 'MainStage' },
    })
  })

  it('includes touched root even if it deep-equals base slot after other edits (slot1 -> [slot2], then reorder roots)', () => {
    const baseConfig = {
      SLOT_1: { component: 'MainStage' },
      SLOT_2: { component: 'Breadcrumbs' },
      SLOT_3: { component: 'ProductHighlights' },
      SLOT_4: { component: 'FindInStore' },
    }

    const tree = [
      {
        id: 'slot1',
        component: 'MainStage',
        children: [{ id: 'slot2', component: 'Breadcrumbs' }],
      },
      { id: 'slot4', component: 'FindInStore' },
      { id: 'slot3', component: 'ProductHighlights' },
    ] as TemplateTree
    expect(getTemplateConfigChanges(baseConfig as any, tree, ['slot2', 'slot3'])).toEqual({
      SLOT_1: { component: 'MainStage', children: [{ component: 'Breadcrumbs' }] },
      SLOT_3: { component: 'ProductHighlights' },
    })
  })
})
