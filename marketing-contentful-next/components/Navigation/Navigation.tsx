import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { INavigation } from '@/types/contentful';
import Logo from '@/public/logo.svg';

export const Navigation: React.FC<INavigation> = ({ fields }) => {
  return (
    <header className="bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex justify-between items-center w-full py-6 border-b-2 border-gray-100 ">
          <div className="flex justify-start">
            <Link href="/">
              <a href="/">
                <span className="sr-only">Workflow</span>
                <Image
                  src={Logo as string}
                  width={175}
                  height={57}
                  alt="Logo"
                />
              </a>
            </Link>
          </div>

          <div className="flex justify-start">
            <div className="hidden lg:flex">
              {fields.navigationLinks.map((link) => {
                if (!link.fields.slug) {
                  return (
                    <div key={link.sys.id} className="px-5 py-2">
                      <a
                        className="text-base font-medium text-gray-500 hover:text-gray-900"
                        href="#"
                      >
                        {link.fields.buttonText}
                      </a>
                    </div>
                  );
                }
                return (
                  <div key={link.sys.id} className="px-5 py-2">
                    <Link href={link.fields.slug}>
                      <a
                        className="text-base font-medium text-gray-500 hover:text-gray-900"
                        href={link.fields.slug}
                      >
                        {link.fields.buttonText}
                      </a>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ml-10 space-x-4">
            {/* Buttons here */}
            <a
              href="#"
              className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
            >
              Sign in
            </a>
            <a
              href="#"
              className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Sign up
            </a>
          </div>
        </div>

        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {fields.navigationLinks.map((link) => {
            if (!link.fields.slug) {
              return (
                <div key={link.sys.id} className="px-5 py-2">
                  <a
                    className="text-base font-medium text-gray-500 hover:text-gray-900"
                    href="#"
                  >
                    {link.fields.buttonText}
                  </a>
                </div>
              );
            }
            return (
              <div key={link.sys.id} className="px-5 py-2">
                <Link href={link.fields.slug}>
                  <a
                    className="text-base font-medium text-gray-500 hover:text-gray-900"
                    href={link.fields.slug}
                  >
                    {link.fields.buttonText}
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
