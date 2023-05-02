import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, ButtonVariant } from '@/components/Button';
import { RichText } from '@/components/RichText';
import { ContentstackImageLoader } from '@/lib/helperfunctions';
import { getHeroEntryById, onEntryChange } from '@/lib/api';

export const Hero = (props) => {
  const [heroProps, setHeroProps] = useState(props);
  const { uid } = props;

  // For live preview
  async function updateData(uid: string) {
    const hero = await getHeroEntryById(uid, [], ['headline', 'subline']);
    return {
      hero,
    };
  }

  useEffect(() => {
    onEntryChange(async () => {
      const newData = await updateData(uid);
      setHeroProps(newData.hero);
    });
  }, [uid]);

  return (
    <div className="bg-white pb-8 sm:pb-12 lg:pb-12">
      <div className="pt-8 overflow-hidden sm:pt-12 lg:relative lg:py-48">
        {/* Hero section */}
        <div className="mx-auto max-w-md px-4 sm:max-w-3xl lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
          <div>
            <div className="mt-20">
              <div className="mt-6 sm:max-w-2xl">
                <RichText
                  {...heroProps.$.headline}
                  className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
                  richTextHtml={heroProps.headline}
                />
                <RichText
                  {...heroProps.$.subline}
                  className="mt-6 text-xl text-gray-500"
                  richTextHtml={heroProps.subline}
                />
              </div>
              <div className="mt-5 mx-auto flex flex-col sm:flex-row justify-start md:mt-8 space-y-5 sm:w-full sm:space-x-5 sm:space-y-0">
                {heroProps.buttons?.map((button) => {
                  if (!button.button_link.href) {
                    return null;
                  }

                  return (
                    <div key={button.button_link.href} className="shadow">
                      <Link passHref href={button.button_link.href}>
                        <Button
                          as="a"
                          type="button"
                          variant={button.button_variant as ButtonVariant}
                          size="large"
                        >
                          {button.button_link.title}
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Image section */}
        <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
          <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="hidden sm:block">
              <div className="absolute inset-y-0 left-1/2 w-screen bg-gray-50 rounded-l-3xl lg:left-80 lg:right-0 lg:w-full" />
              <svg
                className="absolute top-8 right-1/2 -mr-3 lg:m-0 lg:left-0"
                width={404}
                height={392}
                fill="none"
                viewBox="0 0 404 392"
              >
                <defs>
                  <pattern
                    id="837c3e70-6c3a-44e6-8854-cc48c737b659"
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
                  width={404}
                  height={392}
                  fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                />
              </svg>
            </div>

            <div className="hidden relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl lg:max-w-none lg:pl-12 md:block">
              {heroProps.image && (
                <Image
                  loader={ContentstackImageLoader}
                  layout="fixed"
                  src={props.image.url}
                  width={865}
                  height={590}
                  className="w-full rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 lg:w-auto lg:max-w-none"
                  alt=""
                  {...heroProps.image.$.url}
                />
              )}
            </div>

            <div className="relative px-4 sm:mx-auto sm:max-w-3xl lg:max-w-none lg:pl-12 md:hidden">
              {heroProps.image && (
                <Image
                  loader={ContentstackImageLoader}
                  src={heroProps.image.url}
                  width={470}
                  height={320}
                  className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                  alt=""
                  {...heroProps.image.$.url}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
