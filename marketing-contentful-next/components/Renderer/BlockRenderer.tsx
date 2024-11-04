import React from 'react';
import { Experience } from '@ninetailed/experience.js-next';

import get from 'lodash/get';

import { Banner } from '@/components/Banner';
import { CTA } from '@/components/Cta';
import { Feature } from '@/components/Feature';
import { FlexibleSection } from '@/components/Studio';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HubspotForm } from '@/components/HubspotForm';
import { Navigation } from '@/components/Navigation';
import { PricingPlan } from '@/components/PricingPlan';
import { PricingTable } from '@/components/PricingTable';
import { ProductDetail } from '@/components/ProductDetail';
import { ProductPolicy } from '@/components/ProductPolicy';
import { SectionsGroup } from '@/components/SectionsGroup';

import { ComponentContentTypes } from '@/lib/constants';
import { parseExperiences, singularOrArrayBlock } from '@/lib/experiences';

import type {
  TypeBannerWithoutUnresolvableLinksResponse,
  TypeCtaWithoutUnresolvableLinksResponse,
  TypeFeatureWithoutUnresolvableLinksResponse,
  TypeFlexibleSectionWithoutUnresolvableLinksResponse,
  TypeFooterWithoutUnresolvableLinksResponse,
  TypeHeroWithoutUnresolvableLinksResponse,
  TypeHubspotFormWithoutUnresolvableLinksResponse,
  TypeNavigationWithoutUnresolvableLinksResponse,
  TypePricingPlanWithoutUnresolvableLinksResponse,
  TypePricingTableWithoutUnresolvableLinksResponse,
  TypeProductDetailWithoutUnresolvableLinksResponse,
  TypeProductPolicyWithoutUnresolvableLinksResponse,
  TypeSectionsGroupWithoutUnresolvableLinksResponse,
} from '../../types';

const ContentTypeMap = {
  [ComponentContentTypes.Banner]: Banner,
  [ComponentContentTypes.CTA]: CTA,
  [ComponentContentTypes.Hero]: Hero,
  [ComponentContentTypes.HubspotForm]: HubspotForm,
  [ComponentContentTypes.Feature]: Feature,
  [ComponentContentTypes.FlexibleSection]: FlexibleSection,
  [ComponentContentTypes.Footer]: Footer,
  [ComponentContentTypes.Navigation]: Navigation,
  [ComponentContentTypes.PricingPlan]: PricingPlan,
  [ComponentContentTypes.PricingTable]: PricingTable,
  [ComponentContentTypes.ProductDetail]: ProductDetail,
  [ComponentContentTypes.ProductPolicy]: ProductPolicy,
  [ComponentContentTypes.SectionsGroup]: SectionsGroup,
};

type Component =
  | TypeBannerWithoutUnresolvableLinksResponse
  | TypeCtaWithoutUnresolvableLinksResponse
  | TypeFeatureWithoutUnresolvableLinksResponse
  | TypeFlexibleSectionWithoutUnresolvableLinksResponse
  | TypeFooterWithoutUnresolvableLinksResponse
  | TypeHeroWithoutUnresolvableLinksResponse
  | TypeHubspotFormWithoutUnresolvableLinksResponse
  | TypeNavigationWithoutUnresolvableLinksResponse
  | TypePricingPlanWithoutUnresolvableLinksResponse
  | TypePricingTableWithoutUnresolvableLinksResponse
  | TypeProductDetailWithoutUnresolvableLinksResponse
  | TypeProductPolicyWithoutUnresolvableLinksResponse
  | TypeSectionsGroupWithoutUnresolvableLinksResponse;

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
      <div>
        {block.map((b) => {
          if (!b) {
            return null;
          }
          return <BlockRenderer key={`block-${b.sys.id}`} block={b} />;
        })}
      </div>
    );
  }

  if (!block) {
    return null;
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
