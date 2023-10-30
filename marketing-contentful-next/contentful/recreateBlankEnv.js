// This script deletes an environment and re-creates a blank version under the same name.
// Do not run this script unless you are absolutely certain you want to. It WILL permanently delete data.
// You have been warned!

const contentful = require('contentful-management');
const dotEnv = require('dotenv');
dotEnv.config({ path: `${process.env.PATH_TO_ENV_FILE}` });

async function recreateBlankEnv() {
  if (
    !process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ||
    !process.env.CONTENTFUL_MANAGEMENT_TOKEN
  ) {
    throw new Error(
      [
        'Parameters missing...',
        'Please insert the following credentials into your .env.local file:',
        '- NEXT_PUBLIC_CONTENTFUL_SPACE_ID=XXX',
        '- CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-XXX',
        'Afterwards run the setup command as follows:',
        '"npm run recreate-env" or "yarn recreate-env"',
      ].join('\n')
    );
  }

  const client = contentful.createClient(
    {
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN || '',
    },
    {
      type: 'plain',
    }
  );

  await client.environment.delete({
    spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
  });

  // Can't immediately recreate under the same name, causes race condition
  let newEnv = await client.environment.createWithId(
    {
      spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
      sourceEnvironmentId: 'blank',
    },
    { name: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT }
  );

  console.log(`New Environment Created:`);
  console.log(JSON.stringify(newEnv, null, 2));

  const pollStatus = setInterval(async () => {
    let status = newEnv.sys.status.sys.id;
    newEnv = await client.environment.get({
      spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
    });
    console.log(`Polling: ${status}`);
    if (status === 'ready') {
      console.log(`Env ready`);
      clearInterval(pollStatus);
    }
  }, 2000);
}

recreateBlankEnv();
