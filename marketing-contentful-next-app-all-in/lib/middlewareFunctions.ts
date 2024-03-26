import {
  buildPageEvent,
  GeoLocation,
  NinetailedRequestContext,
  NinetailedApiClient,
  NINETAILED_ANONYMOUS_ID_COOKIE,
  SelectedVariantInfo,
} from '@ninetailed/experience.js-shared';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { v4 as uuid } from 'uuid';

type SendPagePayload = {
  ctx: NinetailedRequestContext;
  cookies: RequestCookies;
  clientId: string;
  environment?: string;
  url?: string;
  ip?: string;
  location?: GeoLocation;
};

export type SelectedVariant = { experienceId: string; variantIndex: number };

export const createRequestContext = (
  request: Request
): NinetailedRequestContext => {
  return {
    url: request.url,
    locale: 'en-US', // One would make this dynamic if handling multiple locales
    referrer: request.headers.get('referer') || '',
    userAgent: request.headers.get('user-agent') || '',
  };
};

export const sendPageEvent = async ({
  clientId,
  environment,
  ctx,
  cookies,
  url,
  ip,
  location,
}: SendPagePayload) => {
  const apiClient = new NinetailedApiClient({ clientId, environment, url });
  const ninetailedId = cookies.get(NINETAILED_ANONYMOUS_ID_COOKIE)?.value;

  const pageEvent = buildPageEvent({
    ctx,
    messageId: uuid(),
    timestamp: Date.now(),
    properties: {},
  });

  return apiClient.upsertProfile(
    {
      profileId: ninetailedId,
      events: [{ ...pageEvent, context: { ...pageEvent.context, location } }],
    },
    { ip }
  );
};

export const encodeExperienceSelections = (
  selections: SelectedVariantInfo[]
): string => {
  return selections
    .map((selection) => {
      return {
        experienceId: selection.experienceId,
        variantIndex: selection.variantIndex,
      };
    })
    .map((selection) => {
      return `${selection.experienceId}=${selection.variantIndex}`;
    })
    .sort()
    .join(',');
};

export const decodeExperienceSelections = (
  encodedExperienceVariantsMap: string
): Record<string, number> => {
  return encodedExperienceVariantsMap
    .split(encodeURIComponent(','))
    .map((experienceIdWithVariant) => {
      const [experienceId, _variantIndex] = experienceIdWithVariant.split(
        encodeURIComponent('=')
      );

      const variantIndex = parseInt(_variantIndex);

      if (!experienceId || !variantIndex) {
        return null;
      }

      return { experienceId, variantIndex };
    })
    .filter((x): x is SelectedVariant => !!x)
    .reduce(
      (acc, curr) => ({ ...acc, [curr.experienceId]: curr.variantIndex }),
      {}
    );
};
