/**
 * @type {import('next').NextConfig}
 * */
module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'tailwindui.com',
        },
      ],
    },
    webpack: (config) => {
      return config;
    },
    reactStrictMode: true,
  };
};
