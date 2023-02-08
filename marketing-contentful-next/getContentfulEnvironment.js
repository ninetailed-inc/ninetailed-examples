// For use with contentful-typescript-codegen
require('dotenv').config({ path: '.env.local' });
const contentfulManagement = require('contentful-management');

module.exports = async function () {
  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  });

  const space = await contentfulClient.getSpace(
    process.env.CONTENTFUL_SPACE_ID
  );

  return space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT);
};
