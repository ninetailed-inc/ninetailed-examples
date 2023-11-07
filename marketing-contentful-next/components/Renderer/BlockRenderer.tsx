import React from 'react';
import { Experience } from '@ninetailed/experience.js-next';

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
import { ProductDetail } from '@/components/ProductDetail';

import {
  IBanner,
  ICta,
  IFooter,
  IHero,
  IHubspotForm,
  INavigation,
  IPricingPlan,
  IPricingTable,
  IProductDetail,
} from '@/types/contentful';

import { ComponentContentTypes } from '@/lib/constants';
import { parseExperiences, singularOrArrayBlock } from '@/lib/experiences';

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
  [ComponentContentTypes.ProductDetail]: ProductDetail,
};

type Component =
  | IHero
  | ICta
  | IBanner
  | INavigation
  | IFooter
  | IPricingTable
  | IPricingPlan
  | IHubspotForm
  | ProductDetail;

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
    <div key={`${contentTypeId}-${id}`}>
      <Experience
        {...block}
        id={id}
        component={ComponentRenderer}
        experiences={parsedExperiences}
      />
    </div>
  );
};
