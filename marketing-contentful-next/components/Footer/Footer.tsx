import React from 'react';
import Link from 'next/link';
import { useNinetailed } from '@ninetailed/experience.js-next';

import { RichText } from '@/components/RichText';
import { IFooter } from '@/types/contentful';
import { handleErrors } from '@/lib/helperfunctions';

export const Footer = ({ fields }: IFooter) => {
  const { reset, identify } = useNinetailed();

  // Demo traits functions
  const becomeCasual = handleErrors(async () => {
    reset();
    console.log(`Ninetailed: Simulating Casual User`);
    await identify('', {
      lyticsSegments: ['ly_casual', 'smt_new'],
      score_consistency: 30,
      score_frequency: 80,
      score_intensity: 10,
      score_maturity: 0,
      score_momentum: 10,
      score_propensity: 5,
      score_quantity: 20,
      score_recency: 70,
      score_volatility: 5,
    });
  });

  const becomeEngager = handleErrors(async () => {
    reset();
    console.log(`Ninetailed: Simulating Highly Engaged User`);
    await identify('', {
      lyticsSegments: ['ly_deeply_engaged', 'smt_power'],
      score_consistency: 30,
      score_frequency: 60,
      score_intensity: 85,
      score_maturity: 40,
      score_momentum: 40,
      score_propensity: 80,
      score_quantity: 50,
      score_recency: 50,
      score_volatility: 60,
    });
  });

  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mt-16 mx-auto py-12 px-2 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-1 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          {fields.footerLinks?.map((link) => {
            if (!link.fields.slug) {
              return (
                <div key={link.sys.id} className="px-5 py-2">
                  <a
                    className="text-base text-gray-300 hover:text-white"
                    href="/"
                  >
                    {link.fields.buttonText}
                  </a>
                </div>
              );
            }

            return (
              <div key={link.sys.id} className="px-5 py-2">
                <Link
                  href={link.fields.slug}
                  className="text-base text-gray-300 hover:text-white"
                >
                  {link.fields.buttonText}
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
              DEMO: Start Over
            </button>
          </div>
          {/* Hardcoded Lytics demos */}
          <div className="px-5 py-2">
            <button
              type="button"
              className="text-base text-gray-300 hover:text-white cursor-pointer"
              onClick={becomeCasual}
            >
              DEMO: Casual User
            </button>
          </div>
          <div className="px-5 py-2">
            <button
              type="button"
              className="text-base text-gray-300 hover:text-white cursor-pointer"
              onClick={becomeEngager}
            >
              DEMO: Engaged user
            </button>
          </div>
        </nav>
        <RichText
          className="mt-8 text-center text-base text-gray-300"
          richTextDocument={fields.copyright}
        />
      </div>
    </footer>
  );
};
