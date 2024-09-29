import { cn } from './cn';

describe('utils/cn.ts', () => {
  it('should return a string', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
  });
});
