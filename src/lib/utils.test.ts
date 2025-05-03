import { isMobile } from './utils';

describe('isMobile', () => {
  it('should return true when checking if the current OS is mobile', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
      writable: true,
    });
    expect(isMobile()).toBe(true);
  });
});