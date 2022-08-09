import has from 'lodash/has';
import { Document, BLOCKS, INLINES } from '@contentful/rich-text-types';
import {
  documentToReactComponents,
  RenderNode,
} from '@contentful/rich-text-react-renderer';
import { MergeTag } from '@ninetailed/experience.js-next';

import React from 'react';
import { Hyperlink } from './hyperlink';

export const isRichText = (x: Document | unknown): x is Document => {
  return ['data', 'content', 'nodeType'].every((prop) => {
    return has(x, prop);
  });
};

const PlainHyperlink = (props: any) => {
  return <Hyperlink {...props} type="PlainLink" />;
};

const AssetHyperlink = (props: any) => {
  return <Hyperlink {...props} type="AssetLink" />;
};

export type RenderRichTextOptions = {
  classNames?: {
    ul?: string;
    li?: string;
  };
  renderNode?: RenderNode;
};

export const renderRichText = (
  rtd: Document,
  options: RenderRichTextOptions = {}
) => {
  return documentToReactComponents(rtd, {
    renderNode: {
      [INLINES.HYPERLINK]: PlainHyperlink,
      [INLINES.ASSET_HYPERLINK]: AssetHyperlink,
      [INLINES.ENTRY_HYPERLINK]: () => {
        return null;
      }, // Ignore entry hyperlink
      [INLINES.EMBEDDED_ENTRY]: (node) => {
        if (
          node.data.target.sys.contentType.sys.id === 'nt_mergetag' &&
          node.data.target.fields.nt_mergetag_id
        ) {
          return <MergeTag id={node.data.target.fields.nt_mergetag_id} />;
        }

        return null;
      },
      [BLOCKS.UL_LIST]: (node, children) => {
        return <ul className={options.classNames?.ul}>{children}</ul>;
      },
      [BLOCKS.LIST_ITEM]: (node, children) => {
        return <li className={options.classNames?.ul}>{children}</li>;
      },

      ...(options.renderNode || {}),
    },
  });
};
