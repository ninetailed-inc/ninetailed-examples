import React, { PropsWithChildren } from 'react';

import { Reference } from '@ninetailed/experience.js';
import { getExperiences } from '@/lib/ninetailedServerContext';
import { ExperienceBaseProps } from '@/types/serverExperience';
import { ComponentTracker } from '../Client/ComponentTracker';

export const ServerExperience = <
  P,
  PassThroughProps extends Partial<P> = Partial<P>,
  Variant extends Pick<P, Exclude<keyof P, keyof PassThroughProps>> &
    Reference = Pick<P, Exclude<keyof P, keyof PassThroughProps>> & Reference
>({
  experiences,
  component: Component,
  passthroughProps,
  ...baseline
}: ExperienceBaseProps<P, PassThroughProps, Variant>) => {
  const profileExperiences = getExperiences();

  if (!profileExperiences) {
    return (
      <>
        <ComponentTracker variant={baseline} variantIndex={0} />
        <Component
          {...passthroughProps}
          {...(baseline as P)}
          ninetailed={{ isPersonalized: false, audience: { id: 'baseline' } }}
        />
      </>
    );
  }

  const experience = experiences.find(
    (experience) => profileExperiences[experience.id]
  );

  if (!experience) {
    return (
      <>
        <ComponentTracker variant={baseline} variantIndex={0} />
        <Component
          {...passthroughProps}
          {...(baseline as P)}
          ninetailed={{ isPersonalized: false, audience: { id: 'baseline' } }}
        />
      </>
    );
  }

  const component = experience.components.find(
    (component) => component.baseline.id === baseline.id
  );

  if (!component) {
    return (
      <>
        <ComponentTracker variant={baseline} variantIndex={0} />
        <Component
          {...passthroughProps}
          {...(baseline as P)}
          ninetailed={{ isPersonalized: false, audience: { id: 'baseline' } }}
        />
      </>
    );
  }

  const variantIndex = profileExperiences[experience.id];
  const selectableVariants = [baseline, ...component.variants];
  const variant = selectableVariants[variantIndex];

  if (!variant) {
    return (
      <>
        <ComponentTracker variant={baseline} variantIndex={0} />
        <Component
          {...passthroughProps}
          {...(baseline as P)}
          ninetailed={{ isPersonalized: false, audience: { id: 'baseline' } }}
        />
      </>
    );
  }

  if ('hidden' in variant && variant.hidden) {
    return null;
  }

  return (
    <>
      <ComponentTracker
        experience={experience}
        variant={variant}
        variantIndex={variantIndex}
      />
      <Component
        {...passthroughProps}
        {...(variant as P)}
        ninetailed={{
          isPersonalized: true,
          audience: { id: experience.audience?.id },
        }}
      />
    </>
  );
};
