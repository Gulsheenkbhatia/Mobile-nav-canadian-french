import {
  mergeTemplateComponentConfig,
  getTemplateComponentConfig,
} from 'toro/helpers/templating/merge'
import {
  ITemplateComponentConfig,
  IOverrideTemplateComponentConfig,
  TemplateRenderMode,
} from 'toro/helpers/templating/types'
import BASE_CONFIG from 'toro/helpers/templating/baseConfig'

describe('mergeTemplateComponentConfig', () => {
  it('should return base config when override is empty', () => {
    const result = mergeTemplateComponentConfig(BASE_CONFIG, {
      renderMode: TemplateRenderMode.MERGE,
      slots: {},
    })
    expect(result).toEqual(BASE_CONFIG)
  })

  describe('component positioning and deduplication', () => {
    it.each<{
      description: string
      base: ITemplateComponentConfig['slots']
      override: Partial<ITemplateComponentConfig>
      expected: ITemplateComponentConfig['slots']
    }>([
      {
        description: 'insert new component at position and shift subsequent items',
        base: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'FindInStore' },
          SLOT_3: { component: 'ProductHighlights' },
        },
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_2: { component: 'SearchExpose' },
          },
        },
        expected: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'SearchExpose' },
          SLOT_3: { component: 'FindInStore' },
          SLOT_4: { component: 'ProductHighlights' },
        },
      },
      {
        description: 'move component from later to earlier position (deduplication)',
        base: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'FindInStore' },
          SLOT_3: { component: 'ProductHighlights' },
          SLOT_4: { component: 'YouMayAlsoLike' },
        },
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_2: { component: 'YouMayAlsoLike' },
          },
        },
        expected: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'YouMayAlsoLike' },
          SLOT_3: { component: 'FindInStore' },
          SLOT_4: { component: 'ProductHighlights' },
        },
      },
      {
        description: 'move multiple components to new positions',
        base: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'FindInStore' },
          SLOT_3: { component: 'ProductHighlights' },
          SLOT_4: { component: 'YouMayAlsoLike' },
          SLOT_5: { component: 'SearchExpose' },
          SLOT_6: { component: 'RecentlyViewed' },
        },
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_2: { component: 'YouMayAlsoLike' },
            SLOT_4: { component: 'RecentlyViewed' },
          },
        },
        expected: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'YouMayAlsoLike' },
          SLOT_3: { component: 'FindInStore' },
          SLOT_4: { component: 'RecentlyViewed' },
          SLOT_5: { component: 'ProductHighlights' },
          SLOT_6: { component: 'SearchExpose' },
        },
      },
      {
        description: 'insert component at position beyond current length',
        base: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'FindInStore' },
        },
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_5: { component: 'YouMayAlsoLike' },
          },
        },
        expected: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'FindInStore' },
          SLOT_3: { component: 'YouMayAlsoLike' },
        },
      },
    ])('should $description', ({ base, override, expected }) => {
      const result = mergeTemplateComponentConfig(base, override)
      expect(result).toEqual(expected)
    })
  })

  describe('nested children handling', () => {
    it.each<{
      description: string
      base: ITemplateComponentConfig['slots']
      override: Partial<ITemplateComponentConfig>
      expected: ITemplateComponentConfig['slots']
    }>([
      {
        description: 'preserve children when parent is not moved',
        base: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: {
            component: 'ProductAccordions',
            children: [
              { component: 'ProductDetailsAccordion' },
              { component: 'DynamicAccordionOne' },
            ],
          },
          SLOT_3: { component: 'SearchExpose' },
        },
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_1: { component: 'YouMayAlsoLike' },
          },
        },
        expected: {
          SLOT_1: { component: 'YouMayAlsoLike' },
          SLOT_2: { component: 'PayInInstallments' },
          SLOT_3: {
            component: 'ProductAccordions',
            children: [
              { component: 'ProductDetailsAccordion' },
              { component: 'DynamicAccordionOne' },
            ],
          },
          SLOT_4: { component: 'SearchExpose' },
        },
      },
      {
        description: 'remove child from parent when child is repositioned',
        base: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: {
            component: 'ProductAccordions',
            children: [
              { component: 'ProductDetailsAccordion' },
              { component: 'DynamicAccordionOne' },
              { component: 'DynamicAccordionTwo' },
            ],
          },
          SLOT_3: { component: 'SearchExpose' },
        },
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_2: { component: 'DynamicAccordionOne' },
          },
        },
        expected: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'DynamicAccordionOne' },
          SLOT_3: {
            component: 'ProductAccordions',
            children: [
              { component: 'ProductDetailsAccordion' },
              { component: 'DynamicAccordionTwo' },
            ],
          },
          SLOT_4: { component: 'SearchExpose' },
        },
      },
      {
        description: 'remove children property when all children are repositioned',
        base: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: {
            component: 'ProductAccordions',
            children: [{ component: 'ProductDetailsAccordion' }],
          },
          SLOT_3: { component: 'SearchExpose' },
        },
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_1: { component: 'ProductDetailsAccordion' },
          },
        },
        expected: {
          SLOT_1: { component: 'ProductDetailsAccordion' },
          SLOT_2: { component: 'PayInInstallments' },
          SLOT_3: { component: 'ProductAccordions' },
          SLOT_4: { component: 'SearchExpose' },
        },
      },
      {
        description: 'move child component between different parents',
        base: {
          SLOT_1: {
            component: 'ProductAccordions',
            children: [
              { component: 'ProductDetailsAccordion' },
              { component: 'DynamicAccordionOne' },
            ],
          },
          SLOT_2: { component: 'SearchExpose' },
        },
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_2: {
              component: 'TabbedContentModuleOne',
              children: [{ component: 'DynamicAccordionOne' }],
            },
          },
        },
        expected: {
          SLOT_1: {
            component: 'ProductAccordions',
            children: [{ component: 'ProductDetailsAccordion' }],
          },
          SLOT_2: {
            component: 'TabbedContentModuleOne',
            children: [{ component: 'DynamicAccordionOne' }],
          },
          SLOT_3: { component: 'SearchExpose' },
        },
      },
    ])('should $description', ({ base, override, expected }) => {
      const result = mergeTemplateComponentConfig(base, override)
      expect(result).toEqual(expected)
    })
  })

  describe('validation', () => {
    it.each<{
      description: string
      override: Partial<ITemplateComponentConfig>
      expectedErrors: string[]
    }>([
      {
        description: 'invalid component name',
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_2: { component: 'InvalidComponent' as any },
          },
        },
        expectedErrors: [
          'Invalid component "InvalidComponent" in SLOT_2. Such component does not exist.',
        ],
      },
      {
        description: 'invalid child component name',
        override: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_2: {
              component: 'ProductAccordions',
              children: [{ component: 'InvalidChild' as any }],
            },
          },
        },
        expectedErrors: [
          'Invalid child component "InvalidChild" at index 0 in SLOT_2. Such component does not exist.',
        ],
      },
      {
        description: 'invalid render mode',
        override: {
          renderMode: 'invalid' as any,
          slots: {
            SLOT_2: { component: 'PayInInstallments' },
          },
        },
        expectedErrors: [
          'Invalid render mode "invalid". Valid render modes are merge and replace.',
        ],
      },
    ])(
      'should log error and return base config for $description',
      ({ override, expectedErrors }) => {
        const base: ITemplateComponentConfig['slots'] = {
          SLOT_1: { component: 'PayInInstallments' },
        }

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

        const result = mergeTemplateComponentConfig(base, override)

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to merge template component config. Errors:',
          expectedErrors
        )
        expect(result).toEqual(base)

        consoleErrorSpy.mockRestore()
      }
    )
  })

  describe('replace render mode', () => {
    it('should return override slots directly when renderMode is replace', () => {
      const base: ITemplateComponentConfig['slots'] = {
        SLOT_1: { component: 'PayInInstallments' },
        SLOT_2: { component: 'FindInStore' },
        SLOT_3: { component: 'ProductHighlights' },
      }

      const override: Partial<ITemplateComponentConfig> = {
        renderMode: TemplateRenderMode.REPLACE,
        slots: {
          SLOT_1: { component: 'YouMayAlsoLike' },
          SLOT_2: { component: 'SearchExpose' },
        },
      }

      const result = mergeTemplateComponentConfig(base, override)

      expect(result).toEqual(override.slots)
    })
  })
})

