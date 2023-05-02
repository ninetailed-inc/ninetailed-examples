import parse, { domToReact } from 'html-react-parser';

import { CheckIcon } from '@heroicons/react/solid';

export const RichText = ({ richTextHtml, className, ...rest }) => {
  const options = {
    replace: (domNode) => {
      if (domNode.name) {
        const NodeTag = `${domNode.name}`;
        if (NodeTag === 'li') {
          return (
            <li className="flex">
              <CheckIcon
                className="flex-shrink-0 w-6 h-6 text-indigo-500"
                aria-hidden="true"
              />
              <span className="ml-3 text-gray-500">
                {domToReact(domNode.children, options)}
              </span>
            </li>
          );
        }
        return (
          <NodeTag className={className} {...rest}>
            {domToReact(domNode.children, options)}
          </NodeTag>
        );
      }
    },
  };

  return parse(richTextHtml, options);
};
