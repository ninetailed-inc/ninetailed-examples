import React from 'react';
import Link from 'next/link';
import { Button, ButtonVariant } from '@/components/Button';
import { RichText } from '@/components/RichText';
import { PricingPlan as IPricingPlan } from '@/types/contentstack';

export const PricingPlan = (props: IPricingPlan) => {
  const {
    display_title,
    price,
    frequency,
    discounted_price,
    description,
    button,
    most_popular,
  } = props;

  return (
    <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
      <div className="mb-5">
        <RichText
          className="text-xl font-semibold text-gray-900"
          richTextHtml={display_title}
        />
        {most_popular ? (
          <p className="absolute top-0 py-1.5 px-4 bg-indigo-500 rounded-full text-xs font-semibold uppercase tracking-wide text-white transform -translate-y-1/2">
            Most popular
          </p>
        ) : null}
        <div className="mt-4 mb-2 flex items-baseline text-gray-900">
          <RichText
            className="text-5xl font-extrabold tracking-tight"
            richTextHtml={price}
          />
          <p className="text-xl font-semibold">{frequency}</p>
          <RichText
            className="line-through text-red-500 ml-1 font-semibold text-2xl"
            richTextHtml={discounted_price}
          />
        </div>
        <RichText richTextHtml={description} />
      </div>
      {button?.button_link.href && (
        <div className="mt-auto">
          <Link passHref href={button.button_link.href}>
            <Button
              as="a"
              type="button"
              variant={button.button_variant as ButtonVariant}
              size="large"
            >
              {button.button_link.title}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PricingPlan;
