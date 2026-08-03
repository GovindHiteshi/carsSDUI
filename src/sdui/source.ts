import screens from './schemas/screens.json';
import type { SduiScreenSchema } from './types';

/** The schema shape this binary understands. Payloads above this are rejected. */
export const SUPPORTED_SCHEMA_VERSION = 1;

/**
 * The single seam between the app and the server.
 *
 * Today it reads a bundled JSON file; switching to a live API is the one
 * commented line below and nothing else. It is deliberately async already, so
 * the loading and error paths are exercised from day one rather than being
 * bolted on at cutover.
 */
export async function fetchScreen(id: string): Promise<SduiScreenSchema> {
  // const res = await fetch(`${BASE_URL}/ui/screens/${id}`);
  // const payload = await res.json();
  const payload = (screens as Record<string, unknown>)[id];

  if (!payload) {
    throw new Error(`No UI payload for screen "${id}"`);
  }
  return validateScreen(payload);
}

/**
 * Nothing across the wire is trusted. TypeScript stops at the boundary, so the
 * shape gets checked at runtime — a malformed payload should surface as a
 * handled error state, not a render crash.
 */
export function validateScreen(payload: unknown): SduiScreenSchema {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('UI payload is not an object');
  }
  const node = payload as Partial<SduiScreenSchema>;

  if (node.type !== 'screen') {
    throw new Error(`Expected root node "screen", got "${String(node.type)}"`);
  }
  if (typeof node.id !== 'string') {
    throw new Error('UI payload is missing an id');
  }
  if (typeof node.schemaVersion !== 'number') {
    throw new Error('UI payload is missing schemaVersion');
  }
  if (node.schemaVersion > SUPPORTED_SCHEMA_VERSION) {
    throw new Error(
      `Payload schemaVersion ${node.schemaVersion} is newer than this app supports (${SUPPORTED_SCHEMA_VERSION})`,
    );
  }
  return node as SduiScreenSchema;
}
