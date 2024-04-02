import has from 'lodash/has';
import { Document, BLOCKS, INLINES } from '@contentful/rich-text-types';
import {
  documentToReactComponents,
  RenderNode,
} from '@contentful/rich-text-react-renderer';
// import { MergeTag } from '@ninetailed/experience.js-next';

import { INtMergetag } from '@/types/contentful';

import React from 'react';

export const isRichText = (x: Document | unknown): x is Document => {
  return ['data', 'content', 'nodeType'].every((prop) => {
    return has(x, prop);
  });
};

export type RenderRichTextOptions = {
  classNames?: {
    ul?: string;
    li?: string;
  };
  renderNode?: RenderNode;
};

function isMergeTag(nodeTarget: unknown): nodeTarget is INtMergetag {
  return (nodeTarget as INtMergetag).sys.contentType.sys.id === 'nt_mergetag';
}

export const renderRichText = (
  rtd: Document,
  options: RenderRichTextOptions = {}
) => {
  return documentToReactComponents(rtd, {
    renderNode: {
      [INLINES.EMBEDDED_ENTRY]: (node) => {
        if (isMergeTag(node.data.target)) {
          return <span>MERGE_TAG</span>; // TODO: Client side this
        }
        return null;
      },
      [BLOCKS.UL_LIST]: (node, children) => {
        return <ul className={options.classNames?.ul}>{children}</ul>;
      },
      [BLOCKS.LIST_ITEM]: (node) => {
        // Removes <p> element inside each <li> element
        const untaggedChildren = documentToReactComponents(node as Document, {
          renderNode: {
            [BLOCKS.PARAGRAPH]: (node, children) => children,
            [BLOCKS.LIST_ITEM]: (node, children) => children,
          },
        });
        return <li>{untaggedChildren}</li>;
      },

      ...(options.renderNode || {}),
    },
  });
};
