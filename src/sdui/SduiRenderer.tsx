import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { resolve } from './registry';
import type { SduiNode } from './types';

/**
 * The whole interpreter: look the node's type up in the registry, hand it the
 * node, let it recurse into its own children. Roughly 40 lines is all a
 * server-driven UI runtime needs to be.
 */
export function SduiRenderer({ node }: { node?: SduiNode | null }) {
  if (!node || typeof node.type !== 'string') {
    return null;
  }

  const Component = resolve(node.type);
  if (!Component) {
    return <SduiFallback type={node.type} />;
  }

  return <Component node={node} />;
}

/** Render a node's children in order. Used by every container component. */
export function SduiChildren({ nodes }: { nodes?: SduiNode[] }) {
  if (!Array.isArray(nodes)) {
    return null;
  }
  return (
    <>
      {nodes.map((child, index) => (
        <SduiRenderer key={child.id ?? `${child.type}-${index}`} node={child} />
      ))}
    </>
  );
}

/**
 * Unknown node types are skipped silently in production — an old binary simply
 * does not draw UI it has never heard of. In dev we make the gap visible.
 */
function SduiFallback({ type }: { type: string }) {
  if (!__DEV__) {
    return null;
  }
  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackText}>Unsupported node: {type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#F97316',
    borderRadius: 8,
    padding: 10,
    margin: 8,
  },
  fallbackText: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '600',
  },
});
