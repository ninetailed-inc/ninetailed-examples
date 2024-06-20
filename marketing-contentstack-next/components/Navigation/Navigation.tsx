import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Navigation as INavigation } from '@/types/contentstack';
import Logo from '@/public/logo.svg';

import { handleErrors } from '@/lib/helperfunctions';
import { useNinetailed } from '@ninetailed/experience.js-next';
import { Button } from '@/components/Button';

export const Navigation: React.FC<INavigation> = (props) => {
  const [loggingIn, setLoggingIn] = React.useState<boolean>(false);
  const [registering, setRegistering] = React.useState<boolean>(false);
  const { track, identify } = useNinetailed();
  const handleLogin = handleErrors(async () => {
    setLoggingIn(true);
    // This is a hard-coded set of Segment audiences and computed traits for demonstration purposes
    await identify('', {
      pricingplan: 'growth',
      last_email_opened_subject_line: 'HR Made Easy',
      list_of_blog_topics_read: [
        'Benefits',
        'Compensation',
        'Management Skills',
      ],
      most_frequent_product_feature_viewed: 'Edits & Approvals',
      purchased_product_features: ['Edits & Approvals', 'Process Management'],
      thought_leadership_engagers: true,
    });
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
              <span className="sr-only">Workflow</span>
              <Image src={Logo as string} width={175} height={57} alt="Logo" />
            </Link>
          </div>

          <div className="flex justify-start">
            <div className="hidden lg:flex">
              {props.navigation_items?.map((link, i) => {
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
                    <Link
                      href={link.page_reference[0].url || '#'}
                      className="text-base font-medium text-gray-500 hover:text-gray-900"
                    >
                      {link.title}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ml-10 space-x-4 flex">
            {/* Buttons here */}
            <Button
              onClick={handleLogin}
              disabled={loggingIn}
              type="button"
              variant="Primary"
              size="small"
            >
              Sign in
            </Button>
            <Button
              onClick={handleRegistration}
              disabled={registering}
              type="button"
              variant="Secondary"
              size="small"
            >
              Sign up
            </Button>
          </div>
        </div>

        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {props.navigation_items?.map((link, i) => {
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
                <Link
                  href={link.page_reference[0].url || '#'}
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  {link.title}
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
