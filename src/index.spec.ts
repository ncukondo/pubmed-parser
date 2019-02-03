import { PubmedParser } from './index';
jest.unmock('./index');

describe('pubmed-parser', () => {
  describe('fromPmid()', () => {
    it('pmid:26314775', async () => {
      const parser = await PubmedParser.fromPmid('26314775');
      expect(parser.get('authors6')).toBeDefined();
    });
  });
  describe('fromPmid().format()', () => {
    it('pmid:26314775', async () => {
      const parser = await PubmedParser.fromPmid('26314775');
      const long_format =
        '${makeAuthorList()}. ${title}. ${year} ${month};${vol}${ issue ? "("+issue+")" : ""}:${page}${ pmid ? " Cited in PubMed; PMID:"+pmid : ""}.';
      const short_format =
        '${abbrej}. ${year}${month ? " "+ month : ""};${vol}${ issue ? "("+issue+")" : ""}:${page}${ pmid ? " pmid:" + pmid : ""}.';
      const result = parser.format(long_format);
      const short_result = parser.format(short_format);
      console.log('format:' + result);
      console.log('short_format:' + short_result);
      expect(parser.format(result)).toBeDefined();
    });
  });
});
