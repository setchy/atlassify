/**
 * Returns a cryptographically random integer in [0, length).
 * Uses crypto.getRandomValues instead of Math.random to satisfy
 * secure-coding requirements.
 */
export function randomIndex(length: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % length;
}
