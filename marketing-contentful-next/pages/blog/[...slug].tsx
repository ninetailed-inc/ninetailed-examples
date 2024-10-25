import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import get from 'lodash/get';

import { BlockRenderer } from '@/components/Renderer';
import {
  getAllExperiences,
  getGlobalConfig,
  getAllAudiences,
  getArticle,
  getArticles,
} from '@/lib/api';
import { RichText } from '@/components/RichText';
import { BLOCKS, Block, Inline } from '@contentful/rich-text-types';
import { TypeArticleWithoutUnresolvableLinksResponse } from '@/types/TypeArticle';
import { TypeConfigWithoutUnresolvableLinksResponse } from '@/types/TypeConfig';

const Article = ({
  article,
  config,
}: {
  article: TypeArticleWithoutUnresolvableLinksResponse;
  config: TypeConfigWithoutUnresolvableLinksResponse;
}) => {
  if (!article) {
    return null;
  }

  const { seo, body, title } = article.fields;
  const { banner, navigation, footer } = config.fields;

  const articleRenderOptions = {
    [BLOCKS.EMBEDDED_ENTRY]: (node: Block | Inline) => {
      // eslint-disable-next-line
      if (
        // TODO: Write type guard
        // eslint-disable-next-line
        node.data.target.sys.contentType.sys.id === 'cta' ||
        // eslint-disable-next-line
        node.data.target.sys.contentType.sys.id === 'feature'
      ) {
        // eslint-disable-next-line
        return <BlockRenderer block={node.data.target} />;
      }
    },
  };

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
        <div className="mx-auto py-12 sm:py-24 px-6">
          {title && (
            <h1 className="max-w-3xl mx-auto mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {title}
            </h1>
          )}
          {body && (
            <RichText
              richTextDocument={body}
              className="mt-5 max-w-3xl mx-auto"
              classNames={{
                h2: 'mt-2 text-2xl font-extrabold text-gray-900 tracking-tight',
              }}
              renderNode={articleRenderOptions}
            />
          )}
        </div>
      </main>
      {footer && <BlockRenderer block={footer} />}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params, draftMode }) => {
  const rawSlug = get(params, 'slug', []) as string[];
  const slug = rawSlug.join('/');
  const [article, config, allExperiences, allAudiences] = await Promise.all([
    getArticle({
      preview: draftMode,
      slug,
    }),
    getGlobalConfig({ preview: draftMode }),
    getAllExperiences({ preview: draftMode }),
    getAllAudiences({ preview: draftMode }),
  ]);

  return {
    props: {
      article,
      config,
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
  const articles = await getArticles({ preview: false });

  const paths = articles
    .filter((article) => {
      return article.fields.slug !== '/';
    })
    .map((article) => {
      return {
        params: { slug: article.fields.slug.split('/') },
      };
    });
  return {
    paths: paths,
    fallback: false,
  };
};

export default Article;
