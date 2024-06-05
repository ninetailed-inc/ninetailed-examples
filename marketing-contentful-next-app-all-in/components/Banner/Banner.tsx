// Necessary because the banner keeps track of open/closed state
'use client';

import React from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/solid';

import { RichText } from '@/components/RichText';
import { IBanner } from '@/types/contentful';
import classNames from 'classnames';

export type Handler = () => void;

export const Banner = ({ fields }: IBanner) => {
  const [show, setShow] = React.useState<boolean>(true);

  const handleCloseBanner: Handler = () => {
    setShow(!show);
  };

  return (
    <div
      className={classNames(
        show ? 'relative' : 'hidden',
        { 'bg-indigo-600': fields.variant === 'Primary' },
        { 'bg-orange-600': fields.variant === 'Loud' }
      )}
    >
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <div className="font-medium text-white">
            <RichText className="inline" richTextDocument={fields.text} />
            {fields.slug && fields.linkText && (
              <>
                <span className="block sm:ml-2 sm:inline-block">
                  <Link
                    href={fields.slug}
                    className="text-white font-bold underline"
                  >
                    {fields.linkText}
                  </Link>
                </span>
                <span aria-hidden="true"> &rarr;</span>
              </>
            )}
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
          <button
            type="button"
            className="flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon
              className="h-6 w-6 text-white"
              aria-hidden="true"
              onClick={handleCloseBanner}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
