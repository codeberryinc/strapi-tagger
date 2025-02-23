import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    // ✅ Register the Custom Field for Tagger
    app.customFields.register({
      name: 'tags',
      pluginId: 'tagger', // ✅ Ensure this matches the backend `server/src/register.ts`
      type: 'json', // ✅ Ensuring Strapi recognizes this as a valid data type
      intlLabel: {
        id: 'tagger.tags.label',
        defaultMessage: 'Tags',
      },
      intlDescription: {
        id: 'tagger.tags.description',
        defaultMessage: 'A custom tags input with auto-suggestion.',
      },
      components: {
        Input: async () =>
          import(/* webpackChunkName: "tagger-input-component" */ './components/Input'),
      },
    });

    // ✅ Register the Plugin in the Admin Panel
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    console.log('✅ Tagger custom field registered successfully in Strapi admin');
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
