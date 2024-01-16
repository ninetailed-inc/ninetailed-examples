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

function isModularBlock(obj: any) {
  if (Object.prototype.hasOwnProperty.call(obj, '_content_type_uid')) {
    return false;
  }

  // Otherwise, it's likely a modular block
  return true;
}

function getBlockId(obj: any) {
  let id = '';

  if (isModularBlock(obj)) {
    // Find and return the key that is not '$' and extract it as the content type
    const keys = Object.keys(obj);
    const blockKey = keys.find((key) => key !== '$') || '';
    id = obj[blockKey]._metadata.uid;
  } else {
    id = obj.uid;
  }
  return id;
}

function getContentType(obj: any) {
  let contentType = '';

  if (isModularBlock(obj)) {
    // Find and return the key that is not '$' and extract it as the content type
    const keys = Object.keys(obj);
    contentType = keys.find((key) => key !== '$' && key !== 'id') || '';
  } else {
    contentType = obj['_content_type_uid'];
  }
  return contentType;
}

const ComponentRenderer = (props: any) => {
  // console.log('componentRendererProps', props);
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
    const ntExperiences = block[getContentType(block)].nt_experiences;
    console.log('lolol', modularBlockExperiences);
    const allVariants = modularBlockExperiences
      ?.map((experience) => {
        const variants = experience.nt_experience_block_sections.nt_variants;
        return variants?.map((variant: any) => {
          return {
            ...variant,
            id: getBlockId(variant),
          };
        });
      })
      .flat();

    console.log('allVariants', JSON.stringify(allVariants, null, 2));

    const experiences = (ntExperiences || [])
      .map((experience: any) => {
        return {
          name: experience.nt_name,
          type: experience.nt_type,
          config: {
            ...experience.nt_config,
            components: experience.nt_config?.components?.map(
              (component: { variants: any[]; baseline: { blockId: any } }) => {
                return {
                  ...component,
                  variants: component.variants?.map((variant) => {
                    return {
                      ...variant,
                      id: variant.blockId,
                    };
                  }),
                  baseline: {
                    ...component.baseline,
                    id: component.baseline.blockId,
                  },
                };
              }
            ),
          },
          audience: {
            id: experience.nt_audience[0].nt_audience_id,
            name: experience.nt_audience[0].nt_name,
          },
          id: experience.uid,
          variants: allVariants, // TODO: Filter variants only for this experience & baseline
        };
      })
      .filter((experience: any) =>
        ExperienceMapper.isExperienceEntry(experience)
      )
      .map((experience: any) => ExperienceMapper.mapExperience(experience));

    console.log('experiences', experiences);

    return (
      // eslint-disable-next-line react/jsx-key
      <Experience
        {...block}
        id={id}
        component={ComponentRenderer}
        experiences={experiences}
      />
    );
  } else {
    const experiences = (block.nt_experiences || [])
      .map((experience: any) => {
        console.log('did ya find any variants?', experience.nt_variants);
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
      .filter((experience: any) =>
        ExperienceMapper.isExperienceEntry(experience)
      )
      .map((experience: any) => ExperienceMapper.mapExperience(experience));
    console.log('?????', JSON.stringify(experiences, null, 2));

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
  }
};

export { BlockRenderer };
