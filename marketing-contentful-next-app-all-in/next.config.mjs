// @ts-check

function defineNextConfig() {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.ctfassets.net',
        },
      ],
    },
  };
  return nextConfig;
}

export default defineNextConfig;
