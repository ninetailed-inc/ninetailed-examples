import { NextRequest, NextResponse } from 'next/server';
import { ipAddress } from '@vercel/edge';
import { NINETAILED_ANONYMOUS_ID_COOKIE } from '@ninetailed/experience.js-shared';
import { createRequestContext, sendPageEvent } from './lib/middlewareFunctions';
import { getContinentCode } from './lib/geolocation';
import { EDGE_URL_DELIMITER } from './lib/constants';

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
      source: '/((?!api|_next/static|_next/image|favicon).*)',
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

  // TODO: Put pre-selected variants into the path so you don't have to fetch the whole profile again
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
  url.pathname = `/${EDGE_URL_DELIMITER}${profile.id}${url.pathname}`;
  url.pathname = url.pathname.replace(/\/$/, ''); // Remove any trailing slash
  const res = NextResponse.rewrite(url);
  res.cookies.set(NINETAILED_ANONYMOUS_ID_COOKIE, profile.id);

  return res;
}
