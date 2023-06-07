/**
 * @type {import('next').NextConfig}
 * */
module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,
    webpack: (config) => {
      return config;
    },
    reactStrictMode: true,
  };
};
