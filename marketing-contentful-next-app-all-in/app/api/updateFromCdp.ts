// TODO: Add example handler back in
// import { NextApiRequest, NextApiResponse } from 'next';
// import { NinetailedAPIClient } from '@ninetailed/experience.js-node';
// import { Traits } from '@ninetailed/experience.js-shared';

// type SendEventOptions = {
//   anonymousId?: string;
//   timestamp?: number;
// };

// type CdpWebhookPayload = {
//   ownername?: string;
//   lifecyclestage?: string;
//   ninetailedid: string;
//   ninetailed_environment: string;
//   ninetailed_organization_id: string;
// };

// type ApiRequest = Omit<NextApiRequest, 'body'> & {
//   body: CdpWebhookPayload;
// };

// async function upsertProfileViaIdentify(
//   apiClient: NinetailedAPIClient,
//   {
//     id,
//     traits,
//     options,
//   }: { id: string; traits: Traits; options?: SendEventOptions }
// ) {
//   const response = await apiClient.sendIdentifyEvent(id, traits, options);
//   return response;
// }

// export default async function handler(
//   request: ApiRequest,
//   response: NextApiResponse
// ) {
//   if (
//     request.headers['x-ninetailed-secret'] !== process.env.WEBHOOK_CLIENT_SECRET
//   ) {
//     return response.status(403).json({
//       error: {
//         code: 'Forbidden',
//         message: 'Not authorized',
//       },
//     });
//   }

//   const apiClient = new NinetailedAPIClient({
//     clientId: request.body.ninetailed_organization_id,
//     environment: request.body.ninetailed_environment,
//   });

//   const ninetailedResponse = await upsertProfileViaIdentify(apiClient, {
//     id: request.body.ninetailedid,
//     traits: {
//       ...(request.body.lifecyclestage && {
//         lifecyclestage: request.body.lifecyclestage,
//       }),
//       ...(request.body.ownername && { ownername: request.body.ownername }),
//     },
//   });

//   return response.status(200).json(ninetailedResponse);
// }
