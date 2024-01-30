import React from 'react';
import { ISectionsGroup } from '@/types/contentful';
import { BlockRenderer } from '../Renderer/BlockRenderer';

export const SectionsGroup = ({ sys, fields }: ISectionsGroup) => {
  return (
    <BlockRenderer
      key={`sectionsGroup-${sys.id}`}
      block={fields?.sections || []}
    />
  );
};

export default SectionsGroup;
