/// <reference types="astro/client" />

// The template currently ships this loader as JavaScript without declarations.
// @ts-expect-error The loader module is intentionally consumed at runtime.
import { collections } from 'wima-docs-website-template/loaders'

export { collections }
