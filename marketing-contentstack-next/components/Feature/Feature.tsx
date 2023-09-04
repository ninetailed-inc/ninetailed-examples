import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RichText } from '@/components/RichText';
import { Button, ButtonVariant } from '@/components/Button';
import { ContentstackImageLoader } from '@/lib/helperfunctions';

import { Feature as IFeature } from '@/types/contentstack';

export const Feature: React.FC<IFeature> = (props) => {
  return (
    <div className="relative max-w-xl mx-auto lg:max-w-7xl px-4 sm:max-w-3xl sm:px-6 sm:py-6 lg:px-12">
      <div className="relative mt-2 lg:mt-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
        <div
          className={`relative${
            props.image_position !== 'left' ? '' : ' order-last'
          }`}
        >
          <RichText
            className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
            richTextHtml={props.headline}
          />
          <RichText
            className="mt-6 text-xl text-gray-500"
            richTextHtml={props.subline}
          />
          <div className="mt-5 mx-auto flex flex-col sm:flex-row md:mt-8 sm:w-full">
            {props.buttons && props.buttons[0]?.button_link.href && (
              <div>
                <Link passHref href={props.buttons[0].button_link.href}>
                  <Button
                    as="a"
                    type="button"
                    variant={props.buttons[0].button_variant as ButtonVariant}
                    size="large"
                  >
                    {props.buttons[0].button_link.title}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Image section */}
        <div className="mt-10 -mx-4 px-4 relative lg:mt-0" aria-hidden="true">
          <svg
            className="hidden absolute left-1/2 transform -translate-x-1/2 translate-y-16"
            width={784}
            height={404}
            fill="none"
            viewBox="0 0 784 404"
          >
            <defs>
              <pattern
                id="ca9667ae-9f92-4be7-abcb-9e3d727f2941"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={784}
              height={404}
              fill="url(#ca9667ae-9f92-4be7-abcb-9e3d727f2941)"
            />
          </svg>
          {props.image && (
            <Image
              loader={ContentstackImageLoader}
              src={props.image.url}
              width={480}
              height={320}
              className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
              alt=""
            />
          )}
        </div>
      </div>
    </div>
  );
};
