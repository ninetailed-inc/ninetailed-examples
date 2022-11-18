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
      // TODO: Fix TS errors in components/HubspotForm.tsx
      ignoreBuildErrors: true,
    },
  };
};
