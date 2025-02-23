import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'tags',
    plugin: 'tagger',
    type: 'json', // Must match a valid field type
  });

  strapi.log.info('✅ Tagger Plugin Registered Successfully');
};

export default register;
