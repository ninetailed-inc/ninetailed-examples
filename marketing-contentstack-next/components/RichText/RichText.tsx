import parse, { domToReact } from 'html-react-parser';
import { MergeTag } from '@ninetailed/experience.js-next';
import { CheckIcon } from '@heroicons/react/solid';

export const RichText = ({
  richTextHtml,
  className,
  ...rest
}: {
  richTextHtml: string;
  className?: string;
}) => {
  const options = {
    replace: (domNode: any) => {
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
        if (NodeTag === 'mergetag') {
          return <MergeTag id={domNode.children[0].data} />;
        }
        return (
          // eslint-disable-next-line
          // @ts-ignore
          <NodeTag className={className} {...rest}>
            {domToReact(domNode.children, options)}
          </NodeTag>
        );
      }
    },
  };

  return parse(richTextHtml, options) as JSX.Element;
};
