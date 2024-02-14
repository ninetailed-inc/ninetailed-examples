import { BlockRenderer } from '../Renderer';
import { IProductPolicy } from '@/types/contentful';

export const ProductPolicies = ({
  policies,
}: {
  policies: IProductPolicy[] | undefined;
}) => {
  if (!policies) {
    return null;
  }
  return (
    <>
      <section aria-labelledby="policies-heading" className="mt-10">
        <h2 id="policies-heading" className="sr-only">
          Our Policies
        </h2>

        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {policies?.map((policy) => {
            return <BlockRenderer block={policy} key={policy.sys.id} />;
          })}
        </dl>
      </section>
    </>
  );
};
