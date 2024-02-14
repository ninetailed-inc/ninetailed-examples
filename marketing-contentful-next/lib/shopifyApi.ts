import { StorefrontClientProps } from '@shopify/hydrogen-react';
import { gql } from 'graphql-request';

// This is code copied from the @shopify/hydrogen-react package, which is currently imcompatible with server contexts in Next.js due to the way it is exported
// https://github.com/Shopify/hydrogen/issues/867
const storefrontApiConstants = {
  SFAPI_VERSION: '2023-10',
};

type OverrideTokenHeaderProps = Partial<
  Pick<StorefrontClientProps, 'contentType'>
>;

function createStorefrontClient(props: StorefrontClientProps) {
  const {
    storeDomain,
    privateStorefrontToken,
    publicStorefrontToken,
    storefrontApiVersion = '2023-10',
    contentType,
  } = props;
  if (!storeDomain) {
    throw new Error(
      H2_PREFIX_ERROR +
        `\`storeDomain\` is required when creating a new Storefront client.
Received "${storeDomain}".`
    );
  }
  if (storefrontApiVersion !== storefrontApiConstants.SFAPI_VERSION) {
    warnOnce(
      `The Storefront API version that you're using is different than the version this build of Hydrogen React is targeting.
You may run into unexpected errors if these versions don't match. Received verion: "${storefrontApiVersion}"; expected version "${storefrontApiConstants.SFAPI_VERSION}"`
    );
  }
  const isMockShop = (domain: string) => domain.includes('mock.shop');
  const getShopifyDomain = (
    props?: Partial<Pick<StorefrontClientProps, 'storeDomain'>>
  ) => {
    const domain = (props == null ? void 0 : props.storeDomain) ?? storeDomain;
    return domain.includes('://') ? domain : `https://${domain}`;
  };
  return {
    getShopifyDomain,
    getStorefrontApiUrl(
      props?: Partial<
        Pick<StorefrontClientProps, 'storeDomain' | 'storefrontApiVersion'>
      >
    ) {
      const domain = getShopifyDomain(props);
      const apiUrl = domain + (domain.endsWith('/') ? 'api' : '/api');
      if (isMockShop(domain)) return apiUrl;
      return `${apiUrl}/${
        (props == null ? void 0 : props.storefrontApiVersion) ??
        storefrontApiVersion
      }/graphql.json`;
    },
    getPrivateTokenHeaders(
      props?: OverrideTokenHeaderProps &
        Pick<StorefrontClientProps, 'privateStorefrontToken'> & {
          /**
           * The client's IP address. Passing this to the Storefront API when using a server-to-server token will help improve your store's analytics data.
           */
          buyerIp?: string;
        }
    ) {
      if (
        !privateStorefrontToken &&
        !(props == null ? void 0 : props.privateStorefrontToken) &&
        !isMockShop(storeDomain)
      ) {
        throw new Error(
          H2_PREFIX_ERROR +
            'You did not pass in a `privateStorefrontToken` while using `createStorefrontClient()` or `getPrivateTokenHeaders()`'
        );
      }
      const finalContentType =
        (props == null ? void 0 : props.contentType) ?? contentType;
      return {
        // default to json
        'content-type':
          finalContentType === 'graphql'
            ? 'application/graphql'
            : 'application/json',
        'X-SDK-Variant': 'hydrogen-react',
        'X-SDK-Variant-Source': 'react',
        'X-SDK-Version': storefrontApiVersion,
        'Shopify-Storefront-Private-Token':
          (props == null ? void 0 : props.privateStorefrontToken) ??
          privateStorefrontToken ??
          '',
        ...((props == null ? void 0 : props.buyerIp)
          ? { 'Shopify-Storefront-Buyer-IP': props?.buyerIp }
          : {}),
      };
    },
    getPublicTokenHeaders(
      props?: OverrideTokenHeaderProps &
        Pick<StorefrontClientProps, 'publicStorefrontToken'>
    ) {
      if (
        !publicStorefrontToken &&
        !(props == null ? void 0 : props.publicStorefrontToken) &&
        !isMockShop(storeDomain)
      ) {
        throw new Error(
          H2_PREFIX_ERROR +
            'You did not pass in a `publicStorefrontToken` while using `createStorefrontClient()` or `getPublicTokenHeaders()`'
        );
      }
      const finalContentType =
        (props == null ? void 0 : props.contentType) ?? contentType ?? 'json';
      return getPublicTokenHeadersRaw(
        finalContentType,
        storefrontApiVersion,
        (props == null ? void 0 : props.publicStorefrontToken) ??
          publicStorefrontToken ??
          ''
      );
    },
  };
}
function getPublicTokenHeadersRaw(
  contentType: 'graphql' | 'json' | undefined,
  storefrontApiVersion: string,
  accessToken: string
) {
  return {
    // default to json
    'content-type':
      contentType === 'graphql' ? 'application/graphql' : 'application/json',
    'X-SDK-Variant': 'hydrogen-react',
    'X-SDK-Variant-Source': 'react',
    'X-SDK-Version': storefrontApiVersion,
    'X-Shopify-Storefront-Access-Token': accessToken,
  };
}
const warnings = new Set();
const H2_PREFIX_ERROR = '[h2:error:createStorefrontClient] ';
const H2_PREFIX_WARN = '[h2:warn:createStorefrontClient] ';
const warnOnce = (string: string) => {
  if (!warnings.has(string)) {
    console.warn(H2_PREFIX_WARN + string);
    warnings.add(string);
  }
};

// Here's the good stuff: a client that gives us the GraphQL API endpoint to hit along with a method to construct private token headers
const serverSideShopifyClient =
  process.env.SHOPIFY_PRIVATE_STOREFRONT_TOKEN && process.env.SHOPIFY_STORE_NAME
    ? createStorefrontClient({
        privateStorefrontToken: process.env.SHOPIFY_PRIVATE_STOREFRONT_TOKEN,
        storeDomain: `https://${
          process.env.SHOPIFY_STORE_NAME || ''
        }.myshopify.com`,
      })
    : null;

export const getStorefrontApiUrl =
  // eslint-disable-next-line
  serverSideShopifyClient?.getStorefrontApiUrl || null;

// eslint-disable-next-line
export const getPrivateTokenHeaders =
  // eslint-disable-next-line
  serverSideShopifyClient?.getPrivateTokenHeaders || null;

export const productInfoQuery = gql`
  query getProductById($id: ID!) {
    product(id: $id) {
      title
      options(first: 3) {
        id
        name
        values
      }
      images(first: 3) {
        edges {
          node {
            id
            url
            altText
            height
            width
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      requiresSellingPlan
      variants(first: 10) {
        edges {
          node {
            id
            title
            selectedOptions {
              name
              value
            }
            price {
              amount
            }
            availableForSale
          }
        }
      }
    }
  }
`;
