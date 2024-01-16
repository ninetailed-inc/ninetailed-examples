import React from 'react';
import Link from 'next/link';
import { Button, ButtonVariant } from '@/components/Button';
import { RichText } from '@/components/RichText';
import { Cta as ICta } from '@/types/contentstack';

export const CTA: React.FC<ICta> = (props) => {
  const { cta } = props;
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto my-20 text-center py-4 lg:py-2 px-4 sm:px-6 lg:px-12">
        <RichText
          className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
          richTextHtml={cta.headline}
        />
        <RichText
          className="mt-6 text-xl text-gray-500"
          richTextHtml={cta.subline}
        />
        <div className="mt-5 mx-auto flex flex-col sm:flex-row lg:w-6/12 sm:w-full items-center justify-center space-y-5 sm:space-y-0 sm:space-x-5">
          {cta.buttons?.map((button: any, i: number) => {
            if (!button.button_link.href) {
              return null;
            }
            return (
              <div key={i} className="shadow w-full">
                <Link passHref href={button.button_link.href} legacyBehavior>
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
  );
};

export default CTA;
