// ==================
// Under construction
// ==================
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
import {
  getStorefrontApiUrl,
  getPrivateTokenHeaders,
  productInfoQuery,
} from '@/lib/shopifyApi';

import { IConfig, IPdp } from '@/types/contentful';
import type { Product as IProduct } from '@shopify/hydrogen-react/storefront-api-types';
import { request } from 'graphql-request';

const Pdp = ({
  pdp,
  config,
  product,
}: {
  pdp: IPdp;
  config: IConfig;
  product: Partial<IProduct>;
}) => {
  if (!pdp || !product) {
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
        {product && <Product pdp={pdp} product={product} />}
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

  const productInfoQueryVariables = {
    id: pdp.fields.product,
  };

  const productInfo: { product: Partial<IProduct> } | null =
    getStorefrontApiUrl && getPrivateTokenHeaders
      ? await request(
          getStorefrontApiUrl(),
          productInfoQuery,
          productInfoQueryVariables,
          getPrivateTokenHeaders()
        )
      : null;

  console.log(productInfo?.product.options);

  return {
    props: {
      pdp,
      config,
      product: productInfo && productInfo.product,
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
  if (
    process.env.SHOPIFY_PRIVATE_STOREFRONT_TOKEN &&
    process.env.SHOPIFY_STORE_NAME
  ) {
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
      // Consider using 'blocking' or 'true' for a large catalogue of which only a subset is built ahead of time
      fallback: false,
    };
  } else {
    return {
      paths: [],
      fallback: false,
    };
  }
};

export default Pdp;
