import React from 'react';
import { Experience } from '@ninetailed/experience.js-next';
import {
  BaselineWithExperiencesEntry,
  ExperienceMapper,
  Entry,
} from '@ninetailed/experience.js-utils-contentful';

import get from 'lodash/get';

import { Hero } from '@/components/Hero';
import { CTA } from '@/components/Cta';
import { Feature } from '@/components/Feature';
import { Banner } from '@/components/Banner';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PricingTable } from '@/components/PricingTable';
import { PricingPlan } from '@/components/PricingPlan';
import { HubspotForm } from '@/components/HubspotForm';

import {
  IBanner,
  ICta,
  IFooter,
  IHero,
  IHubspotForm,
  INavigation,
  IPricingPlan,
  IPricingTable,
} from '@/types/contentful';

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

type BlockRendererProps = {
  block:
    | Entry
    | Entry[]
    | BaselineWithExperiencesEntry
    | BaselineWithExperiencesEntry[];
};

type Component =
  | IHero
  | ICta
  | IBanner
  | INavigation
  | IFooter
  | IPricingTable
  | IPricingPlan
  | IHubspotForm;

const hasExperiences = (
  entry: Entry | BaselineWithExperiencesEntry
): entry is BaselineWithExperiencesEntry => {
  return (
    (entry as BaselineWithExperiencesEntry).fields.nt_experiences !== undefined
  );
};

const ComponentRenderer = (props: Component) => {
  const contentTypeId = props.sys.contentType.sys.id;
  const Component = ContentTypeMap[contentTypeId];

  if (!Component) {
    console.warn(`${contentTypeId} can not be handled`);
    return null;
  }

  // eslint-disable-next-line
  // @ts-ignore
  return <Component {...props} />;
};

export const BlockRenderer = ({ block }: BlockRendererProps) => {
  if (Array.isArray(block)) {
    return (
      <>
        {block.map((b) => {
          return <BlockRenderer key={`block-${b.sys.id}`} block={b} />;
        })}
      </>
    );
  }

  const contentTypeId = get(block, 'sys.contentType.sys.id') as string;
  const { id } = block.sys;

  const mappedExperiences = hasExperiences(block)
    ? block.fields.nt_experiences
        .filter((experience) => ExperienceMapper.isExperienceEntry(experience))
        .map((experience) => ExperienceMapper.mapExperience(experience))
    : [];

  return (
    <div key={`${contentTypeId}-${id}`}>
      <Experience
        {...block}
        id={id}
        component={ComponentRenderer}
        experiences={mappedExperiences}
      />
    </div>
  );
};
