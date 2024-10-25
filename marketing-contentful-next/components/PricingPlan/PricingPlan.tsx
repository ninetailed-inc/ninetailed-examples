import React from 'react';
import { BLOCKS } from '@contentful/rich-text-types';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/Button';
import { RichText } from '@/components/RichText';

import type { TypePricingPlanWithoutUnresolvableLinksResponse } from '@/types/TypePricingPlan';

export const PricingPlan = (
  pricingPlan: TypePricingPlanWithoutUnresolvableLinksResponse
) => {
  const {
    title,
    price,
    frequency,
    discountedPrice,
    description,
    button,
    mostPopular,
  } = pricingPlan.fields;

  return (
    <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
      <div className="mb-5">
        <RichText
          className="text-xl font-semibold text-gray-900"
          richTextDocument={title}
        />
        {mostPopular ? (
          <p className="absolute top-0 py-1.5 px-4 bg-indigo-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2">
            Most popular
          </p>
        ) : null}
        <div className="mt-4 mb-2 flex items-baseline text-gray-900">
          <RichText
            className="text-5xl font-extrabold tracking-tight"
            richTextDocument={price}
          />
          <p className="text-xl font-semibold">{frequency}</p>
          <RichText
            className="line-through text-red-500 ml-1 font-semibold text-2xl"
            richTextDocument={discountedPrice}
          />
        </div>
        <RichText
          richTextDocument={description}
          classNames={{
            ul: 'mt-6 space-y-6',
          }}
          renderNode={{
            [BLOCKS.LIST_ITEM]: (node, children) => {
              return (
                <li className="flex">
                  <CheckIcon
                    className="flex-shrink-0 w-6 h-6 text-indigo-500"
                    aria-hidden="true"
                  />
                  <span className="ml-3 text-gray-500">{children}</span>
                </li>
              );
            },
          }}
        />
      </div>
      {button?.fields.slug && (
        <div className="mt-auto">
          <Button
            type="button"
            size="large"
            {...button.fields}
            href={button.fields.slug}
          >
            {button.fields.buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PricingPlan;
