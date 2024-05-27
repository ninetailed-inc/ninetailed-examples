import React from 'react';
import classNames from 'classnames';
import { handleErrors } from '@/lib/helperfunctions';
import { IButtonFields } from '@/types/contentful';
import { useNinetailed } from '@ninetailed/experience.js-next';

export type ButtonType = 'button' | 'submit' | 'reset';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonVariant = IButtonFields['variant'];

export interface ButtonProps {
  as?: React.ElementType;
  type: ButtonType;
  size: ButtonSize;
  variant: ButtonVariant;
  eventName?: IButtonFields['eventName'];
  href?: string;
  children: string;
}

export const Button: React.FC<ButtonProps> = React.forwardRef(
  (props: ButtonProps, ref) => {
    const {
      as: Component = 'button',
      type,
      size,
      variant,
      eventName,
      children,
      href,
    } = props;

    const { track } = useNinetailed();

    const trackButtonClick = handleErrors(async (e: Event) => {
      if (eventName) {
        if (type === 'submit') {
          e.preventDefault();
        }
        await track(eventName);
      } else {
        console.log('Button without event clicked');
      }
    });

    return (
      <Component
        href={href}
        type={type}
        ref={ref}
        onClick={trackButtonClick}
        className={classNames(
          `w-full 
            flex  
            border border-transparent
            items-center justify-center`,
          {
            'text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded shadow-sm':
              variant === 'primary',
          },
          {
            'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 font-medium rounded shadow-sm':
              variant === 'secondary',
          },
          {
            'text-white bg-amber-600 hover:bg-amber-700 font-medium rounded shadow-sm':
              variant === 'loud',
          },
          { 'px-3 py-1 text-sm': size === 'small' },
          { 'px-4 py-2 text-base': size === 'medium' },
          { 'px-6 py-3 text-base': size === 'large' }
        )}
      >
        {children}
      </Component>
    );
  }
);
Button.defaultProps = {
  as: 'a',
};

Button.displayName = 'Button';
