'use client';

import { ExperienceConfiguration } from '@ninetailed/experience.js';
import { useEffect, useRef } from 'react';
import { ComponentMarker } from './ComponentMarker';

import React from 'react';
import { Reference } from '@ninetailed/experience.js-shared';
import { useNinetailed } from '@ninetailed/experience.js-react';

export function ComponentTracker<Variant extends Reference>({
  experience,
  variant,
  variantIndex,
}: {
  experience?: ExperienceConfiguration<Variant>;
  variant: Variant;
  variantIndex: number;
}) {
  const componentRef = useRef<Element | null>(null);
  const ninetailed = useNinetailed();

  useEffect(() => {
    const componentElement = componentRef.current;

    if (componentElement && !(componentElement instanceof Element)) {
      const isObject =
        typeof componentElement === 'object' && componentElement !== null;
      const constructorName = isObject
        ? // eslint-disable-next-line
          ((componentElement as any).constructor.name as string)
        : '';
      const isConstructorNameNotObject =
        constructorName && constructorName !== 'Object';

      console.warn(
        `The component ref being in Experience is an invalid element. Expected an Element but got ${typeof componentElement}${
          isConstructorNameNotObject ? ` of type ${constructorName}` : ''
        }. This component won't be observed.`
      );

      return () => {
        // noop
      };
    }

    if (componentElement) {
      ninetailed.observeElement({
        element: componentElement,
        experience,
        audience: experience?.audience,
        variant:
          'hidden' in variant && variant.hidden
            ? { ...variant, id: `${variant.id}-hidden` }
            : variant,
        variantIndex,
      });

      return () => {
        if (componentElement) {
          ninetailed.unobserveElement(componentElement);
        }
      };
    }

    return () => {
      // noop
    };
  }, [JSON.stringify(experience), JSON.stringify(variant), variantIndex]);

  return <ComponentMarker ref={componentRef}></ComponentMarker>;
}
