# A Website Template for Personalization with Ninetailed, Contentstack, and Next.js

![](docs/marketing-contentstack-next.png)

The illustrated website example demonstrates the Ninetailed content personalization integration for Contentstack using Next.js as the web framework.

- [Live Demo](#live-demo)
- [Deploy Your Own Playground Without Code](#deploy-your-own-playground-without-code)
  - [Step 1. Create a Ninetailed Account](#step-1-create-a-ninetailed-account)
  - [Step 2. Create a Contentstack Account and Space](#step-2-create-a-contentstack-account-and-space)
  - [Step 3. Create Contentstack API Credentials](#step-3-create-contentstack-api-credentials)
  - [Step 4. Create Ninetailed API Credentials](#step-4-create-ninetailed-api-credentials)
  - [Step 5. Deploy Your Personal Playground on Vercel](#step-5-deploy-your-personal-playground-on-vercel)
  - [Step 6. Connect Contentstack With Ninetailed](#step-6-connect-contentstack-with-ninetailed)
  - [Step 7. Final Remark](#step-7-final-remark)
- [Developer Section](#developer-section)
  - [Getting Started](#getting-started)

## Live Demo

The contents of this repository are are deployed on this publicly accessible [live demo](https://b2b-demo-examples-marketing-contentstack-next.vercel.app/).

## Deploy Your Own Playground Without Code

If you are interested in exploring content personalization capabilities with Ninetailed and Contentstack in more depth, you can deploy your own environment.\
Simply follow the instructions, which will guide you through the necessary steps.

### Step 1. Create a Ninetailed Account

- [Click here to sign-up on Ninetailed](https://app.ninetailed.io/account/sign-up).

### Step 2. Create a Contentstack Account and Space

- First, [sign-up on Contentstack](https://www.contentstack.com/docs/get-started/set-up-your-account/).
- Next, create a new empty **stack** from the Contentstack dashboard. You can choose any name of your liking for the space.

### Step 3. Create Contentstack API Credentials

> ⚠️ **HINT:** Save the created API credentials temporarily in a note or a separate file, as you will need to provide them in the last step.

- Within your Contentstack space, [create a Delivery Token](https://www.contentstack.com/docs/developers/create-tokens/create-a-delivery-token/). This will be used to serve content.
- Optionally, [create a Management Token](https://www.contentstack.com/docs/developers/create-tokens/generate-a-management-token/). This will be used for [Live Preview](https://www.contentstack.com/docs/content-managers/author-content/about-live-preview/) functionality.
- Copy the following credentials to your note for later use:
  - **Stack API Key** (NEXT_PUBLIC_CONTENTSTACK_API_KEY)
  - **Delivery Token** (NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN)
  - **Management Token** (NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN)

### Step 4. Create Ninetailed API Credentials

> ⚠️ **HINT:** Save the created API credentials temporarily in a note or a separate file, as you will need to provide them in the last step.

- Within your Ninetailed account, click on **API Key** in the sidebar.
- Save the shown **API Key** (NEXT_PUBLIC_NINETAILED_CLIENT_ID) to your notes.
- Next, in the sidebar, go to **Settings**. In the appearing modal, navigate to **API Tokens**.

Optionally, generate a Ninetailed Management token to use with the [Ninetailed Preview Widget](https://docs.ninetailed.io/frameworks/preview-plugin).

- Click on **Generate Token**, enter a descriptive phrase, and select **Read Only** as a role.
- After creation, save the **Client ID** (NINETAILED_MANAGEMENT_CLIENT_ID) and the **Secret Key** (NINETAILED_MANAGEMENT_SECRET).
- Similar to Contentstack, Ninetailed offers two self-sufficient working environments. You can choose to work in the 'main' or 'development' environment. Please enter the name of the **Ninetailed Environment** of your choice in the credentials without quotes (NEXT_PUBLIC_NINETAILED_ENVIRONMENT).

### Step 5. Deploy Your Personal Playground on Vercel

- Click on **Deploy**, and you will automatically be redirected to Vercel.
- Within the Vercel deployment wizard, simply create a repository and type in your saved credentials.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fninetailed-inc%2Fninetailed-examples%2Ftree%2Fmain%2Fmarketing-contentstack-next&env=NEXT_PUBLIC_NINETAILED_CLIENT_ID,NEXT_PUBLIC_NINETAILED_ENVIRONMENT,NEXT_PUBLIC_NINETAILED_MANAGEMENT_CLIENT_ID,NEXT_PUBLIC_NINETAILED_MANAGEMENT_SECRET,NEXT_PUBLIC_CONTENTSTACK_API_KEY,NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,NEXT_PUBLIC_CONTENTSTACK_ENABLE_LIVE_PREVIEW,NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN&project-name=ninetailed-marketing-contentstack-next&repository-name=ninetailed-marketing-contentstack-next&build-command=npm%20run%20build)

### Step 6. Connect Contentstack With Ninetailed

- Follow our [guide in our public documentation](https://docs.ninetailed.io/cms/cms-installation) to extend your Contentstack content model with Ninetailed

### Step 7. Final Remark

If you intend to make changes to the source code and publish it in the future, you should first disable the build command override in the project settings on Vercel.\
Otherwise, the template content is populated with each build and eventually overwrites your changes in Contentstack.

## Developer Section

### Getting Started

Install all packages first:

```bash
yarn install
```

Provide the required environment variables to your .env file:

```bash
NEXT_PUBLIC_NINETAILED_CLIENT_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
NEXT_PUBLIC_NINETAILED_ENVIRONMENT=main || development
NEXT_PUBLIC_NINETAILED_MANAGEMENT_CLIENT_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
NEXT_PUBLIC_NINETAILED_MANAGEMENT_SECRET=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

NEXT_PUBLIC_CONTENTSTACK_API_KEY=
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=

NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN=
NEXT_PUBLIC_CONTENTSTACK_ENABLE_LIVE_PREVIEW=
```

Run the development server:

```bash
yarn dev
```

### Codegen

Use the Contentstack [CLI ts-gen plugin to generate types](https://www.contentstack.com/docs/developers/cli/tsgen-plugin), using the command `csdx tsgen -a "YOUR_CLI_TOKEN_ALIAS" -o "types/contentstack.d.ts"`
