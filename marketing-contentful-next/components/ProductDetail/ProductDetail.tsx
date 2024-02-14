import { IProductDetail } from '@/types/contentful';
import { RichText } from '../RichText';

export const ProductDetail = ({ fields }: IProductDetail) => {
  return (
    <>
      <h2 className="text-sm font-medium text-gray-900">{fields.heading}</h2>
      <div className="prose prose-sm mt-4 text-gray-500">
        <RichText richTextDocument={fields.body} />
      </div>
    </>
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
