import React from 'react';
import classNames from 'classnames';

export type IconProps = 'some SVG icon props';

export type ButtonType = 'button' | 'submit' | 'reset';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonVariant = 'Primary' | 'Secondary' | 'Loud';

export interface ButtonProps {
  as?: React.ElementType;
  type: ButtonType;
  size: ButtonSize;
  variant: ButtonVariant;
  children: string;
}

export const Button: React.FC<ButtonProps> = React.forwardRef(
  (props: ButtonProps, ref) => {
    const {
      as: Component = 'button',
      type,
      size,
      variant,
      children,
      ...rest
    } = props;

    const colorMap = {
      Primary: 'bg-indigo-600 text-white',
      Secondary: 'bg-indigo-100 text-indigo-700',
      Loud: 'bg-amber-600 text-white',
    };

    return (
      <>
        <Component
          {...rest}
          type={type}
          ref={ref}
          className="block bg-slate-800"
        >
          <div
            className={`${colorMap[variant]} active:translate-x-0 active:translate-y-0 flex items-center border-slate-800 border-2 duration-150 py-3 px-5 -translate-x-1 -translate-y-1 hover:-translate-x-1.5 hover:-translate-y-1.5 w-full`}
          >
            {children}
          </div>
        </Component>
      </>
    );
  }
);
Button.defaultProps = {
  as: 'a',
};

Button.displayName = 'Button';
