import React from 'react';

import { handleErrors } from '@/lib/helperfunctions';
import { IButtonFields } from '@/types/contentful';
import { useNinetailed } from '@ninetailed/experience.js-next';
import Link from 'next/link';

export type ButtonType = 'button' | 'submit' | 'reset';

export type ButtonSize = 'small' | 'large';

export type ButtonVariant = IButtonFields['variant'];

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
  eventName?: IButtonFields['eventName'];
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
      eventName,
      disabled,
      href,
      variant,
      type,
    } = props;

    const { track } = useNinetailed();

    const trackButtonClick = handleErrors(async (e: Event) => {
      if (eventName) {
        if (type === 'submit') {
          e.preventDefault();
        }
        await track(eventName);
        console.log(`Performed Ninetailed event track:${eventName}`);
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
