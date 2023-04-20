import { ImageLoader } from 'next/image';

export const ContentstackImageLoader: ImageLoader = ({
  src,
  width,
  quality,
}) => {
  return `${src}?width=${width}&quality=${quality || 50}&format=webply`;
};

export function handleErrors<A extends unknown[]>(
  p: (...args: A) => Promise<void>
): (...args: A) => void {
  return (...args: A) => {
    try {
      p(...args).catch((err) =>
        console.log('Error thrown asynchronously', err)
      );
    } catch (err) {
      console.log('Error thrown synchronously', err);
    }
  };
}
