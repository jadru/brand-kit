// Types
export type {
  PromptCategory,
  ComposedPrompt,
  OgLayoutStyle,
  OgVisualElement,
  OgTypographyStyle,
  OgMoodTone,
  OgPromptConfig,
  IconVisualStyle,
  IconShape,
  IconIndustry,
  IconEmotion,
  IconColorScheme,
  IconPromptConfig,
  MetadataTone,
  MetadataAudience,
  MetadataContentType,
  MetadataUrgency,
  MetadataPromptConfig,
  FullPromptConfig,
  ProjectContext,
  PromptExample,
} from './types'

// Categories - OG Image
export {
  ogLayoutCategories,
  ogVisualCategories,
  ogTypographyCategories,
  ogMoodCategories,
  allOgCategories,
} from './categories/og-image'

// Categories - Icon
export {
  iconVisualStyleCategories,
  iconShapeCategories,
  iconIndustryCategories,
  iconEmotionCategories,
  iconColorSchemeCategories,
  allIconCategories,
} from './categories/icon'

// Categories - Metadata
export {
  metadataToneCategories,
  metadataAudienceCategories,
  metadataContentTypeCategories,
  metadataUrgencyCategories,
  allMetadataCategories,
} from './categories/metadata'

// Composer
export {
  composeOgPrompt,
  composeIconPrompt,
  composeMetadataPrompt,
  composeFullPrompt,
  getDefaultPromptConfig,
  mergePromptConfig,
} from './composer'

// Conflict Resolver
export {
  resolveConflicts,
  validateCategorySelection,
  areCategoriesCompatible,
  getIncompatibleIds,
} from './conflict-resolver'

// Reference Examples
export {
  ogExamples,
  iconExamples,
  metadataExamples,
  getExamplesByCategory,
  getExampleById,
  getAllExamples,
} from './reference/examples'
