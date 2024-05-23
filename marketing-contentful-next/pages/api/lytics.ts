import { NextApiRequest, NextApiResponse } from 'next';
import { NinetailedAPIClient } from '@ninetailed/experience.js-node';

type ApiRequest = Omit<NextApiRequest, 'body'> & {
  body: LyticsPayload;
};

export type LyticsPayload = {
  id: string;
  data: {
    _segments: string[];
    _uid: string;
    channels: string[];
    domains: string[];
    score_consistency: number;
    score_frequency: number;
    score_intensity: number;
    score_maturity: number;
    score_momentum: number;
    score_propensity: number;
    score_quantity: number;
    score_recency: number;
    score_volatility: number;
    segment_events: SegmentEvent[];
    segment_prediction: Record<string, number>;
  };
  meta: {
    object: 'user';
    subscription_id: string;
    timestamp: string;
  };
};

type BaseSegmentEvent = {
  id: string;
  slug: string;
};

interface EnterSegmentEvent extends BaseSegmentEvent {
  event: 'enter';
  enter: string;
}

interface ExitSegmentEvent extends BaseSegmentEvent {
  event: 'exit';
  exit: string;
}

interface ChangeSegmentEvent extends BaseSegmentEvent {
  event: 'change';
}

type SegmentEvent = EnterSegmentEvent | ExitSegmentEvent | ChangeSegmentEvent;

export default async function handler(
  request: ApiRequest,
  response: NextApiResponse
) {
  if (
    request.headers['x-ninetailed-secret'] !== process.env.WEBHOOK_CLIENT_SECRET
  ) {
    console.error('Unauthortized');
    return response.status(403).json({
      error: {
        code: 'Forbidden',
        message: 'Not authorized',
      },
    });
  }

  console.log(`request`, request.body);

  const USER_ID_KEY = '_uid';
  const EVENTS_KEY = 'segment_events';
  const SEGMENTS_KEY = '_segments';
  const {
    [USER_ID_KEY]: userId,
    [EVENTS_KEY]: _,
    [SEGMENTS_KEY]: lyticsSegments,
    ...rest
  } = request.body.data;

  // This option loops over the triggering events to add/remove
  // for (const event of _) {
  //   switch (event.event) {
  //     case "enter":
  //       traitsPayload[event.slug] = true;
  //       break;
  //     case "exit":
  //       traitsPayload[event.slug] = false;
  //   }
  // }

  // Or just get it directly from _segments
  const traits = { lyticsSegments, ...rest };

  const apiClient = new NinetailedAPIClient({
    clientId: process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID || '',
    environment: process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT,
  });

  const ninetailedResponse = await apiClient.sendIdentifyEvent(userId, traits);

  console.log(`9t-response`, ninetailedResponse);

  return response.status(200).json(ninetailedResponse);
}
