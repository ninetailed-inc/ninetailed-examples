import React from 'react';

interface ButtonComponentProps {
  text: string;
}

export const StudioButton: React.FC<ButtonComponentProps> = ({ text }) => {
  return <button>{text}</button>;
};
