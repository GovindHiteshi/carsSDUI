import type { ComponentType } from 'react';
import type { SduiComponentProps } from './types';

/**
 * type -> component. Adding a new node kind to the vocabulary is one call to
 * `register`. A type this binary does not know renders the fallback, which is
 * what lets the server ship new UI without breaking older app versions.
 */
const registry = new Map<string, ComponentType<SduiComponentProps>>();

export function register(
  type: string,
  component: ComponentType<SduiComponentProps>,
) {
  registry.set(type, component);
}

export function resolve(type: string) {
  return registry.get(type);
}

export function registeredTypes() {
  return Array.from(registry.keys()).sort();
}
