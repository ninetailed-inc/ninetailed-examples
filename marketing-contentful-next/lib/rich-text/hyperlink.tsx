import React from 'react';

type HyperLinkProps = {
  data: any;
  content: any;
  type: 'AssetLink' | 'PlainLink';
  cb: ({
    data,
    content,
    nodeType,
  }: {
    data: any;
    content: any;
    nodeType: string;
  }) => React.ReactNode;
};

export const Hyperlink = (props: HyperLinkProps) => {
  const href =
    props.type === 'AssetLink'
      ? props.data.target.fields.file.url
      : props.data.uri;
  // Link text has to be rendered itself as rich text
  // to account for various formatting options (e.g. bold text)
  const linkText = props.cb({
    content: props.content,
    data: {},
    nodeType: 'document',
  });
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {linkText}
    </a>
  );
};
