import { FormEvent, useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import { ProductDetails } from '../ProductDetails';
import { ProductPolicies } from '../ProductPolicies';
import { flattenConnection, ProductPrice } from '@shopify/hydrogen-react';
import Image from 'next/image';
import { handleErrors, ShopifyImageLoader } from '@/lib/helperfunctions';
import classNames from 'classnames';
import { IPdp } from '@/types/contentful';
import type { Product as IProduct } from '@shopify/hydrogen-react/storefront-api-types';
import { useFlag } from '@/lib/experiences';
import { useNinetailed } from '@ninetailed/experience.js-next';

export const Product = ({
  pdp,
  product,
}: {
  pdp: IPdp;
  product: Partial<IProduct>;
}) => {
  const productImages = flattenConnection(product.images);
  const productVariants = flattenConnection(product.variants);
  const [selectedSize, setSelectedSize] = useState(productVariants[0].title);

  const { track } = useNinetailed();

  // Track product add
  const trackAddToCart = handleErrors(
    async (e: FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const line_item = productVariants[0].sku || product.title || '';
      console.log(`Tracking added item: ${line_item}`);
      await track('add_to_cart', {
        line_item,
        quantity: 1,
      });
    }
  );

  // TODO: Store as metafield or CMS content
  const productRating = 4.2;

  // Example of feature flagging
  const expFlag = useFlag('pdpLayout');
  const pdpLayoutStyles = [
    ['lg:col-start-8', 'lg:col-start-1'],
    ['lg:col-start-1', 'lg:col-start-6'],
  ];

  return (
    <div className="bg-white">
      <div className="pb-16 pt-6">
        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className={`lg:col-span-5 ${pdpLayoutStyles[expFlag][0]}`}>
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900">
                  {product.title}
                </h1>
                <ProductPrice
                  data={product}
                  withoutTrailingZeros
                  className="text-xl font-medium text-gray-900"
                />
              </div>
              {/* Reviews */}
              <div className="mt-4">
                <h2 className="sr-only">Reviews</h2>
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    {productRating}
                    <span className="sr-only"> out of 5 stars</span>
                  </p>
                  <div className="ml-1 flex items-center">
                    {[0, 1, 2, 3, 4].map((constRating) => (
                      <StarIcon
                        key={constRating}
                        className={classNames(
                          productRating > constRating
                            ? 'text-yellow-400'
                            : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div
                    aria-hidden="true"
                    className="ml-4 text-sm text-gray-300"
                  >
                    ·
                  </div>
                  <div className="ml-4 flex">
                    {/* <button
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      See all {reviewCount} reviews
                    </button> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Image gallery */}
            {/* TODO: Use CMS to manage images, rather than PIM */}
            <div
              className={`mt-8 lg:col-span-7 ${pdpLayoutStyles[expFlag][1]} lg:row-span-3 lg:row-start-1 lg:mt-0`}
            >
              <h2 className="sr-only">Images</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:auto-rows-min lg:gap-8 relative items-center justify-items-center">
                {productImages.map((image, i) => (
                  <Image
                    key={image.id}
                    loader={ShopifyImageLoader}
                    src={image.url}
                    alt={image.altText || product.title || ''}
                    height={image.height || 500}
                    width={image.width || 500}
                    className={classNames(
                      i === 0
                        ? 'lg:col-span-2 lg:row-span-2 object-cover'
                        : 'hidden lg:block',
                      'rounded-lg'
                    )}
                  />
                ))}
              </div>
            </div>

            <div
              className={`mt-8 lg:col-span-5 ${pdpLayoutStyles[expFlag][0]}`}
            >
              <form>
                {/* Option picker */}
                {product.options &&
                product.options.length >= 0 &&
                product.options[0].name !== 'Title' ? (
                  <div className="mt-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-medium text-gray-900">
                        {product.options[0].name}
                      </h2>
                    </div>

                    <RadioGroup
                      value={selectedSize}
                      onChange={setSelectedSize}
                      className="mt-2"
                    >
                      <RadioGroup.Label className="sr-only">
                        Choose a {product.options[0].name}
                      </RadioGroup.Label>
                      <div className="flex gap-3">
                        {productVariants.map((productVariant) => (
                          <RadioGroup.Option
                            key={productVariant.id}
                            value={productVariant.title}
                            className={({ active, checked }) =>
                              classNames(
                                productVariant.availableForSale
                                  ? 'cursor-pointer focus:outline-none'
                                  : 'cursor-not-allowed opacity-25',
                                active
                                  ? 'ring-2 ring-indigo-500 ring-offset-2'
                                  : '',
                                checked
                                  ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                                  : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                                'flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase flex-1'
                              )
                            }
                            disabled={!productVariant.availableForSale}
                          >
                            <RadioGroup.Label as="span">
                              {productVariant.title}
                            </RadioGroup.Label>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={trackAddToCart}
                >
                  Add to cart
                </button>
              </form>

              {/* Product details */}
              <ProductDetails details={pdp.fields.details} />

              {/* Policies */}
              <ProductPolicies policies={pdp.fields.policies} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
