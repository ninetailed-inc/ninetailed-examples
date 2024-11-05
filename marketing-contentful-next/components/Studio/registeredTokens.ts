import { defineDesignTokens } from '@contentful/experiences-sdk-react';

// register design tokens
defineDesignTokens({
  spacing: { XS: '4px', S: '16px', M: '32px', L: '64px', XL: '128px' },
  sizing: { XS: '16px', S: '100px', M: '300px', L: '600px', XL: '1024px' },
  color: {
    Indigo: '#4f46e5',
    Secondary: '#e0e7ff',
    Amber: '#ea580c',
    White: '#ffffff',
    Text: '#111827',
  },
  fontSize: { XS: '12px', SM: '14px', MD: '16px', LG: '24px', XL: '32px' },
  lineHeight: { XS: '1', SM: '1.25', MD: '1.5', LG: '200%' },
  letterSpacing: {
    None: '0',
    XS: '0.05em',
    SM: '0.1em',
    MD: '0.15em',
    LG: '0.2em',
  },
  textColor: { Dark: '#111827', White: '#ffffff', Indigo: '#4f46e5' },
});
