# Personalizations and Experiments with Ninetailed, Contentful, and Next.js

![](docs/marketing-contentful-next.png)

The illustrated website example demonstrates the Ninetailed content personalization integration for Contentful using Next.js as the web framework.

- [Live Demo](#live-demo)
- [Deploy Your Own Playground Without Code](#deploy-your-own-playground-without-code)
  - [Step 1. Create a Ninetailed Account](#step-1-create-a-ninetailed-account)
  - [Step 2. Create a Contentful Account and Space](#step-2-create-a-contentful-account-and-space)
  - [Step 3. Create Contentful API Credentials](#step-3-create-contentful-api-credentials)
  - [Step 4. Create Ninetailed API Credentials](#step-4-create-ninetailed-api-credentials)
  - [Step 5. Connect Contentful With Ninetailed](#step-5-connect-contentful-with-ninetailed)
  - [Step 6. Deploy Your Personal Playground on Vercel](#step-6-deploy-your-personal-playground-on-vercel)
  - [Step 7. Final Remark](#step-7-final-remark)
- [Developer Section](#developer-section)
  - [Getting Started](#getting-started)
  - [Import and Export Data to Contentful](#import-and-export-data-to-contentful)

## Live Demo

This project is deployed live [at this link](https://b2b.demo.ninetailed.io/).

## Deploy Your Own Starter

### Step 1. Create a Ninetailed Account

- [Click here to sign up for a Ninetailed account](https://app.ninetailed.io/account/sign-up).

### Step 2. Create a Contentful Account and Space

- If you haven't already, [sign up for a Contentful account](https://www.contentful.com/sign-up/).
- Next, create a new empty **space** from the Contentful dashboard.

### Step 3. Create Contentful API Credentials

> ⚠️ **HINT:** Save the created API credentials temporarily in a note or a separate file, as you will need to provide them in the last step.

- Within your Contentful space, navigate to the navigation bar, go to **Settings** and click on **API keys** in the dropdown.
- Click on **Add API key**.
- Enter a name for your API key and save it.
- Copy the following credentials to your note for later use:
  - **Space ID** (NEXT_PUBLIC_CONTENTFUL_SPACE_ID)
  - **Content Delivery API - access token** (CONTENTFUL_TOKEN)
  - **Content Preview API - access token** (CONTENTFUL_PREVIEW_TOKEN)
- Go back to the main API configuration page and select the **Content management tokens** tab.
- Generate a **Personal Access Token** (CONTENTFUL_MANAGEMENT_TOKEN) and copy it immediately to your note. This will be used to import the demo content model.
- Finally, specify the Contentful environment or environment alias name as the **Contentful Environment Name** (NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT). Otherwise, provide your chosen environment name in the credentials and enable the API key to this environment in the settings.

### Step 4. Gather Ninetailed API Credentials

> ⚠️ **HINT:** Save the created API credentials temporarily in a note or a separate file, as you will need to provide them in the last step.

- Within your Ninetailed account, click on **API Key** in the sidebar.
- Save the shown **API Key** (NEXT_PUBLIC_NINETAILED_CLIENT_ID) to your notes.
- Similar to Contentful, Ninetailed offers two self-sufficient working environments. You can choose to work in the 'main' or 'development' environment. Please enter the name of the **Ninetailed Environment** of your choice in the credentials without quotes (NEXT_PUBLIC_NINETAILED_ENVIRONMENT). You can switch environments using the dropdown in t

### Step 5. Connect Contentful With Ninetailed

- Within your Contentful space, navigate to **Apps** in the navbar and click on **Marketplace** in the dropdown.
- On the next page, scroll down the provided list of available apps and click on the **Ninetailed Personalization and Experimentation** application.
- Install the Ninetailed application and authorize access to your space (make sure to install ).
- Afterward, click on connect, and you will be automatically redirected to your Ninetailed account.
- Next, make sure you are in the desired **Ninetailed Environment**. If so authenticate with Contentful, otherwise switch to the wanted environment.
- At last, select the Contentful space you want to connect to Ninetailed, provide a name for the connection and confirm with **create content source**.

### Step 6. Deploy Your Personal Playground on Vercel

- Click on **Deploy**, and you will automatically be redirected to Vercel.
- Within the Vercel deployment wizard, simply create a repository and type in your saved credentials.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fninetailed-inc%2Fninetailed-examples%2Ftree%2Fmain%2Fmarketing-contentful-next&env=NEXT_PUBLIC_NINETAILED_CLIENT_ID,NEXT_PUBLIC_NINETAILED_ENVIRONMENT,NEXT_PUBLIC_CONTENTFUL_SPACE_ID,NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,CONTENTFUL_TOKEN,CONTENTFUL_PREVIEW_TOKEN,CONTENTFUL_MANAGEMENT_TOKEN&project-name=ninetailed-marketing-contentful-next&repository-name=ninetailed-marketing-contentful-next&build-command=npm%20run%20build-and-setup)

Mnemonic for credential relatedness:

```bash
NEXT_PUBLIC_NINETAILED_CLIENT_ID = "API Key"
NEXT_PUBLIC_NINETAILED_ENVIRONMENT = "Ninetailed Environment Name ('main' or 'development')"
NEXT_PUBLIC_CONTENTFUL_SPACE_ID = "Space ID"
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT = "Contentful Environment Name (default = 'master')"
CONTENTFUL_TOKEN = "Content Delivery API - access token"
CONTENTFUL_PREVIEW_TOKEN = "Content Preview API - access token"
CONTENTFUL_MANAGEMENT_TOKEN= "Personal Access Token"
NEXT_PUBLIC_GTM_ID="(Optional) GTM Container ID"
```

### Step 7. Final Remark

If you intend to make changes to the source code and publish it in the future, you should first disable the build command override in the project settings on Vercel.\
Otherwise, the template content is populated with each build and eventually overwrites your changes in Contentful.

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

NEXT_PUBLIC_CONTENTFUL_SPACE_ID=XXXXXXXXXXXX
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=nameOfYourEnvironment

CONTENTFUL_TOKEN=XXXXXXXXXXXXX_XXXXXXXXXXXXXXXXXXXXXXXXXX_XX
CONTENTFUL_PREVIEW_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

CONTENTFUL_MANAGEMENT_TOKEN=XXXXX-XXXXX-XXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Run the development server:

```bash
yarn dev
```

### Import and Export Data to Contentful

```bash
yarn setup

yarn export
```
