vi.unmock('./random');

import { randomIndex } from './random';

describe('randomIndex', () => {
  it('should return an integer within [0, length)', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomIndex(10);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(10);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it('should use crypto.getRandomValues', () => {
    const spy = vi.spyOn(globalThis.crypto, 'getRandomValues');
    randomIndex(5);
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });

  it('should return 0 when crypto returns 0', () => {
    vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(
      <T extends ArrayBufferView>(array: T): T => {
        if (array instanceof Uint32Array) {
          array[0] = 0;
        }
        return array;
      },
    );

    expect(randomIndex(10)).toBe(0);
    vi.restoreAllMocks();
  });

  it('should wrap large values via modulo', () => {
    vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(
      <T extends ArrayBufferView>(array: T): T => {
        if (array instanceof Uint32Array) {
          array[0] = 13;
        }
        return array;
      },
    );

    expect(randomIndex(5)).toBe(3); // 13 % 5 === 3
    vi.restoreAllMocks();
  });
});
