import React from 'react';

import { handleErrors } from '@/lib/helperfunctions';
import { useNinetailed } from '@ninetailed/experience.js-next';
import Link from 'next/link';

import type { TypeButtonWithoutUnresolvableLinksResponse } from '@/types/TypeButton';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonSize = 'small' | 'large';
export type ButtonVariant =
  TypeButtonWithoutUnresolvableLinksResponse['fields']['variant'];

const variantMap = {
  primary: 'bg-indigo-600 text-white',
  secondary: 'bg-indigo-100 text-indigo-700',
  loud: 'bg-amber-600 text-white',
};

const sizeMap = {
  small: 'py-2 px-3',
  large: 'py-3 px-6',
};

export interface ButtonProps {
  as?: React.ElementType | typeof Link;
  children: string;
  disabled?: boolean;
  eventType?: TypeButtonWithoutUnresolvableLinksResponse['fields']['eventType'];
  eventName?: TypeButtonWithoutUnresolvableLinksResponse['fields']['eventName'];
  eventPayload?: TypeButtonWithoutUnresolvableLinksResponse['fields']['eventPayload'];
  href?: string;
  size: ButtonSize;
  type: ButtonType;
  variant: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = React.forwardRef(
  (props: ButtonProps, ref) => {
    const {
      as: Component = 'button',
      size: size = 'large',
      children,
      eventType,
      eventName,
      eventPayload,
      disabled,
      href,
      variant,
      type,
    } = props;

    const { track, identify } = useNinetailed();

    const trackButtonClick = handleErrors(async (e: Event) => {
      if (eventType) {
        if (type === 'submit') {
          e.preventDefault();
        }
        switch (eventType) {
          case 'track':
            if (eventName) {
              await track(
                eventName,
                (eventPayload as Record<
                  PropertyKey,
                  string | number | (string | number)[]
                >) ?? {}
              );
              console.log(
                `Sent Ninetailed track event with event name ${eventName} and properties:`,
                `${JSON.stringify(eventPayload, null, 2)}`
              );
            } else {
              console.log('No event name provided, skipped track call');
            }
            break;
          case 'identify':
            await identify(
              eventName ?? '',
              (eventPayload as Record<
                PropertyKey,
                string | number | (string | number)[]
              >) ?? {}
            );
            console.log(
              `Sent Ninetailed identify event with ${
                eventName ? `userId ${eventName}` : 'no userId'
              } and traits:`,
              `${JSON.stringify(eventPayload, null, 2)}`
            );
            break;
        }
      } else {
        console.log('Button without event clicked');
      }
    });

    return (
      <>
        <Component
          href={href}
          type={type}
          ref={ref}
          className="block bg-gray-900 disabled:opacity-80"
          disabled={disabled}
          onClick={trackButtonClick}
        >
          <div
            className={`${variantMap[variant]} ${sizeMap[size]} flex justify-center border-gray-900 border-2 duration-150 -translate-x-1 -translate-y-1 active:translate-x-0 active:translate-y-0 hover:-translate-x-1.5 hover:-translate-y-1.5`}
          >
            {children}
          </div>
        </Component>
      </>
    );
  }
);

Button.defaultProps = {
  as: Link,
};

Button.displayName = 'Button';
