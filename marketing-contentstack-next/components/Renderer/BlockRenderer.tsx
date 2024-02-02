import React from 'react';

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
import {
  parseExperiences,
  parseModularBlockExperiences,
} from '@/lib/experiences';
import {
  getBlockId,
  getContentType,
  isModularBlock,
} from '@/lib/modularblocks';

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
  const contentTypeId: string = getContentType(props);

  // eslint-disable-next-line
  // @ts-ignore
  const Component = ContentTypeMap[contentTypeId];

  if (!Component) {
    console.warn(`${contentTypeId} can not be handled`);
    return null;
  }

  return <Component {...props} />;
};

const BlockRenderer = ({
  block,
  modularBlockExperiences,
}: {
  block: any;
  modularBlockExperiences?: any[];
}) => {
  if (Array.isArray(block)) {
    return (
      <>
        {block.map((b) => {
          return (
            <BlockRenderer
              key={`block-${getBlockId(b)}`}
              block={b}
              modularBlockExperiences={modularBlockExperiences}
            />
          );
        })}
      </>
    );
  }

  const contentTypeId = getContentType(block);
  const id = getBlockId(block);

  if (isModularBlock(block)) {
    const ntExperiences = modularBlockExperiences || [];
    const mappedVariants = (
      (ntExperiences.length &&
        ntExperiences.map((experience) => {
          const variants = experience.nt_experience_block.nt_variants;
          return variants?.map((variant: any) => {
            return {
              ...variant,
              id: getBlockId(variant),
            };
          });
        })) ||
      []
    ).flat();

    const mappedExperiences = parseModularBlockExperiences(
      modularBlockExperiences,
      mappedVariants
    );
    return (
      // eslint-disable-next-line react/jsx-key
      <Experience
        {...block}
        id={id}
        component={ComponentRenderer}
        experiences={mappedExperiences}
        key={`${contentTypeId}-${id}`}
      />
    );
  } else {
    const mappedExperiences = parseExperiences(block);
    return (
      <Experience
        {...block}
        id={id}
        component={ComponentRenderer}
        experiences={mappedExperiences}
        key={`${contentTypeId}-${id}`}
      />
    );
  }
};

export { BlockRenderer };
