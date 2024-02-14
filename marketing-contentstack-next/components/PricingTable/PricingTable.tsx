import React from 'react';
import { PricingPlan } from '@/components/PricingPlan';
import type {
  PricingPlan as IPricingPlan,
  NtExperience,
} from '@/types/contentstack';
import { RichText } from '../RichText/RichText';

interface IPricingTable {
  title?: string;
  headline?: any;
  subline?: string;
  pricing_plans?: IPricingPlan[];
  nt_experiences?: NtExperience[];
}

export const PricingTable: React.FC<{ pricing_table: IPricingTable }> = (
  props
) => {
  const { pricing_table } = props;
  return (
    <div className="max-w-7xl mx-auto py-24 px-4 bg-white sm:px-6 lg:px-8">
      <RichText
        className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
        richTextHtml={pricing_table.headline}
      />
      <p className="mt-6 text-xl text-gray-500">{pricing_table.subline}</p>
      {/* Tiers */}
      <div className="mt-24 space-y-12 lg:space-y-0 flex flex-col lg:flex-row lg:gap-x-8">
        {pricing_table.pricing_plans?.map((plan: IPricingPlan, i: number) => {
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
