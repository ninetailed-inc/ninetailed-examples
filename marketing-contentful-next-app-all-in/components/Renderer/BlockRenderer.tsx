import React from 'react';

import { Banner } from '@/components/Banner';
import { Cta } from '@/components/Cta';
import { Feature } from '@/components/Feature';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HubspotForm } from '@/components/HubspotForm';
import { Navigation } from '@/components/Navigation';
import { PricingPlan } from '@/components/PricingPlan';
import { PricingTable } from '@/components/PricingTable';
import { SectionsGroup } from '@/components/SectionsGroup';

import {
  IBanner,
  ICta,
  IFooter,
  IHero,
  IHubspotForm,
  INavigation,
  IPricingPlan,
  IPricingTable,
  ISectionsGroup,
} from '@/types/contentful';

import { ComponentContentTypes } from '@/lib/constants';

import { parseExperiences, singularOrArrayBlock } from '@/lib/experiences';
import { ServerExperience } from '../ServerExperience';
import { get } from 'lodash';

const ContentTypeMap = {
  [ComponentContentTypes.Banner]: Banner,
  [ComponentContentTypes.CTA]: Cta,
  [ComponentContentTypes.Hero]: Hero,
  [ComponentContentTypes.HubspotForm]: HubspotForm,
  [ComponentContentTypes.Feature]: Feature,
  [ComponentContentTypes.Footer]: Footer,
  [ComponentContentTypes.Navigation]: Navigation,
  [ComponentContentTypes.PricingPlan]: PricingPlan,
  [ComponentContentTypes.PricingTable]: PricingTable,
  [ComponentContentTypes.SectionsGroup]: SectionsGroup,
};

type Component =
  | IBanner
  | ICta
  | IFooter
  | IHero
  | IHubspotForm
  | INavigation
  | IPricingPlan
  | IPricingTable
  | ISectionsGroup;

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

export const BlockRenderer = ({ block }: { block: singularOrArrayBlock }) => {
  if (Array.isArray(block)) {
    return (
      <>
        {block.map((b) => {
          return <BlockRenderer key={`block-${b.sys.id}`} block={b} />;
        })}
      </>
    );
  }

  const { id } = block.sys;
  const contentTypeId = get(block, 'sys.contentType.sys.id') as string;

  return (
    <ServerExperience
      {...block}
      id={id}
      key={`${contentTypeId}-${id}`}
      component={ComponentRenderer}
      experiences={parseExperiences(block)}
    />
  );
};
