import { NextRequest, NextResponse } from 'next/server';
import { ipAddress } from '@vercel/edge';
import {
  ExperienceConfiguration,
  NINETAILED_ANONYMOUS_ID_COOKIE,
  Variant,
} from '@ninetailed/experience.js-shared';
import {
  createRequestContext,
  encodeExperienceSelections,
  sendPageEvent,
} from './lib/middlewareFunctions';
import { getContinentCode } from './lib/geolocation';
import { EDGE_URL_DELIMITER } from './lib/constants';
import { getRedirect } from './lib/api';
import resolveContentfulResponse from 'contentful-resolve-response';
import { parseExperiences } from './lib/experiences';
import { Entry } from 'contentful-management';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

export default async function middleware(req: NextRequest) {
  const response = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.CONTENTFUL_TOKEN}&limit=1&include=2&fields.from=${req.nextUrl.pathname}&metadata.tags.sys.id[in]=baseline&content_type=redirect`
  );
  const rawRedirectBaseline = await response.json();
  const redirectBaseline = resolveContentfulResponse(rawRedirectBaseline)[0];
  const parsedRedirectExperiences = redirectBaseline
    ? (parseExperiences(redirectBaseline) as ExperienceConfiguration<
        Variant<Entry>
      >[])
    : [];

  const { profile, experiences } = await sendPageEvent({
    ctx: createRequestContext(req),
    clientId: process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || '',
    environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT || '',
    cookies: req.cookies,
    ip: ipAddress(req),
    location: {
      city: req.geo?.city,
      region: req.geo?.region,
      country: req.geo?.country,
      continent: getContinentCode(req.geo?.country),
    },
  });

  const redirectExperience = parsedRedirectExperiences.find(
    (parsedExperience) => {
      return experiences.some((experience) => {
        return experience.experienceId === parsedExperience.id;
      });
    }
  );

  const component = redirectExperience?.components.find(
    (component) => component.baseline.id === redirectBaseline.sys.id
  );

  let redirectVariant = null;

  if (redirectExperience && component) {
    const variantIndex = experiences.find((experience) => {
      return experience.experienceId === redirectExperience.id;
    })?.variantIndex!;

    const selectableVariants = [redirectBaseline, ...component.variants];
    redirectVariant = selectableVariants[variantIndex];
  }

  const experienceSelections = encodeExperienceSelections(experiences);

  // Create a rewrite
  const url = req.nextUrl.clone();
  if (redirectVariant) {
    url.pathname = redirectVariant.fields.to;
  }
  url.pathname = `/${EDGE_URL_DELIMITER}${experienceSelections}${profile.id}${url.pathname}`;
  url.pathname = url.pathname.replace(/\/$/, ''); // Remove any trailing slash
  const res = NextResponse.rewrite(url);
  res.cookies.set(NINETAILED_ANONYMOUS_ID_COOKIE, profile.id);

  return res;
}
