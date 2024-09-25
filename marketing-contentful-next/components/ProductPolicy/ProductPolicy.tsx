import { RichText } from '../RichText';

import {
  CurrencyDollarIcon,
  GlobeAmericasIcon,
} from '@heroicons/react/24/outline';

import type { TypeProductPolicyWithoutUnresolvableLinksResponse } from '@/types/TypeProductPolicy';

const policyIcons = {
  Shipping: GlobeAmericasIcon,
  Loyalty: CurrencyDollarIcon,
};

export const ProductPolicy = (
  productPolicy: TypeProductPolicyWithoutUnresolvableLinksResponse
) => {
  const { fields } = productPolicy;
  const IconElement = policyIcons[fields.policyType];
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
      <dt>
        <IconElement
          className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
        <span className="mt-4 text-sm font-medium text-gray-900">
          {fields.heading}
        </span>
      </dt>
      <dd className="mt-1 text-sm text-gray-500">
        <RichText richTextDocument={fields.description} />
      </dd>
    </div>
  );
};

{
  /* Product details */
}
// <div className="mt-10">

//   <RichText
//     className="prose prose-sm mt-4 text-gray-500"
//     richTextDocument={pdp.fields.description?.fields.copy}
//   />
// </div>

// <div className="mt-8 border-t border-gray-200 pt-8">
//   <h2 className="text-sm font-medium text-gray-900">
//     Fabric &amp; Care
//   </h2>

//   <div className="prose prose-sm mt-4 text-gray-500">
//     <ul role="list">
//       {product.details.map((item) => (
//         <li key={item}>{item}</li>
//       ))}
//     </ul>
//   </div>
// </div>
