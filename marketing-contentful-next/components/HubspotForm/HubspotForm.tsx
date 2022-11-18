import React, { useEffect, useState } from 'react';
import { useHubspotForm } from '@aaronhayes/react-use-hubspot-form';
import { useNinetailed, useProfile } from '@ninetailed/experience.js-next';
import * as Contentful from 'contentful';

import find from 'lodash/find';

interface IHubspotFormFields {
  hubspotFormId: Contentful.EntryFields.Symbol;
  hubspotPortalId: Contentful.EntryFields.Symbol;
  hubspotPortalRegion: Contentful.EntryFields.Symbol;
}

type IHubspotForm = Contentful.Entry<IHubspotFormFields>;

export const HubspotForm: React.FC<IHubspotForm> = ({ fields }) => {
  const { loading, profile } = useProfile();
  const { identify } = useNinetailed();
  const [anonymousIdInput, setAnonymousIdInput] = useState(null);
  const [submitData, setSubmitData] = useState(null);
  useEffect(() => {
    const listener: EventListener = (event) => {
      if (
        // @ts-ignore
        event.data.type === 'hsFormCallback' &&
        // @ts-ignore
        event.data.eventName === 'onFormReady'
      ) {
        const formIframe = document.querySelector('#form > iframe');
        if (formIframe) {
          // @ts-expect-error
          const anonymousIdInputTemp = formIframe.contentDocument.querySelector(
            'input[name=ninetailedid]'
          );
          setAnonymousIdInput(anonymousIdInputTemp);
        }
      }

      if (
        // @ts-ignore
        event.data.type === 'hsFormCallback' &&
        // @ts-ignore
        event.data.eventName === 'onFormSubmit'
      ) {
        // @ts-ignore
        setSubmitData(event.data.data);
      }

      if (
        // @ts-ignore
        event.data.type === 'hsFormCallback' &&
        // @ts-ignore
        event.data.eventName === 'onFormSubmitted'
      ) {
        console.log(submitData);
        // @ts-expect-error
        const anonymousId = find(submitData, { name: 'ninetailedid' }).value;
        // @ts-expect-error
        const traits = submitData
          // @ts-expect-error
          .filter(({ name }) => {
            return name !== 'ninetailedid';
          })
          // @ts-expect-error
          .reduce((acc, curr) => {
            return { ...acc, [curr.name]: curr.value };
          }, {});

        identify(anonymousId, traits);
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [setAnonymousIdInput, setSubmitData, submitData]);
  useEffect(() => {
    // @ts-expect-error
    if (anonymousIdInput && !loading && anonymousIdInput.value !== profile.id) {
      console.log('setting anonymousID');
      // @ts-expect-error
      anonymousIdInput.value = profile.id;
    }
  }, [anonymousIdInput, loading, profile]);

  useHubspotForm({
    target: '#form',
    portalId: fields.hubspotPortalId,
    formId: fields.hubspotFormId,
  });

  return (
    <div
      className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-12 lg:max-w-7xl"
      id="form"
    />
  );
};
