# ninetailed-examples

Directory:

- `marketing-contentful-next`: It is a statically generated site built on the Next.js Pages router with Ninetailed operating client-side.
- `marketing-contentful-next-app`: A similar demo to `marketing-contentful-next`, but showcases using Ninetailed with the Next.js App router by converting all Ninetailed components to client components using `use client`.
- `marketing-contentful-next-app-all-in`: An 🚧 experimental 🚧 demo using Vercel Edge Middleware and React Server Components to render all Ninetailed Experience content server-side.
- `marketing-contentstack-next`: Ninetailed's flagship demo but with Contentstack as a source CMS.
- `contentful-vue`: A proof-of-concept using Ninetailed's JavaScript SDK to create a Vue Composition API plugin implemetaion of Ninetailed. Includes a `useExperience` composoable and a single file `Experience.vue` component to mimic the developer experience of working with Ninetailed's React SDK `useExperience` hook and `Experience.tsx` component.
- `contentful-nuxt`: A proof-of-concept demonstration of taking the plugin created in `contentful-vue` and using it as a client-side plugin in Nuxt.
