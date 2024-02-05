import React from 'react';

export type ButtonType = 'button' | 'submit' | 'reset';

export type ButtonSize = 'small' | 'large';

export type ButtonVariant = 'Primary' | 'Secondary' | 'Loud';

export interface ButtonProps {
  children: string;
  type: ButtonType;
  variant: ButtonVariant;
  as?: React.ElementType;
  disabled?: boolean;
  onClick?: () => void;
  size?: ButtonSize;
}

const colorMap = {
  Primary: 'bg-indigo-600 text-white',
  Secondary: 'bg-indigo-100 text-indigo-700',
  Loud: 'bg-amber-600 text-white',
};

const sizeMap = {
  small: 'py-2 px-3',
  large: 'py-3 px-6',
};

export const Button: React.FC<ButtonProps> = React.forwardRef(
  (props: ButtonProps, ref) => {
    const {
      as: Component = 'button',
      size: size = 'large',
      type,
      variant,
      children,
      disabled,
      ...rest
    } = props;

    return (
      <>
        <Component
          {...rest}
          type={type}
          ref={ref}
          className="block bg-gray-900 disabled:opacity-80"
          disabled={disabled}
        >
          <div
            className={`${colorMap[variant]} ${sizeMap[size]} flex justify-center border-gray-900 border-2 duration-150 -translate-x-1 -translate-y-1 active:translate-x-0 active:translate-y-0 hover:-translate-x-1.5 hover:-translate-y-1.5`}
          >
            {children}
          </div>
        </Component>
      </>
    );
  }
);
