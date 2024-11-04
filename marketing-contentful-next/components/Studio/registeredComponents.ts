// src/registeredComponents.ts

import { defineComponents } from '@contentful/experiences-sdk-react';
import { StudioButton } from './StudioButton';

defineComponents([
  {
    component: StudioButton,
    definition: {
      id: 'button',
      name: 'Button',
      category: 'Custom Components',
      variables: {
        text: {
          displayName: 'Text',
          type: 'Text',
          defaultValue: 'Click me!',
        },
      },
    },
  },
]);
