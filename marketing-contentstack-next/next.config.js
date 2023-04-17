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
    typescript: {
      //TODO: TEMPORARY! DEV ONLY!
      ignoreBuildErrors: true,
    },
    eslint: {
      // TODO: TMEPORARY! DEV ONLY!
      ignoreDuringBuilds: true,
    },
  };
};
