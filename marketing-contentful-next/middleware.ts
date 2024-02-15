import { NextRequest, NextResponse } from 'next/server';
import { ipAddress } from '@vercel/edge';
import { NINETAILED_ANONYMOUS_ID_COOKIE } from '@ninetailed/experience.js-shared';
import {
  buildNinetailedEdgeRequestContext,
  fetchEdgeProfile,
} from './lib/middlewareFunctions';
import { getContinentCode } from './lib/geolocation';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

type VariantSelection = {
  experienceId: string;
  variantIndex: number;
};

export default async function middleware(req: NextRequest) {
  const fetchProfileOptions = {
    ctx: buildNinetailedEdgeRequestContext(req),
    // TODO: Add these variables to a type declaration file
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
  };

  const { profile, experiences } = await fetchEdgeProfile(fetchProfileOptions);

  const variantSelections: VariantSelection[] = [
    ...experiences.map((experience) => {
      return {
        experienceId: experience.experienceId,
        variantIndex: experience.variantIndex,
      };
    }),
  ];

  const variantsPath = variantSelections
    .map((selection) => {
      return `${selection.experienceId}=${selection.variantIndex}`;
    })
    .sort()
    .join(',');

  // Create a rewrite
  const url = req.nextUrl.clone();
  url.pathname = `/;${variantsPath}${url.pathname}`;
  url.pathname = url.pathname.replace(/\/$/, '');
  const res = NextResponse.rewrite(url);
  res.cookies.set(NINETAILED_ANONYMOUS_ID_COOKIE, profile.id);

  return res;
}
