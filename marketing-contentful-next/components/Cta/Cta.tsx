import React from 'react';
import { Button } from '@/components/Button';
import { RichText } from '@/components/RichText';
import { ICta } from '@/types/contentful';

export const CTA = ({ fields }: ICta) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto my-10 lg:my-20 text-center py-4 lg:py-2 px-4 sm:px-6 lg:px-12">
        <RichText
          className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
          richTextDocument={fields.headline}
        />
        <RichText
          className="mt-6 text-xl text-gray-500"
          richTextDocument={fields.subline}
        />
        <div className="mt-5 mx-auto flex flex-col sm:flex-row lg:w-6/12 sm:w-full items-center justify-center space-y-5 sm:space-y-0 sm:space-x-5">
          {fields.buttons?.map((button) => {
            if (!button.fields.slug) {
              return null;
            }
            return (
              <div key={button.sys.id} className="shadow w-full">
                <Button
                  type="button"
                  size="large"
                  {...button.fields}
                  href={button.fields.slug}
                >
                  {button.fields.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CTA;
