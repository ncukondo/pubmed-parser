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
    it('formatEval error in key', async () => {
      const template = new Template();
      const result = template.formatEval(
        'aaa ${ test ? "("+test+")" : "" } bbb ${test3} ${test2}',
        {
          test: '5555',
          test2: '6666'
        },
        true
      );
      expect(result).toBe(
        "aaa (5555) bbb ${ error:'test3' - 'ReferenceError: test3 is not defined' } 6666"
      );
    });
    it('formatEval error in key length', async () => {
      const template = new Template();
      const result = template.formatEval(
        'aaa ${ test ? "("+test+")" : "test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3" } bbb ${test2}',
        {
          test: '5555',
          test2: '6666'
        },
        true
      );
      expect(result).toBe(
        'aaa ${ error:\' test ? "("+test+")" : "test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3test3" \' - \'Error: Eval error: key length should not exceed 256(length:421)\' } bbb 6666'
      );
    });
  });
});
