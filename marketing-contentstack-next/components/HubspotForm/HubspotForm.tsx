/* eslint-disable */
// @ts-nocheck
// TODO: Properly type this file

import React, { useEffect, useState } from 'react';
import { useHubspotForm } from '@aaronhayes/react-use-hubspot-form';
import { useNinetailed, useProfile } from '@ninetailed/experience.js-next';
import { IHubspotForm } from '@/types/contentstack';

import find from 'lodash/find';

export const HubspotForm: React.FC<IHubspotForm> = (props) => {
  const { loading, profile } = useProfile();
  const { identify } = useNinetailed();
  const [anonymousIdInput, setAnonymousIdInput] = useState(null);
  const [submitData, setSubmitData] = useState(null);
  useEffect(() => {
    const listener: EventListener = (event) => {
      if (
        event.data.type === 'hsFormCallback' &&
        event.data.eventName === 'onFormReady'
      ) {
        const formIframe = document.querySelector('#form > iframe');
        if (formIframe) {
          const anonymousIdInputTemp = formIframe.contentDocument.querySelector(
            'input[name=ninetailedid]'
          );
          setAnonymousIdInput(anonymousIdInputTemp);
        }
      }

      if (
        event.data.type === 'hsFormCallback' &&
        event.data.eventName === 'onFormSubmit'
      ) {
        setSubmitData(event.data.data);
      }

      if (
        event.data.type === 'hsFormCallback' &&
        event.data.eventName === 'onFormSubmitted'
      ) {
        console.log(submitData);
        const anonymousId = find(submitData, { name: 'ninetailedid' }).value;
        const traits = submitData
          .filter(({ name }) => {
            return name !== 'ninetailedid';
          })
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
    if (anonymousIdInput && !loading && anonymousIdInput.value !== profile.id) {
      console.log('setting anonymousID');
      anonymousIdInput.value = profile.id;
    }
  }, [anonymousIdInput, loading, profile]);

  useHubspotForm({
    target: '#form',
    portalId: props.hubspot_portal_id,
    formId: props.hubspot_form_id,
  });

  return (
    <div
      className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-12 lg:max-w-7xl"
      id="form"
    />
  );
};