describe('getTemplateComponentConfig', () => {
  const baseConfig: ITemplateComponentConfig['slots'] = {
    SLOT_1: { component: 'PayInInstallments' },
    SLOT_2: { component: 'FindInStore' },
    SLOT_3: { component: 'ProductHighlights' },
    SLOT_4: { component: 'YouMayAlsoLike' },
  }

  it('should return base config when no overrides provided', () => {
    const result = getTemplateComponentConfig({
      defaultConfig: baseConfig,
      overrideConfig: {},
      activeExperiments: [],
    })
    expect(result).toEqual(baseConfig)
  })

  describe('experiment override application', () => {
    it.each<{
      description: string
      overrideConfig: IOverrideTemplateComponentConfig
      activeExperiments: string[]
      expected: ITemplateComponentConfig['slots']
    }>([
      {
        description: 'apply experiment overrides when experiment is active',
        overrideConfig: {
          test_123: {
            renderMode: TemplateRenderMode.MERGE,
            slots: {
              SLOT_3: { component: 'RecentlyViewed' },
            },
          },
        },
        activeExperiments: ['test_123'],
        expected: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'FindInStore' },
          SLOT_3: { component: 'RecentlyViewed' },
          SLOT_4: { component: 'ProductHighlights' },
          SLOT_5: { component: 'YouMayAlsoLike' },
        },
      },
      {
        description: 'not apply experiment overrides when experiment is inactive',
        overrideConfig: {
          test_123: {
            renderMode: TemplateRenderMode.MERGE,
            slots: {
              SLOT_3: { component: 'RecentlyViewed' },
            },
          },
        },
        activeExperiments: ['different_experiment'],
        expected: baseConfig,
      },
      {
        description: 'apply only first experiment when multiple are active',
        overrideConfig: {
          test_123: {
            renderMode: TemplateRenderMode.MERGE,
            slots: {
              SLOT_2: { component: 'SearchExpose' },
            },
          },
          test_456: {
            renderMode: TemplateRenderMode.MERGE,
            slots: {
              SLOT_3: { component: 'RecentlyViewed' },
            },
          },
        },
        activeExperiments: ['test_123', 'test_456'],
        expected: {
          SLOT_1: { component: 'PayInInstallments' },
          SLOT_2: { component: 'SearchExpose' },
          SLOT_3: { component: 'FindInStore' },
          SLOT_4: { component: 'ProductHighlights' },
          SLOT_5: { component: 'YouMayAlsoLike' },
        },
      },
      {
        description: 'handle empty experiments object',
        overrideConfig: {},
        activeExperiments: ['test_123'],
        expected: baseConfig,
      },
      {
        description: 'handle experiment with component deduplication',
        overrideConfig: {
          test_123: {
            renderMode: TemplateRenderMode.MERGE,
            slots: {
              SLOT_1: { component: 'ProductHighlights' },
            },
          },
        },
        activeExperiments: ['test_123'],
        expected: {
          SLOT_1: { component: 'ProductHighlights' },
          SLOT_2: { component: 'PayInInstallments' },
          SLOT_3: { component: 'FindInStore' },
          SLOT_4: { component: 'YouMayAlsoLike' },
        },
      },
      {
        description: 'apply replace render mode experiment',
        overrideConfig: {
          test_123: {
            renderMode: TemplateRenderMode.REPLACE,
            slots: {
              SLOT_1: { component: 'SearchExpose' },
              SLOT_2: { component: 'RecentlyViewed' },
            },
          },
        },
        activeExperiments: ['test_123'],
        expected: {
          SLOT_1: { component: 'SearchExpose' },
          SLOT_2: { component: 'RecentlyViewed' },
        },
      },
    ])('should $description', ({ overrideConfig, activeExperiments, expected }) => {
      const result = getTemplateComponentConfig({
        defaultConfig: baseConfig,
        overrideConfig,
        activeExperiments,
      })
      expect(result).toEqual(expected)
    })
  })

  describe('multiple experiments warning', () => {
    it('should log warning and apply only first experiment when multiple are active', () => {
      const overrideConfig: IOverrideTemplateComponentConfig = {
        test_123: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_2: { component: 'SearchExpose' },
          },
        },
        test_456: {
          renderMode: TemplateRenderMode.MERGE,
          slots: {
            SLOT_3: { component: 'RecentlyViewed' },
          },
        },
      }

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      const result = getTemplateComponentConfig({
        defaultConfig: baseConfig,
        overrideConfig,
        activeExperiments: ['test_123', 'test_456'],
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Multiple experiment overrides found. Only the first one will be applied.'
      )
      expect(result).toEqual({
        SLOT_1: { component: 'PayInInstallments' },
        SLOT_2: { component: 'SearchExpose' },
        SLOT_3: { component: 'FindInStore' },
        SLOT_4: { component: 'ProductHighlights' },
        SLOT_5: { component: 'YouMayAlsoLike' },
      })

      consoleErrorSpy.mockRestore()
    })
  })
})

