import React from 'react';
import get from 'lodash/get';
import { ExperienceMapper } from '@ninetailed/experience.js-utils';

import { Experience } from '@ninetailed/experience.js-next';

import { Hero } from '@/components/Hero';
import { CTA } from '@/components/Cta';
import { Feature } from '@/components/Feature';
import { Banner } from '@/components/Banner';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PricingTable } from '@/components/PricingTable';
import { PricingPlan } from '@/components/PricingPlan';
import { HubspotForm } from '@/components/HubspotForm';

import { ComponentContentTypes } from '@/lib/constants';

const ContentTypeMap = {
  [ComponentContentTypes.Hero]: Hero,
  [ComponentContentTypes.CTA]: CTA,
  [ComponentContentTypes.Feature]: Feature,
  [ComponentContentTypes.Banner]: Banner,
  [ComponentContentTypes.Navigation]: Navigation,
  [ComponentContentTypes.Footer]: Footer,
  [ComponentContentTypes.PricingPlan]: PricingPlan,
  [ComponentContentTypes.PricingTable]: PricingTable,
  [ComponentContentTypes.HubspotForm]: HubspotForm,
};

const ComponentRenderer = (props: any) => {
  const contentTypeId: string = props._content_type_uid;
  // eslint-disable-next-line
  // @ts-ignore
  const Component = ContentTypeMap[contentTypeId];

  if (!Component) {
    console.warn(`${contentTypeId} can not be handled`);
    return null;
  }

  return <Component {...props} />;
};

const BlockRenderer = ({ block }: { block: any }) => {
  if (Array.isArray(block)) {
    return (
      <>
        {block.map((b) => {
          return <BlockRenderer key={`block-${b.uid}`} block={b} />;
        })}
      </>
    );
  }

  const contentTypeId = get(block, '_content_type_uid') as string;
  const id = block.uid;

  const experiences = (block.nt_experiences || [])
    .map((experience: any) => {
      return {
        name: experience.nt_name,
        type: experience.nt_type,
        config: experience.nt_config,
        audience: {
          id: experience.nt_audience[0].nt_audience_id,
          name: experience.nt_audience[0].nt_name,
        },
        id: experience.uid,
        variants: experience.nt_variants?.map((variant: any) => {
          return {
            id: variant.uid,
            ...variant,
          };
        }),
      };
    })
    .filter((experience: any) => ExperienceMapper.isExperienceEntry(experience))
    .map((experience: any) => ExperienceMapper.mapExperience(experience));

  return (
    <div key={`${contentTypeId}-${id}`}>
      <Experience
        {...block}
        id={id}
        component={ComponentRenderer}
        experiences={experiences}
      />
    </div>
  );
};

export { BlockRenderer };
