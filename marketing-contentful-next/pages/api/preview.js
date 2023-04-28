import { getPage } from '../../lib/api';
import { PAGE_CONTENT_TYPES } from '@/lib/constants';

export default async function preview(req, res) {
  const { secret, slug } = req.query;

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const page = await getPage({
    preview: true,
    slug,
    pageContentType: PAGE_CONTENT_TYPES.PAGE,
    childPageContentType: PAGE_CONTENT_TYPES.LANDING_PAGE,
  });

  console.log(page);

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!page) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  // res.writeHead(307, { Location: `/posts/${post.slug}` })
  const url = `/${page.slug === '/' ? '' : slug}`;
  res.setHeader('Content-Type', 'text/html');
  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${url}" />
    <script>window.location.href = '${url}'</script>
    </head>
    </html>`
  );
  res.end();
}
