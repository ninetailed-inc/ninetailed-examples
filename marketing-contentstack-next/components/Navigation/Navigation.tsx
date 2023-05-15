import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { INavigation } from '@/types/contentful';
import Logo from '@/public/logo.svg';

import classNames from 'classnames';

import { handleErrors } from '@/lib/helperfunctions';
import { useNinetailed } from '@ninetailed/experience.js-next';

export const Navigation: React.FC<INavigation> = (props) => {
  const [loggingIn, setLoggingIn] = React.useState<boolean>(false);
  const [registering, setRegistering] = React.useState<boolean>(false);
  const { track, identify } = useNinetailed();
  const handleLogin = handleErrors(async () => {
    setLoggingIn(true);
    await identify('', { pricingplan: 'lite' });
    setLoggingIn(false);
  });

  const handleRegistration = handleErrors(async () => {
    setRegistering(true);
    await track('registered');
    setRegistering(false);
  });

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
              {props.navigation_items.map((link, i) => {
                if (link.page_reference.length === 0) {
                  return (
                    <div key={i} className="px-5 py-2">
                      <button className="text-base font-medium text-gray-500 hover:text-gray-900">
                        {link.title}
                      </button>
                    </div>
                  );
                }
                return (
                  <div key={i} className="px-5 py-2">
                    <Link href={link.page_reference[0].url}>
                      <a
                        className="text-base font-medium text-gray-500 hover:text-gray-900"
                        href={link.page_reference[0].url}
                      >
                        {link.title}
                      </a>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ml-10 space-x-4">
            {/* Buttons here */}
            <button
              onClick={handleLogin}
              className={classNames(
                'inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75',
                { 'bg-opacity-20': loggingIn }
              )}
              disabled={loggingIn}
            >
              Sign in
            </button>
            <button
              onClick={handleRegistration}
              className={classNames(
                'inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50',
                { 'bg-opacity-20': registering }
              )}
              disabled={registering}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {props.navigation_items.map((link, i) => {
            if (link.page_reference.length === 0) {
              return (
                <div key={i} className="px-5 py-2">
                  <button className="text-base font-medium text-gray-500 hover:text-gray-900">
                    {link.title}
                  </button>
                </div>
              );
            }
            return (
              <div key={i} className="px-5 py-2">
                <Link href={link.page_reference[0].url}>
                  <a
                    className="text-base font-medium text-gray-500 hover:text-gray-900"
                    href={link.page_reference[0].url}
                  >
                    {link.title}
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
