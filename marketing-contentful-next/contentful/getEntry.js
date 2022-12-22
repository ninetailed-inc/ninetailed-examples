const contentful = require('contentful');

require('dotenv').config({
  path: `${process.env.PATH_TO_ENV_FILE}`,
});

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
  accessToken: process.env.CONTENTFUL_TOKEN,
});

client
  .getEntry(process.env.CONTENTFUL_EXPORT_ENTRY_ID)
  .then((entry) => {
    return console.log(JSON.stringify(entry, null, 2));
  })
  .catch(console.error);
