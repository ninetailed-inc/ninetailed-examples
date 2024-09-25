import has from 'lodash/has';
import { Document, BLOCKS, INLINES } from '@contentful/rich-text-types';
import {
  documentToReactComponents,
  RenderNode,
} from '@contentful/rich-text-react-renderer';
import { MergeTag } from '@ninetailed/experience.js-next';

import React from 'react';
import { TypeNt_mergetagWithoutUnresolvableLinksResponse } from '@/types/TypeNt_mergetag';

export const isRichText = (x: unknown): x is Document => {
  return ['data', 'content', 'nodeType'].every((prop) => {
    return has(x, prop);
  });
};

export type RenderRichTextOptions = {
  classNames?: {
    ul?: string;
    li?: string;
    h2?: string;
  };
  renderNode?: RenderNode;
};

function isMergeTag(
  nodeTarget: unknown
): nodeTarget is TypeNt_mergetagWithoutUnresolvableLinksResponse {
  return (
    (nodeTarget as TypeNt_mergetagWithoutUnresolvableLinksResponse).sys
      .contentType.sys.id === 'nt_mergetag'
  );
}

export const renderRichText = (
  rtd: Document,
  options: RenderRichTextOptions = {}
) => {
  return documentToReactComponents(rtd, {
    renderNode: {
      [INLINES.EMBEDDED_ENTRY]: (node) => {
        if (isMergeTag(node.data.target)) {
          return (
            <MergeTag
              id={node.data.target.fields.nt_mergetag_id}
              fallback={node.data.target.fields.nt_fallback}
            />
          );
        }
        return null;
      },
      [BLOCKS.HEADING_2]: (node, children) => {
        return (
          // FIXME: Why does className get cleared on the top level?
          <div>
            <h2 className={options.classNames?.h2}>{children}</h2>
          </div>
        );
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
