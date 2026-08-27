# Keep examples as independent applications

- Status: Accepted
- Scope: Ninetailed Examples

## Context

Examples target different frameworks and integration styles with dependency requirements that do not necessarily move together.

## Decision

Store examples in one repository while keeping package manifests and runtime setup local to each example.

## Consequences

Do not assume one root install or test command covers the repository; validate only the examples affected by a change.

