import { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import { ProductDetails } from '../ProductDetails';
import { ProductPolicies } from '../ProductPolicies';
import { flattenConnection, ProductPrice } from '@shopify/hydrogen-react';
import Image from 'next/image';
import { ShopifyImageLoader } from '@/lib/helperfunctions';
import classNames from 'classnames';
import { IPdp } from '@/types/contentful';
import type { Product as IProduct } from '@shopify/hydrogen-react/storefront-api-types';

// TODO: Types
export const Product = ({
  constProduct,
  pdp,
  pimData,
}: {
  constProduct: any;
  pdp: IPdp;
  pimData: Partial<IProduct>; // TODO: Could be improved by codegen on query or constructing specific type
}) => {
  const productImages = flattenConnection(pimData.images);
  const productVariants = flattenConnection(pimData.variants);
  // const [selectedColor, setSelectedColor] = useState(constProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(productVariants[2].title);

  return (
    <div className="bg-white">
      <pre>{JSON.stringify(pimData, null, 2)}</pre>
      <pre>{JSON.stringify(productImages, null, 2)}</pre>
      <pre>{JSON.stringify(productVariants, null, 2)}</pre>
      <div className="pb-16 pt-6">
        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900">
                  {pimData.title}
                </h1>
                <ProductPrice
                  data={pimData}
                  withoutTrailingZeros
                  className="text-xl font-medium text-gray-900"
                />
              </div>
              {/* TODO: Dynamic constProduct ratings? Or keep simple with static? */}
              {/* Reviews */}
              <div className="mt-4">
                <h2 className="sr-only">Reviews</h2>
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">
                    {constProduct.rating}
                    <span className="sr-only"> out of 5 stars</span>
                  </p>
                  <div className="ml-1 flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          constProduct.rating > rating
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
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      See all {constProduct.reviewCount} reviews
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Image gallery */}
            {/* TODO: Use CMS to manage images, rather than PIM? */}
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:auto-rows-min lg:gap-8 relative">
                {productImages.map((image, i) => (
                  <Image
                    key={image.id}
                    loader={ShopifyImageLoader}
                    src={image.url}
                    alt={image.altText || pimData.title || ''}
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

            <div className="mt-8 lg:col-span-5">
              <form>
                {/* Size picker */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-900">Size</h2>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      See sizing chart
                    </button>
                  </div>

                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="mt-2"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a size
                    </RadioGroup.Label>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {productVariants.map((productVariant) => (
                        // TODO: Make generic - this works with only one product option
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
                              'flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1'
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

                <button
                  type="submit"
                  className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
