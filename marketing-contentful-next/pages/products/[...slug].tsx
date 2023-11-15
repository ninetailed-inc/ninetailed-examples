import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import { Product } from '@/components/Product';
import {
  getProductPages,
  getProductPage,
  getAllExperiences,
  getGlobalConfig,
  getAllAudiences,
} from '@/lib/api';
import { getStorefrontApiUrl, getPrivateTokenHeaders } from '@/lib/shopifyApi';

import { IConfig, IPdp } from '@/types/contentful';
import type { Product as IProduct } from '@shopify/hydrogen-react/storefront-api-types';
import { request, gql } from 'graphql-request';

const constProduct = {
  rating: 3.9,
  reviewCount: 512,
  colors: [
    { name: 'Black', bgColor: 'bg-gray-900', selectedColor: 'ring-gray-900' },
    {
      name: 'Heather Grey',
      bgColor: 'bg-gray-400',
      selectedColor: 'ring-gray-400',
    },
  ],
};

const Pdp = ({
  pdp,
  config,
  pimData,
}: {
  pdp: IPdp;
  config: IConfig;
  pimData: Partial<IProduct>; // TODO: Could be improved by codegen on query or constructing specific type
}) => {
  if (!pdp) {
    return null;
  }

  const { seo, sections = [] } = pdp.fields;
  const { banner, navigation, footer } = config.fields;

  return (
    <>
      <NextSeo
        title={seo?.fields.title}
        description={seo?.fields.description}
        nofollow={seo?.fields.no_follow as boolean}
        noindex={seo?.fields.no_index as boolean}
      />
      {banner && <BlockRenderer block={banner} />}
      {navigation && <BlockRenderer block={navigation} />}

      <main className="grow">
        {pimData && (
          <Product constProduct={constProduct} pdp={pdp} pimData={pimData} />
        )}
        {sections && <BlockRenderer block={sections} />}
      </main>
      {footer && <BlockRenderer block={footer} />}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, draftMode }) => {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  const [pdp, config, allExperiences, allAudiences] = await Promise.all([
    getProductPage({
      preview: draftMode,
      slug,
    }),
    getGlobalConfig({ preview: draftMode }),
    getAllExperiences(),
    getAllAudiences(),
  ]);

  const productInfoQuery = gql`
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

  const productInfoQueryVariables = {
    id: pdp.fields.product,
  };

  const { product: pimData }: { product: Partial<IProduct> } = await request(
    getStorefrontApiUrl(),
    productInfoQuery,
    productInfoQueryVariables,
    getPrivateTokenHeaders()
  );

  return {
    props: {
      pdp,
      config,
      pimData,
      ninetailed: {
        preview: {
          allExperiences,
          allAudiences,
        },
      },
    },
    revalidate: 5,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pdps = await getProductPages({ preview: false });

  const paths = pdps
    .filter((pdp) => {
      return pdp.fields.slug !== '/';
    })
    .map((pdp) => {
      return {
        params: { slug: pdp.fields.slug.split('/') },
      };
    });
  return {
    paths: paths,
    fallback: false,
  };
};

export default Pdp;
