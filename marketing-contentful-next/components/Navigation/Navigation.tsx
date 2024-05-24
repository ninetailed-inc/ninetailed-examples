import { Fragment, useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import Image from 'next/image';
import { INavigation } from '@/types/contentful';
import { ContentfulImageLoader } from '@/lib/helperfunctions';
import Logo from '@/public/logo.svg';
import classNames from 'classnames';
import { useNinetailed } from '@ninetailed/experience.js-next';
import { handleErrors } from '@/lib/helperfunctions';
import Link from 'next/link';

export function Navigation({ fields }: INavigation) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const { identify } = useNinetailed();

  // TODO: Change hardcode behaviour?
  // TODO: Hook up to both log in buttons
  const handleLogin = handleErrors(async () => {
    setLoggingIn(true);
    // This is a hard-coded Segment user_id for demo purposes
    // FIXME: This will not work on anything other than the main B2B demo env
    await identify('testLytics001');
    setLoggingIn(false);
  });

  return (
    <header className="bg-white">
      {/* Large screens top menu */}
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            {/* TODO: Pull from site settings */}
            <span className="sr-only">Ninetailed</span>
            {fields.logo?.fields.file.url ? (
              <Image
                loader={ContentfulImageLoader}
                src={`https:${fields.logo?.fields.file.url}`}
                width={57}
                height={57}
                alt="Logo"
              />
            ) : (
              <Image src={Logo as string} width={175} height={57} alt="Logo" />
            )}
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12 lg:flex-wrap">
          {fields.navigationLinks.map((navLink) => {
            if (navLink.fields.links?.length) {
              return (
                <Popover className="relative" key={navLink.fields.name}>
                  <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                    {navLink.fields.name}
                    <ChevronDownIcon
                      className="h-5 w-5 flex-none text-gray-400"
                      aria-hidden="true"
                    />
                  </PopoverButton>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <PopoverPanel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                      <div className="p-4">
                        {navLink.fields.links.map((link) => (
                          <div
                            key={link.fields.name}
                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                          >
                            <div className="flex-auto">
                              <Link
                                href={link.fields.url}
                                className="block font-semibold text-gray-900"
                              >
                                {link.fields.name}
                                <span className="absolute inset-0" />
                              </Link>
                              {link.fields.description && (
                                <p className="mt-1 text-gray-600">
                                  {link.fields.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverPanel>
                  </Transition>
                </Popover>
              );
            } else {
              return (
                <Link
                  key={navLink.fields.name}
                  href={navLink.fields.url}
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  {navLink.fields.name}
                </Link>
              );
            }
          })}
        </PopoverGroup>

        {/* Static log in button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={handleLogin}
            className={classNames(
              'text-sm font-semibold leading-6 text-gray-900',
              { 'opacity-20': loggingIn }
            )}
            disabled={loggingIn}
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>

      {/* Pop out mobile menu */}
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Ninetailed</span>
              {fields.logo?.fields.file.url ? (
                <Image
                  loader={ContentfulImageLoader}
                  src={`https:${fields.logo?.fields.file.url}`}
                  width={57}
                  height={57}
                  alt="Logo"
                />
              ) : (
                <Image
                  src={Logo as string}
                  width={175}
                  height={57}
                  alt="Logo"
                />
              )}
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {fields.navigationLinks.map((navLink) => {
                  if (navLink.fields.links?.length) {
                    return (
                      <Disclosure
                        as="div"
                        className="-mx-3"
                        key={navLink.fields.name}
                      >
                        {({ open }) => (
                          <>
                            <DisclosureButton className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                              {navLink.fields.name}
                              <ChevronDownIcon
                                className={classNames(
                                  open ? 'rotate-180' : '',
                                  'h-5 w-5 flex-none'
                                )}
                                aria-hidden="true"
                              />
                            </DisclosureButton>
                            <DisclosurePanel className="mt-2 space-y-2">
                              {navLink.fields.links &&
                                navLink.fields.links.map((link) => (
                                  <DisclosureButton
                                    key={link.fields.name}
                                    as="a"
                                    href={link.fields.url}
                                    className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                  >
                                    {link.fields.name}
                                  </DisclosureButton>
                                ))}
                            </DisclosurePanel>
                          </>
                        )}
                      </Disclosure>
                    );
                  } else {
                    return (
                      <Link
                        key={navLink.fields.name}
                        href={navLink.fields.url}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {navLink.fields.name}
                      </Link>
                    );
                  }
                })}
                {/* Static login */}
                <button
                  onClick={handleLogin}
                  className={classNames(
                    '-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50',
                    { 'opacity-20': loggingIn }
                  )}
                  disabled={loggingIn}
                >
                  Log in
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
