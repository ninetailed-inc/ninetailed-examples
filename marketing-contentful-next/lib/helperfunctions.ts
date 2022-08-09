import { ImageLoader } from 'next/image';

export const ContentfulImageLoader: ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 25}`;
};
