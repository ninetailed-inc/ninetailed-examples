import { getPage } from '@/lib/api';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (!slug) {
    return new Response('No slug supplied', { status: 401 });
  }

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const page = await getPage({
    preview: true,
    slug,
  });

  // If the slug doesn't exist prevent draft mode from being enabled
  if (!page) {
    return new Response('Invalid slug', { status: 401 });
  }

  // Enable Draft Mode by setting the cookies
  draftMode().enable();

  const url = page.fields.slug === '/' ? '/' : `/${slug}`;

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  redirect(url);
}
