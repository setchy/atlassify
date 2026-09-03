import { cn } from 'cn';

describe('cn', () => {
  it('should return a string', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
  });
});
