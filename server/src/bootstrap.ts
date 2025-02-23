import type { Core } from '@strapi/strapi';
import slugify from 'slugify';

interface LifecycleEvent {
  action: string;
  model?: { uid: string };
  params: { data?: Record<string, any> };
}

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.log.info('✅ Tagger Plugin Bootstrapped');

  // ✅ Load tag model configuration from `config/plugins.ts`
  const tagConfig = strapi.plugin('tagger')?.config('tagConfig') as {
    model: keyof typeof strapi.contentTypes; // ✅ Ensures model is recognized as a Strapi Content Type
    titleField: string;
    slugField: string;
  };

  if (!tagConfig) {
    strapi.log.error('❌ Tagger Config is missing! Check `config/plugins.ts`.');
    return;
  }

  const { model, titleField, slugField } = tagConfig;

  strapi.log.info(`📌 Loaded Tag Config:`, tagConfig);

  // ✅ Ensure the user-defined model exists
  if (!strapi.contentTypes[model]) {
    strapi.log.warn(`⚠️ The model ${model} does not exist in Strapi. Skipping tag processing.`);
    return;
  }

  // ✅ Register lifecycle hooks for creating/updating tags
  strapi.db.lifecycles.subscribe(async (event: LifecycleEvent) => {
    if (['afterCreate', 'afterUpdate', 'afterPublish'].includes(event.action)) {
      const modelName = event.model?.uid.split('.').pop();
      if (!modelName) {
        strapi.log.warn('⚠️ No model found in event. Skipping.');
        return;
      }

      strapi.log.info(`🔄 Lifecycle Event: ${event.action} on ${modelName}`);
      strapi.log.debug('Event params:', event.params);

      const { data } = event.params;
      if (!data || !data.tags || !Array.isArray(data.tags)) {
        strapi.log.info(`ℹ️ No tags to process for ${modelName}. Skipping.`);
        return;
      }

      // ✅ Process tags and create missing ones in user-defined model
      await Promise.all(
        data.tags.map(async (tagTitle: string) => {
          const title = tagTitle.toLowerCase();
          const slug = slugify(title, { lower: true, strict: true });

          try {
            // ✅ Query the correct model using a properly typed model reference
            const existingTag = await strapi.entityService.findMany(model, {
              filters: { [slugField]: slug },
            });

            if (existingTag.length === 0) {
              // ✅ Create the tag in the correct model
              await strapi.entityService.create(model, {
                data: { [titleField]: title, [slugField]: slug },
              });
              strapi.log.info(`✅ Created new tag: ${title} (${slug}) in ${model}`);
            } else {
              strapi.log.info(`ℹ️ Tag already exists: ${title} (${slug}) in ${model}`);
            }
          } catch (error) {
            strapi.log.error(`❌ Error creating tag: ${title} in ${model} -`, error);
          }
        })
      );
    }
  });

  strapi.log.info('✅ Tagger Lifecycle Hooks Registered Successfully');
};

export default bootstrap;
