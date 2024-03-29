import React from 'react';
import Link from 'next/link';
import { useNinetailed } from '@ninetailed/experience.js-next';

import { RichText } from '@/components/RichText';
import { Footer as IFooter } from '@/types/contentstack';

export const Footer: React.FC<IFooter> = (props) => {
  const { reset } = useNinetailed();
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mt-16 mx-auto py-12 px-2 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-1 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {props.footer_links?.map((link, i) => {
            return (
              <div key={i} className="px-5 py-2">
                <Link
                  href={link.page_reference?.[0].url || '#'}
                  className="text-base text-gray-300 hover:text-white"
                >
                  {link.title}
                </Link>
              </div>
            );
          })}
          <div className="px-5 py-2">
            <button
              type="button"
              className="text-base text-gray-300 hover:text-white cursor-pointer"
              onClick={reset}
            >
              Reset Personalization
            </button>
          </div>
        </nav>
        <RichText
          className="mt-8 text-center text-base text-gray-300"
          richTextHtml={props.copyright}
        />
      </div>
    </footer>
  );
};
