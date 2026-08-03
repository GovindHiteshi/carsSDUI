/**
 * The contract between the server (for now, a local JSON file) and the app.
 *
 * Everything the server is allowed to say must be expressible here. If a screen
 * needs something this file cannot describe, the fix is to add a node type to
 * the registry — never to send raw styles or code down the wire.
 */

/** Behaviour is data: JSON names an action, the app owns the implementation. */
export type SduiAction =
  | { kind: 'navigate'; to: string; params?: Record<string, unknown> }
  | { kind: 'openUrl'; url: string }
  | { kind: 'select'; group: string; value: string }
  | { kind: 'track'; event: string; params?: Record<string, unknown> }
  | { kind: 'noop' };

/**
 * Images are described, not styled. `uri` wins when present; otherwise we draw
 * a tinted placeholder so screens still render offline or before real CDN urls
 * exist. `glyph` is a short emoji/text stand-in for an icon.
 */
export interface SduiMedia {
  uri?: string;
  glyph?: string;
  tint?: string;
}

export interface SduiNode {
  /** Registry key. Unknown types render a fallback instead of crashing. */
  type: string;
  id?: string;
  props?: Record<string, any>;
  action?: SduiAction;
  children?: SduiNode[];
}

export interface SduiScreenSchema extends SduiNode {
  type: 'screen';
  id: string;
  /** Bump when the contract changes shape. Old binaries live a long time. */
  schemaVersion: number;
}

/** Props every registered component receives from the renderer. */
export interface SduiComponentProps {
  node: SduiNode;
}
