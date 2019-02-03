import { Template } from './template';
jest.unmock('./template');

describe('template', () => {
  describe('template()', () => {
    it('format by dict', async () => {
      const template = new Template();
      const result = template.format('aaa ${test} bbb ${test2}', {
        test: '1234',
        test2: '5678'
      });
      expect(result).toBe('aaa 1234 bbb 5678');
    });
    it('format by func', async () => {
      const template = new Template();
      const result = template.format('aaa ${test} bbb ${test2}', key => {
        if (key === 'test') {
          return '5555';
        } else {
          return '6666';
        }
      });
      expect(result).toBe('aaa 5555 bbb 6666');
    });
    it('formatEval', async () => {
      const template = new Template();
      const result = template.formatEval('aaa ${ test ? "("+test+")" : "" } bbb ${test2}', {
        test: '5555',
        test2: '6666'
      });
      expect(result).toBe('aaa (5555) bbb 6666');
    });
  });
});
