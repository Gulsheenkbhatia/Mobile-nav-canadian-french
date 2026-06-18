import type { NextApiRequest } from 'next'
import { getOnModelFlags } from './onModel'
import isExperimentEnabled from 'toro/helpers/isExperimentEnabled'
import getViewportByReq from 'toro/helpers/getViewportByReq'
import { EXPERIMENTS } from 'toro/constants/experiments'

// Mock dependencies
jest.mock('toro/helpers/isExperimentEnabled')
jest.mock('toro/helpers/getViewportByReq')

const mockIsExperimentEnabled = isExperimentEnabled as jest.MockedFunction<
  typeof isExperimentEnabled
>
const mockGetViewportByReq = getViewportByReq as jest.MockedFunction<typeof getViewportByReq>
const mockReq = {} as NextApiRequest

describe('getOnModelFlags', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetViewportByReq.mockReturnValue('mobile')
  })

  describe('Early Return Conditions', () => {
    it.each([undefined, null])(
      'should return empty object when onModelPLPAttribute is %p',
      (testCase) => {
        const result = getOnModelFlags(mockReq, testCase)
        expect(result).toEqual({})
      }
    )

    it('should return empty object when onModelPLPAttribute.enable is false', () => {
      const onModelPLPAttribute = {
        enable: false,
        images: ['image1.jpg', 'image2.jpg'],
      }
      const result = getOnModelFlags(mockReq, onModelPLPAttribute)
      expect(result).toEqual({})
    })
  })

  describe('Viewport Detection', () => {
    it('should proceed with logic when viewport is mobile', () => {
      mockGetViewportByReq.mockReturnValue('mobile')
      mockIsExperimentEnabled.mockReturnValue(true)

      const images = ['image1.jpg', 'image2.jpg']
      const onModelPLPAttribute = {
        enable: true,
        template: '1up',
        images,
      }
      const result = getOnModelFlags(mockReq, onModelPLPAttribute)
      expect(mockIsExperimentEnabled).toHaveBeenCalled()
      expect(result.onModelPlpSequence).toEqual(images)
    })

    it('should return empty object when viewport is desktop', () => {
      mockGetViewportByReq.mockReturnValue('desktop')

      const onModelPLPAttribute = {
        enable: true,
        template: '1up',
        images: ['image1.jpg'],
      }
      const result = getOnModelFlags(mockReq, onModelPLPAttribute)
      expect(result).toEqual({})
    })
  })

  describe('Template Type Detection', () => {
    beforeEach(() => {
      mockIsExperimentEnabled.mockReturnValue(true)
    })

    it.each(['1up', '1UP', '1Up'])(
      'should recognize 1up template case-insensitively: %s',
      (template) => {
        const onModelPLPAttribute = {
          enable: true,
          template,
          images: ['image1.jpg'],
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.isOnModelPLPToggleEnabled).toBe(true)
        expect(result.isOnModel2UpToggleEnabled).toBe(false)
      }
    )

    it.each(['2up', '2UP', '2Up'])(
      'should recognize 2up template case-insensitively: %s',
      (template) => {
        const onModelPLPAttribute = {
          enable: true,
          template,
          images: ['image1.jpg'],
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.isOnModel2UpToggleEnabled).toBe(true)
      }
    )

    it.each(['3up', 'grid', 'invalid', '', undefined])(
      'should treat other template values as neither: %p',
      (template) => {
        mockIsExperimentEnabled.mockReturnValue(false)
        const onModelPLPAttribute = {
          enable: true,
          template,
          images: ['image1.jpg'],
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.onModelPlpSequence).toBeUndefined()
        expect(result.isOnModelTabActive).toBe(false)
        expect(result.isOnModelPLPToggleEnabled).toBe(false)
      }
    )
  })

  describe('Experiment Combinations', () => {
    describe('1up Template Experiments', () => {
      it('should activate 1up toggle version when ON_MODEL_PLP_TOGGLE experiment enabled', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
        })

        const images = ['image1.jpg']
        const onModelPLPAttribute = {
          enable: true,
          template: '1up',
          images,
          isOnModelTabActive: true,
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.isOnModelPLPToggleEnabled).toBe(true)
        expect(result.isOnModelTabActive).toBe(true)
        expect(result.onModelPlpSequence).toEqual(images)
      })

      it('should activate 1up always-on version when ON_MODEL_PLP experiment enabled', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP
        })

        const images = ['image1.jpg', 'image2.jpg']
        const onModelPLPAttribute = {
          enable: true,
          template: '1up',
          images,
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.isOnModelPLPToggleEnabled).toBe(false)
        expect(result.onModelPlpSequence).toEqual(images)
      })
    })

    describe('2up Template Experiments', () => {
      it('should activate 2up toggle version when ON_MODEL_PLP_2_UP_TOGGLE experiment enabled', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP_TOGGLE
        })

        const images = ['image1.jpg']
        const onModelPLPAttribute = {
          enable: true,
          template: '2up',
          images,
          isOnModelTabActive: true,
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.isOnModelPLPToggleEnabled).toBe(true)
        expect(result.isOnModel2UpToggleEnabled).toBe(true)
        expect(result.showOnModel2Up).toBe(true)
        expect(result.onModelPlpSequence).toEqual(images)
      })

      it('should activate 2up always-on version when ON_MODEL_PLP_2_UP experiment enabled', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP
        })

        const images = ['image1.jpg', 'image2.jpg']
        const onModelPLPAttribute = {
          enable: true,
          template: '2up',
          images,
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.isOnModelPLPToggleEnabled).toBe(false)
        expect(result.isOnModel2UpToggleEnabled).toBe(false)
        expect(result.showOnModel2Up).toBe(true)
        expect(result.onModelPlpSequence).toEqual(images)
      })
    })

    describe('Template Matching Rules', () => {
      it('should only work with matching template type', () => {
        mockIsExperimentEnabled.mockReturnValue(true)

        // 1up experiments with 2up template should not work
        const onModelPLP2up = {
          enable: true,
          template: '2up',
          images: ['image1.jpg'],
        }
        const result2up = getOnModelFlags(mockReq, onModelPLP2up)
        expect(result2up.isOnModel2UpToggleEnabled).toBe(true)
        expect(result2up.showOnModel2Up).toBe(true)

        // 2up experiments with 1up template should not work
        const onModelPLP1up = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
        }
        const result1up = getOnModelFlags(mockReq, onModelPLP1up)
        expect(result1up.isOnModel2UpToggleEnabled).toBe(false)
        expect(result1up.showOnModel2Up).toBe(false)
      })
    })
  })

  describe('Toggle vs Always-On Logic', () => {
    describe('Toggle Enabled Logic', () => {
      it('should require isOnModelTabActive true for toggle version', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
        })

        const onModelPLPAttributeInactive = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
          isOnModelTabActive: false,
        }
        const resultInactive = getOnModelFlags(mockReq, onModelPLPAttributeInactive)
        expect(resultInactive.isOnModelTabActive).toBe(false)

        const onModelPLPAttributeActive = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
          isOnModelTabActive: true,
        }
        const resultActive = getOnModelFlags(mockReq, onModelPLPAttributeActive)
        expect(resultActive.isOnModelTabActive).toBe(true)
      })

      it('should treat missing isOnModelTabActive as falsy', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
        })

        const onModelPLPAttribute = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.isOnModelTabActive).toBeUndefined()
      })
    })

    describe('Always-On Enabled Logic', () => {
      it('should not require tab activation and show images automatically', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return (
            experiment === EXPERIMENTS.ON_MODEL_PLP || experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP
          )
        })

        const images1up = ['image1.jpg']
        const onModelPLPAttribute1up = {
          enable: true,
          template: '1up',
          images: images1up,
        }
        const result1up = getOnModelFlags(mockReq, onModelPLPAttribute1up)
        expect(result1up.onModelPlpSequence).toEqual(images1up)
        expect(result1up.isOnModelTabActive).toBe(false)

        const images2up = ['image1.jpg', 'image2.jpg']
        const onModelPLPAttribute2up = {
          enable: true,
          template: '2up',
          images: images2up,
        }
        const result2up = getOnModelFlags(mockReq, onModelPLPAttribute2up)
        expect(result2up.showOnModel2Up).toBe(true)
        expect(result2up.onModelPlpSequence).toEqual(images2up)
      })
    })
  })

  describe('Return Object Properties', () => {
    describe('onModelPlpSequence', () => {
      it('should return images array when toggle or always-on enabled', () => {
        // Test toggle enabled
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
        })

        const images = ['image1.jpg', 'image2.jpg', 'image3.jpg']
        const onModelPLPAttribute = {
          enable: true,
          template: '1up',
          images,
        }
        const resultToggle = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(resultToggle.onModelPlpSequence).toEqual(images)

        // Test always-on enabled
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP
        })
        const resultAlwaysOn = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(resultAlwaysOn.onModelPlpSequence).toEqual(images)
      })

      it('should return undefined when neither enabled', () => {
        mockIsExperimentEnabled.mockReturnValue(false)

        const onModelPLPAttribute = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.onModelPlpSequence).toBeUndefined()
      })
    })

    describe('isOnModelTabActive', () => {
      it('should be true only when toggle enabled and isOnModelTabActive is true', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
        })

        const onModelPLPAttributeActive = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
          isOnModelTabActive: true,
        }
        const resultActive = getOnModelFlags(mockReq, onModelPLPAttributeActive)
        expect(resultActive.isOnModelTabActive).toBe(true)

        const onModelPLPAttributeInactive = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
          isOnModelTabActive: false,
        }
        const resultInactive = getOnModelFlags(mockReq, onModelPLPAttributeInactive)
        expect(resultInactive.isOnModelTabActive).toBe(false)
      })

      it('should be false when toggle not enabled', () => {
        mockIsExperimentEnabled.mockReturnValue(false)

        const onModelPLPAttribute = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
          isOnModelTabActive: true,
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.isOnModelTabActive).toBe(false)
      })
    })

    describe('isOnModelPLPToggleEnabled', () => {
      it('should be true when 1up toggle or 2up toggle enabled', () => {
        // Test 1up toggle
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
        })

        const onModelPLPAttribute1up = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
        }
        const result1up = getOnModelFlags(mockReq, onModelPLPAttribute1up)
        expect(result1up.isOnModelPLPToggleEnabled).toBe(true)

        // Test 2up toggle
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP_TOGGLE
        })

        const onModelPLPAttribute2up = {
          enable: true,
          template: '2up',
          images: ['image1.jpg'],
        }
        const result2up = getOnModelFlags(mockReq, onModelPLPAttribute2up)
        expect(result2up.isOnModelPLPToggleEnabled).toBe(true)
      })

      it('should be false when no toggle enabled', () => {
        mockIsExperimentEnabled.mockReturnValue(false)

        const onModelPLPAttribute = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.isOnModelPLPToggleEnabled).toBe(false)
      })
    })

    describe('isOnModel2UpToggleEnabled', () => {
      it('should be true only when 2up toggle enabled', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP_TOGGLE
        })

        const onModelPLPAttribute2up = {
          enable: true,
          template: '2up',
          images: ['image1.jpg'],
        }
        const result2up = getOnModelFlags(mockReq, onModelPLPAttribute2up)
        expect(result2up.isOnModel2UpToggleEnabled).toBe(true)

        // Should be false with 1up toggle
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
        })

        const onModelPLPAttribute1up = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
        }
        const result1up = getOnModelFlags(mockReq, onModelPLPAttribute1up)
        expect(result1up.isOnModel2UpToggleEnabled).toBe(false)
      })
    })

    describe('showOnModel2Up', () => {
      it('should be true when 2up always-on enabled or when 2up toggle enabled and tab active', () => {
        // Test 2up always-on
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP
        })

        const onModelPLPAttributeAlwaysOn = {
          enable: true,
          template: '2up',
          images: ['image1.jpg'],
        }
        const resultAlwaysOn = getOnModelFlags(mockReq, onModelPLPAttributeAlwaysOn)
        expect(resultAlwaysOn.showOnModel2Up).toBe(true)

        // Test 2up toggle with tab active
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP_TOGGLE
        })

        const onModelPLPAttributeToggleActive = {
          enable: true,
          template: '2up',
          images: ['image1.jpg'],
          isOnModelTabActive: true,
        }
        const resultToggleActive = getOnModelFlags(mockReq, onModelPLPAttributeToggleActive)
        expect(resultToggleActive.showOnModel2Up).toBe(true)
      })

      it('should be false when 2up toggle enabled but tab inactive', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP_TOGGLE
        })

        const onModelPLPAttribute = {
          enable: true,
          template: '2up',
          images: ['image1.jpg'],
          isOnModelTabActive: false,
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.showOnModel2Up).toBe(false)
      })

      it('should be false when 1up experiments enabled', () => {
        mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
          return (
            experiment === EXPERIMENTS.ON_MODEL_PLP ||
            experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
          )
        })

        const onModelPLPAttribute = {
          enable: true,
          template: '1up',
          images: ['image1.jpg'],
          isOnModelTabActive: true,
        }
        const result = getOnModelFlags(mockReq, onModelPLPAttribute)
        expect(result.showOnModel2Up).toBe(false)
      })
    })
  })

  describe('Images Array Handling', () => {
    beforeEach(() => {
      mockIsExperimentEnabled.mockImplementation(
        (_req, experiment) => experiment === EXPERIMENTS.ON_MODEL_PLP
      )
    })

    it('should pass through images array as-is without validation or transformation', () => {
      // Test normal images
      const images = ['image1.jpg', 'image2.jpg', 'image3.jpg']
      const onModelPLPAttribute = {
        enable: true,
        template: '1up',
        images,
      }
      const result = getOnModelFlags(mockReq, onModelPLPAttribute)
      expect(result.onModelPlpSequence).toBe(images)

      // Test invalid/empty images
      const invalidImages = ['', 'invalid-url', null, undefined]
      const onModelPLPAttributeInvalid = {
        enable: true,
        template: '1up',
        images: invalidImages,
      }
      const resultInvalid = getOnModelFlags(mockReq, onModelPLPAttributeInvalid)
      expect(resultInvalid.onModelPlpSequence).toBe(invalidImages)

      // Test empty array
      const emptyImages = []
      const onModelPLPAttributeEmpty = {
        enable: true,
        template: '1up',
        images: emptyImages,
      }
      const resultEmpty = getOnModelFlags(mockReq, onModelPLPAttributeEmpty)
      expect(resultEmpty.onModelPlpSequence).toEqual(emptyImages)
    })
  })

  describe('Priority Logic: Category vs Site-Wide Configuration', () => {
    beforeEach(() => {
      mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
        return experiment === EXPERIMENTS.ON_MODEL_PLP
      })
    })

    it('should use category-level config when available (category takes priority)', () => {
      const categoryConfig = {
        enable: true,
        template: '1up',
        images: ['category-a91.jpg', 'category-a61.jpg'],
        isOnModelTabActive: true,
      }
      const siteConfig = {
        enable: true,
        template: '2up',
        images: ['site-a91.jpg', 'site-a61.jpg'],
        isOnModelTabActive: false,
      }

      const result = getOnModelFlags(mockReq, categoryConfig, siteConfig)

      // Should use category config values
      expect(result.onModelPlpSequence).toEqual(['category-a91.jpg', 'category-a61.jpg'])
      expect(result.isOnModelTabActive).toBe(false) // false because ON_MODEL_PLP (not toggle) is enabled
    })

    it('should not fallback to site-wide config when category config is present but not enabled (returns empty)', () => {
      const categoryConfig = {
        enable: false,
        template: '1up',
        images: ['category-a91.jpg'],
      }
      const siteConfig = {
        enable: true,
        template: '2up',
        images: ['site-a91.jpg', 'site-a61.jpg'],
      }

      mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
        return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP
      })

      const result = getOnModelFlags(mockReq, categoryConfig, siteConfig)

      // Should prefer category config selection, then early-return empty due to enable false
      expect(result).toEqual({})
    })

    it('should fallback to site-wide config when category config is undefined', () => {
      const siteConfig = {
        enable: true,
        template: '1up',
        images: ['site-a91.jpg', 'site-a61.jpg'],
        isOnModelTabActive: false,
      }

      const result = getOnModelFlags(mockReq, undefined, siteConfig)

      // Should use site config values
      expect(result.onModelPlpSequence).toEqual(['site-a91.jpg', 'site-a61.jpg'])
    })

    it('should fallback to site-wide config when category config is null', () => {
      const siteConfig = {
        enable: true,
        template: '1up',
        images: ['site-a91.jpg', 'site-a61.jpg'],
      }

      const result = getOnModelFlags(mockReq, null, siteConfig)

      // Should use site config values
      expect(result.onModelPlpSequence).toEqual(['site-a91.jpg', 'site-a61.jpg'])
    })

    it('should not fallback when category config has enable false (returns empty)', () => {
      const categoryConfig = {
        enable: false,
        images: [],
      }
      const siteConfig = {
        enable: true,
        template: '1up',
        images: ['site-a91.jpg', 'site-a61.jpg'],
      }

      const result = getOnModelFlags(mockReq, categoryConfig, siteConfig)

      // Should return empty because category exists but disabled
      expect(result).toEqual({})
    })

    it('should return empty object when neither category nor site config is enabled', () => {
      const categoryConfig = {
        enable: false,
        template: '1up',
        images: ['category-a91.jpg'],
      }
      const siteConfig = {
        enable: false,
        template: '1up',
        images: ['site-a91.jpg'],
      }

      const result = getOnModelFlags(mockReq, categoryConfig, siteConfig)

      expect(result).toEqual({})
    })

    it('should return empty object when both configs are undefined', () => {
      const result = getOnModelFlags(mockReq, undefined, undefined)

      expect(result).toEqual({})
    })

    it('should return empty object when both configs are null', () => {
      const result = getOnModelFlags(mockReq, null, null)

      expect(result).toEqual({})
    })

    it('should prefer category config even with different templates (category always wins)', () => {
      mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
        return (
          experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE ||
          experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP_TOGGLE
        )
      })

      const categoryConfig = {
        enable: true,
        template: '1up',
        images: ['category-a91.jpg'],
        isOnModelTabActive: true,
      }
      const siteConfig = {
        enable: true,
        template: '2up',
        images: ['site-a91.jpg', 'site-a61.jpg'],
        isOnModelTabActive: false,
      }

      const result = getOnModelFlags(mockReq, categoryConfig, siteConfig)

      // Should use category's 1up template, not site's 2up template
      expect(result.onModelPlpSequence).toEqual(['category-a91.jpg'])
      expect(result.isOnModelPLPToggleEnabled).toBe(true)
      expect(result.isOnModel2UpToggleEnabled).toBe(false)
      expect(result.isOnModelTabActive).toBe(true)
    })

    it('should work with site-wide config using toggle experiments', () => {
      mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
        return experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
      })

      const siteConfig = {
        enable: true,
        template: '1up',
        images: ['site-a91.jpg', 'site-a61.jpg'],
        isOnModelTabActive: true,
      }

      const result = getOnModelFlags(mockReq, undefined, siteConfig)

      expect(result.onModelPlpSequence).toEqual(['site-a91.jpg', 'site-a61.jpg'])
      expect(result.isOnModelPLPToggleEnabled).toBe(true)
      expect(result.isOnModelTabActive).toBe(true)
    })

    it('should respect site-wide isOnModelTabActive when category config absent', () => {
      mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
        return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP_TOGGLE
      })

      const siteConfigTabActive = {
        enable: true,
        template: '2up',
        images: ['site-a91.jpg'],
        isOnModelTabActive: true,
      }

      const resultActive = getOnModelFlags(mockReq, null, siteConfigTabActive)
      expect(resultActive.isOnModelTabActive).toBe(true)
      expect(resultActive.showOnModel2Up).toBe(true)

      const siteConfigTabInactive = {
        enable: true,
        template: '2up',
        images: ['site-a91.jpg'],
        isOnModelTabActive: false,
      }

      const resultInactive = getOnModelFlags(mockReq, null, siteConfigTabInactive)
      expect(resultInactive.isOnModelTabActive).toBe(false)
      expect(resultInactive.showOnModel2Up).toBe(false)
    })

    it('should handle real-world JSON config structure from Business Manager', () => {
      // Example of actual config from BM: {"enable": true, "images": ["a91", "a61"], "isOnModelTabActive": false, "template": "1up"}
      const siteConfig = {
        enable: true,
        images: ['a91', 'a61'],
        isOnModelTabActive: false,
        template: '1up',
      }

      const result = getOnModelFlags(mockReq, undefined, siteConfig)

      expect(result.onModelPlpSequence).toEqual(['a91', 'a61'])
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple experiments enabled simultaneously', () => {
      // Both 1up and 2up experiments enabled, but only matching template should work
      mockIsExperimentEnabled.mockReturnValue(true)

      const onModelPLPAttribute = {
        enable: true,
        template: '1up',
        images: ['image1.jpg'],
        isOnModelTabActive: true,
      }
      const result = getOnModelFlags(mockReq, onModelPLPAttribute)
      expect(result.isOnModelPLPToggleEnabled).toBe(true)
      expect(result.isOnModel2UpToggleEnabled).toBe(false)
      expect(result.showOnModel2Up).toBe(false)
    })
  })

  describe('Complete Return Object Structure', () => {
    it('should return complete object for all scenarios', () => {
      // Test 1up toggle scenario
      mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
        return experiment === EXPERIMENTS.ON_MODEL_PLP_TOGGLE
      })

      const onModelPLPAttribute1up = {
        enable: true,
        template: '1up',
        images: ['image1.jpg', 'image2.jpg'],
        isOnModelTabActive: true,
      }
      const expected1up = {
        onModelPlpSequence: ['image1.jpg', 'image2.jpg'],
        isOnModelTabActive: true,
        isOnModelPLPToggleEnabled: true,
        isOnModel2UpToggleEnabled: false,
        showOnModel2Up: false,
      }
      const result1up = getOnModelFlags(mockReq, onModelPLPAttribute1up)
      expect(result1up).toEqual(expected1up)

      // Test 2up always-on scenario
      mockIsExperimentEnabled.mockImplementation((_req, experiment) => {
        return experiment === EXPERIMENTS.ON_MODEL_PLP_2_UP
      })

      const onModelPLPAttribute2up = {
        enable: true,
        template: '2up',
        images: ['image1.jpg', 'image2.jpg'],
      }
      const expected2up = {
        onModelPlpSequence: ['image1.jpg', 'image2.jpg'],
        isOnModelTabActive: false,
        isOnModelPLPToggleEnabled: false,
        isOnModel2UpToggleEnabled: false,
        showOnModel2Up: true,
      }
      const result2up = getOnModelFlags(mockReq, onModelPLPAttribute2up)
      expect(result2up).toEqual(expected2up)

      // Test no experiments enabled
      mockIsExperimentEnabled.mockReturnValue(false)

      const onModelPLPAttributeNone = {
        enable: true,
        template: '1up',
        images: ['image1.jpg'],
        isOnModelTabActive: true,
      }
      const expectedNone = {
        onModelPlpSequence: undefined,
        isOnModelTabActive: false,
        isOnModelPLPToggleEnabled: false,
        isOnModel2UpToggleEnabled: false,
        showOnModel2Up: false,
      }
      const resultNone = getOnModelFlags(mockReq, onModelPLPAttributeNone)
      expect(resultNone).toEqual(expectedNone)
    })
  })
})
