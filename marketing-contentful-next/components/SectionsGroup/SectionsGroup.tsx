import React from 'react';
import { BlockRenderer } from '../Renderer/BlockRenderer';
import type { TypeSectionsGroupWithoutUnresolvableLinksResponse } from '@/types/TypeSectionsGroup';

export const SectionsGroup = ({
  sys,
  fields,
}: TypeSectionsGroupWithoutUnresolvableLinksResponse) => {
  return (
    <BlockRenderer
      key={`sectionsGroup-${sys.id}`}
      block={fields?.sections || []}
    />
  );
};

export default SectionsGroup;
