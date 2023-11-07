import { IProductDetail } from '@/types/contentful';
import { BlockRenderer } from '../Renderer';

export const ProductDetails = ({
  details,
}: {
  details: IProductDetail[] | undefined;
}) => {
  if (!details) {
    return null;
  }
  return (
    <>
      {details.map((detail, i) => {
        return (
          <div
            className={i === 0 ? 'mt-10' : 'mt-8 border-t border-gray-200 pt-8'}
          >
            <BlockRenderer block={detail} />
          </div>
        );
      })}
    </>
  );
};
