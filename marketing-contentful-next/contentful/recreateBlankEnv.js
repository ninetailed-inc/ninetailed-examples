// This script deletes an environment and re-creates a blank version under the same name.
// Do not run this script unless you are absolutely certain you want to. It WILL permanently delete data.
// You have been warned!

const contentful = require('contentful-management');
const dotEnv = require('dotenv');
dotEnv.config({ path: `${process.env.PATH_TO_ENV_FILE}` });

function timer(ms) {
  new Promise((res) => setTimeout(res, ms));
}

async function recreateBlankEnv() {
  console.log('Starting environment recreation...');
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

  const ninetailedInstallation = await client.appInstallation.get({
    spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
    appDefinitionId: process.env.NINETAILED_DEFINITION_ID,
  });

  await client.environment.delete({
    spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
    environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
  });

  const newEnv = await client.environment.createWithId(
    {
      spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
      sourceEnvironmentId: 'blank',
    },
    { name: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT }
  );

  console.log(`New Environment Created:`);
  console.log(JSON.stringify(newEnv, null, 2));

  let status = newEnv.sys.status.sys.id;

  while (status !== 'ready') {
    let polledEnv = await client.environment.get({
      spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
    });
    status = polledEnv.sys.status.sys.id;
    console.log(`Waiting for environment to be ready...`);
    if (status === 'ready') {
      console.log(`Environment ready`);
    } else {
      await timer(2000);
    }
  }

  console.log(`Installing Ninetailed...`);

  await client.appInstallation.upsert(
    {
      spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      environmentId: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
      appDefinitionId: process.env.NINETAILED_DEFINITION_ID,
    },
    {
      parameters: ninetailedInstallation.parameters,
    },
    {
      'X-Contentful-Marketplace':
        'i-accept-end-user-license-agreement,i-accept-marketplace-terms-of-service,i-accept-privacy-policy',
    }
  );

  console.log('Ninetailed installation complete');
  console.log('Environment recreation complete');
}

recreateBlankEnv();
