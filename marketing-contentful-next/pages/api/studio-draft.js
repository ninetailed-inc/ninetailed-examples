import { getFlexibleSection } from '../../lib/api';

export default async function handler(req, res) {
  const { secret, slug } = req.query;

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const page = await getFlexibleSection({
    preview: true,
    slug,
  });

  // If the slug doesn't exist prevent draft mode from being enabled
  if (!page) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Draft Mode by setting the cookies
  res.setDraftMode({ enable: true });

  const url = `/studio-editor/${slug}`;

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(url);
}
