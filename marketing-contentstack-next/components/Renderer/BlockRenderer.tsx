import React from 'react';
import * as Contentful from 'contentful';
import get from 'lodash/get';
import { Experience } from '@ninetailed/experience.js-next';
import {
  BaselineWithExperiencesEntryLike,
  ExperienceMapper,
} from '@ninetailed/experience.js-utils-contentful';

import { Hero } from '@/components/Hero';
import { CTA } from '@/components/Cta';
import { Feature } from '@/components/Feature';
import { Banner } from '@/components/Banner';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PricingTable } from '@/components/PricingTable';
import { PricingPlan } from '@/components/PricingPlan';
import { Form } from '@/components/Form';
import { HubspotForm } from '@/components/HubspotForm';

import { ComponentContentTypes } from '@/lib/constants';
import {
  IBanner,
  IBannerFields,
  ICta,
  ICtaFields,
  IFeature,
  IFeatureFields,
  IFooter,
  IFooterFields,
  IForm,
  IFormFields,
  IHero,
  IHeroFields,
  IHubspotForm,
  IHubspotFormFields,
  INavigation,
  INavigationFields,
  IPricingTable,
  IPricingTableFields,
} from '@/types/contentful';

const ContentTypeMap = {
  [ComponentContentTypes.Hero]: Hero,
  [ComponentContentTypes.CTA]: CTA,
  [ComponentContentTypes.Feature]: Feature,
  [ComponentContentTypes.Banner]: Banner,
  [ComponentContentTypes.Navigation]: Navigation,
  [ComponentContentTypes.Footer]: Footer,
  [ComponentContentTypes.PricingPlan]: PricingPlan,
  [ComponentContentTypes.PricingTable]: PricingTable,
  [ComponentContentTypes.Form]: Form,
  [ComponentContentTypes.HubspotForm]: HubspotForm,
};

type ExperientialContentTypeFields =
  | IBannerFields
  | INavigationFields
  | IHeroFields
  | ICtaFields
  | IFeatureFields
  | IPricingTableFields
  | IHubspotFormFields
  | IFormFields
  | IFooterFields;

type BlockRendererProps = {
  block:
    | BaselineWithExperiencesEntryLike<ExperientialContentTypeFields>
    | BaselineWithExperiencesEntryLike<ExperientialContentTypeFields>[];
};

type ComponentRendererProps =
  | IBanner
  | INavigation
  | IHero
  | ICta
  | IFeature
  | IPricingTable
  | IHubspotForm
  | IForm
  | IFooter;

const ComponentRenderer: React.FC<ComponentRendererProps> = (props) => {
  // TODO: Get this to function as a type guard so that line 94 knows which component to use
  const contentTypeId = props.sys.contentType.sys.id;
  const Component = ContentTypeMap[contentTypeId];

  // I want to do something like narrow which of the possible componentRendererProps types props actually is by using the contentTypeId as the discriminant property
  // Can I do that without writing a clunky switch statement?

  if (!Component) {
    console.warn(`${contentTypeId} can not be handled`);
    return null;
  }
  // FIXME:
  //@ts-ignore
  return <Component {...props} />;
};

const BlockRenderer = ({ block }: BlockRendererProps) => {
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

  const experiences = (block.fields.nt_experiences || [])
    .filter((experience) => ExperienceMapper.isExperienceEntry(experience))
    .map((experience) => ExperienceMapper.mapExperience(experience));

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
