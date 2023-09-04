import React from 'react';
import { PricingPlan } from '@/components/PricingPlan';
import { PricingTable as IPricingTable } from '@/types/contentstack';
import { RichText } from '../RichText/RichText';

export const PricingTable: React.FC<IPricingTable> = (props) => {
  return (
    <div className="max-w-7xl mx-auto py-24 px-4 bg-white sm:px-6 lg:px-8">
      <RichText
        className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
        richTextHtml={props.headline}
      />
      <RichText
        className="mt-6 text-xl text-gray-500"
        richTextHtml={props.subline}
      />

      {/* Tiers */}
      <div className="mt-24 space-y-12 lg:space-y-0 flex flex-col lg:flex-row lg:gap-x-8">
        {props.pricing_plans?.map((plan, i) => {
          return (
            <div key={i} className="flex-1">
              <PricingPlan {...plan} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingTable;
