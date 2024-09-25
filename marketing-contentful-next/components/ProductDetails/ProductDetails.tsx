import { TypeProductDetailWithoutUnresolvableLinksResponse } from '@/types/TypeProductDetail';
import { BlockRenderer } from '../Renderer';

export const ProductDetails = ({
  details,
}: {
  details:
    | (TypeProductDetailWithoutUnresolvableLinksResponse | undefined)[]
    | undefined;
}) => {
  if (!details) {
    return null;
  }
  return (
    <>
      {details.map((detail, i) => {
        if (!detail) {
          return null;
        }
        return (
          <div
            className={i === 0 ? 'mt-10' : 'mt-8 border-t border-gray-200 pt-8'}
            key={detail.sys.id}
          >
            <BlockRenderer block={detail} />
          </div>
        );
      })}
    </>
  );
};
