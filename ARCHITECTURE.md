# Architecture

## Purpose

Public collection of example Contentful and Ninetailed applications for several JavaScript frameworks.

## Main areas

- Each top-level application is an independent example.
- contentful-nuxt and contentful-vue demonstrate Vue ecosystem integrations.
- marketing-contentful-next variants demonstrate Next.js integration patterns.
- Each example owns its local manifest, configuration, and setup instructions.

## Change flow

Repository manifests and checked-in configuration define how source becomes a build, package, report, example, or documentation artifact. Keep changes inside the owning area and follow explicit dependencies rather than copying behavior between components.

## Boundaries

External services, credentials, and deployment environments are not represented by source code alone. Local validation should use documented fixtures or configuration and must not embed secrets.

## Failure and verification

Start with the narrowest affected command, inspect its direct inputs, and expand to repository-level validation. If a required external system is unavailable, record that verification gap instead of claiming success.

