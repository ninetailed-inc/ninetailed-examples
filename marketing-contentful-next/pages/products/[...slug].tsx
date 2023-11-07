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
import { request, gql } from 'graphql-request';

const product = {
  name: 'Basic Tee',
  price: '$35',
  rating: 3.9,
  reviewCount: 512,
  href: '#',
  breadcrumbs: [
    { id: 1, name: 'Women', href: '#' },
    { id: 2, name: 'Clothing', href: '#' },
  ],
  images: [
    {
      id: 1,
      imageSrc:
        'https://tailwindui.com/img/ecommerce-images/product-page-01-featured-product-shot.jpg',
      imageAlt: "Back of women's Basic Tee in black.",
      primary: true,
    },
    {
      id: 2,
      imageSrc:
        'https://tailwindui.com/img/ecommerce-images/product-page-01-product-shot-01.jpg',
      imageAlt: "Side profile of women's Basic Tee in black.",
      primary: false,
    },
    {
      id: 3,
      imageSrc:
        'https://tailwindui.com/img/ecommerce-images/product-page-01-product-shot-02.jpg',
      imageAlt: "Front of women's Basic Tee in black.",
      primary: false,
    },
  ],
  colors: [
    { name: 'Black', bgColor: 'bg-gray-900', selectedColor: 'ring-gray-900' },
    {
      name: 'Heather Grey',
      bgColor: 'bg-gray-400',
      selectedColor: 'ring-gray-400',
    },
  ],
  sizes: [
    { name: 'XXS', inStock: true },
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: false },
  ],
  description: `
    <p>The Basic tee is an honest new take on a classic. The tee uses super soft, pre-shrunk cotton for true comfort and a dependable fit. They are hand cut and sewn locally, with a special dye technique that gives each tee it's own look.</p>
    <p>Looking to stock your closet? The Basic tee also comes in a 3-pack or 5-pack at a bundle discount.</p>
  `,
  details: [
    'Only the best materials',
    'Ethically and locally made',
    'Pre-washed and pre-shrunk',
    'Machine wash cold with similar colors',
  ],
};

const Pdp = ({
  pdp,
  config,
  pimData,
}: {
  pdp: IPdp;
  config: IConfig;
  pimData: any;
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
        {product && (
          <Product product={product} pdp={pdp} fetchedProduct={pimData} />
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
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          edges {
            node {
              title
              price {
                amount
              }
            }
          }
        }
      }
    }
  `;

  const productInfoQueryVariables = {
    id: pdp.fields.product,
  };

  // TODO: Response typing
  const { product: pimData } = await request(
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