describe('recursive component collection and deduplication', () => {
  it('should recursively find and deduplicate deeply nested components', () => {
    const base: ITemplateComponentConfig['slots'] = {
      SLOT_1: { component: 'PayInInstallments' },
      SLOT_2: {
        component: 'ProductAccordions',
        children: [
          { component: 'ProductDetailsAccordion' },
          {
            component: 'TabbedContentModuleOne',
            children: [{ component: 'ContentAreaOne' }, { component: 'DynamicAccordionOne' }],
          },
        ],
      },
      SLOT_3: { component: 'SearchExpose' },
    }

    const override: Partial<ITemplateComponentConfig> = {
      renderMode: TemplateRenderMode.MERGE,
      slots: {
        SLOT_1: { component: 'DynamicAccordionOne' },
      },
    }

    const result = mergeTemplateComponentConfig(base, override)

    expect(result).toEqual({
      SLOT_1: { component: 'DynamicAccordionOne' },
      SLOT_2: { component: 'PayInInstallments' },
      SLOT_3: {
        component: 'ProductAccordions',
        children: [
          { component: 'ProductDetailsAccordion' },
          {
            component: 'TabbedContentModuleOne',
            children: [{ component: 'ContentAreaOne' }],
          },
        ],
      },
      SLOT_4: { component: 'SearchExpose' },
    })
  })

  it('should handle multiple levels of nesting when repositioning components', () => {
    const base: ITemplateComponentConfig['slots'] = {
      SLOT_1: {
        component: 'MainStage',
        children: [
          {
            component: 'ProductAccordions',
            children: [
              {
                component: 'TabbedContentModuleOne',
                children: [{ component: 'ContentAreaOne' }],
              },
              { component: 'DynamicAccordionOne' },
            ],
          },
          { component: 'FeaturedContent' },
        ],
      },
      SLOT_2: { component: 'YouMayAlsoLike' },
    }

    const override: Partial<ITemplateComponentConfig> = {
      renderMode: TemplateRenderMode.MERGE,
      slots: {
        SLOT_2: { component: 'ContentAreaOne' },
      },
    }

    const result = mergeTemplateComponentConfig(base, override)

    expect(result).toEqual({
      SLOT_1: {
        component: 'MainStage',
        children: [
          {
            component: 'ProductAccordions',
            children: [
              { component: 'TabbedContentModuleOne' },
              { component: 'DynamicAccordionOne' },
            ],
          },
          { component: 'FeaturedContent' },
        ],
      },
      SLOT_2: { component: 'ContentAreaOne' },
      SLOT_3: { component: 'YouMayAlsoLike' },
    })
  })

  it('should recursively remove all instances of moved components across multiple parents', () => {
    const base: ITemplateComponentConfig['slots'] = {
      SLOT_1: {
        component: 'ProductAccordions',
        children: [{ component: 'DynamicAccordionOne' }],
      },
      SLOT_2: {
        component: 'TabbedContentModuleOne',
        children: [{ component: 'ContentAreaOne' }, { component: 'DynamicAccordionOne' }],
      },
      SLOT_3: { component: 'SearchExpose' },
    }

    const override: Partial<ITemplateComponentConfig> = {
      renderMode: TemplateRenderMode.MERGE,
      slots: {
        SLOT_1: { component: 'DynamicAccordionOne' },
      },
    }

    const result = mergeTemplateComponentConfig(base, override)

    expect(result).toEqual({
      SLOT_1: { component: 'DynamicAccordionOne' },
      SLOT_2: { component: 'ProductAccordions' },
      SLOT_3: {
        component: 'TabbedContentModuleOne',
        children: [{ component: 'ContentAreaOne' }],
      },
      SLOT_4: { component: 'SearchExpose' },
    })
  })

  it('should handle nested structures in override configuration', () => {
    const base: ITemplateComponentConfig['slots'] = {
      SLOT_1: { component: 'PayInInstallments' },
      SLOT_2: { component: 'FindInStore' },
      SLOT_3: { component: 'ProductHighlights' },
      SLOT_4: {
        component: 'ProductAccordions',
        children: [{ component: 'DynamicAccordionOne' }],
      },
    }

    const override: Partial<ITemplateComponentConfig> = {
      renderMode: TemplateRenderMode.MERGE,
      slots: {
        SLOT_2: {
          component: 'TabbedContentModuleOne',
          children: [{ component: 'DynamicAccordionOne' }, { component: 'ContentAreaOne' }],
        },
      },
    }

    const result = mergeTemplateComponentConfig(base, override)

    expect(result).toEqual({
      SLOT_1: { component: 'PayInInstallments' },
      SLOT_2: {
        component: 'TabbedContentModuleOne',
        children: [{ component: 'DynamicAccordionOne' }, { component: 'ContentAreaOne' }],
      },
      SLOT_3: { component: 'FindInStore' },
      SLOT_4: { component: 'ProductHighlights' },
      SLOT_5: { component: 'ProductAccordions' },
    })
  })
})
