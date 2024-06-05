'use client';

import React from 'react';
import { Experience } from '@/components/Client/ClientExperience';

import get from 'lodash/get';

import {
  ClientBanner,
  ClientCta,
  ClientHero,
  ClientHubspotForm,
  ClientFeature,
  ClientFooter,
  ClientNavigation,
  ClientPricingPlan,
  ClientPricingTable,
  ClientSectionsGroup,
} from '@/components/Client/ClientBlocks';

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

const ContentTypeMap = {
  [ComponentContentTypes.Banner]: ClientBanner,
  [ComponentContentTypes.CTA]: ClientCta,
  [ComponentContentTypes.Hero]: ClientHero,
  [ComponentContentTypes.HubspotForm]: ClientHubspotForm,
  [ComponentContentTypes.Feature]: ClientFeature,
  [ComponentContentTypes.Footer]: ClientFooter,
  [ComponentContentTypes.Navigation]: ClientNavigation,
  [ComponentContentTypes.PricingPlan]: ClientPricingPlan,
  [ComponentContentTypes.PricingTable]: ClientPricingTable,
  [ComponentContentTypes.SectionsGroup]: ClientSectionsGroup,
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

  const contentTypeId = get(block, 'sys.contentType.sys.id') as string;
  const { id } = block.sys;

  const parsedExperiences = parseExperiences(block);

  return (
    <Experience
      key={`${contentTypeId}-${id}`}
      {...block}
      id={id}
      component={ComponentRenderer}
      experiences={parsedExperiences}
    />
  );
};
