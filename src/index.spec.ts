import { PubmedParser } from './index';
jest.unmock('./index');

const long_format =
  '${index}) ${makeAuthorList()}. ${title}. ${year} ${month};${vol}${ issue ? "("+issue+")" : ""}:${page}${ pmid ? " Cited in PubMed; PMID:"+pmid : ""}.';
const short_format =
  '${abbrej}. ${year}${month ? " "+ month : ""};${vol}${ issue ? "("+issue+")" : ""}:${page}${ pmid ? " pmid:" + pmid : ""}.';
const search_word1 = 'Br. J. Haematol. 1995;89(1):24-33';

describe('pubmed-parser', () => {
  describe('from(pmid:26314775).get', () => {
    it('get(authors6) to be Fizazi K, Greco FA, Pavlidis N, Daugaard G, Oien K, Pentheroudakis G', async () => {
      const parser = await PubmedParser.from('pmid:26314775');
      //console.log(parser.get('authors6'));
      expect(parser.get('authors6')).toBe(
        `Fizazi K, Greco FA, Pavlidis N, Daugaard G, Oien K, Pentheroudakis G`
      );
    });
  });
  describe('tryGetPmid()', () => {
    it('get from https://www.ncbi.nlm.nih.gov/pubmed/15454762 to be 15454762', async () => {
      const pmid = await PubmedParser.tryGetPmid('https://www.ncbi.nlm.nih.gov/pubmed/15454762');
      //console.log('PMID=' + pmid);
      expect(pmid).toBe(`15454762`);
    });
    it('get from https://www.ncbi.nlm.nih.gov/pubmed?otool=ijpnagoulib&term=18342212 to be 18342212', async () => {
      const pmid = await PubmedParser.tryGetPmid(
        'https://www.ncbi.nlm.nih.gov/pubmed?otool=ijpnagoulib&term=18342212'
      );
      //console.log('PMID=' + pmid);
      expect(pmid).toBe(`18342212`);
    });
    it('get from "PMID: 18342212" to be 18342212', async () => {
      const pmid = await PubmedParser.tryGetPmid('PMID: 18342212 ');
      //console.log('PMID=' + pmid);
      expect(pmid).toBe(`18342212`);
    });
    it(`get from '${search_word1}' to be 7530479`, async () => {
      const pmid = await PubmedParser.tryGetPmid(search_word1);
      //console.log('PMID=' + pmid);
      expect(pmid).toBe(`7530479`);
    });
  });
  describe('fromPmid().format() long', () => {
    it('pmid:24749846', async () => {
      const parser = await PubmedParser.fromPmid('24749846');
      const variants = { index: '1' };
      const result = parser.format(long_format, variants);
      //console.log('format:' + result);
      expect(result).toBe(
        `1) Leipzig RM, Sauvigné K, Granville LJ, Harper GM, Kirk LM, Levine SA, Mosqueda L, Parks SM, Fernandez HM, Busby-Whitehead J. What is a geriatrician? American Geriatrics Society and Association of Directors of Geriatric Academic Programs end-of-training entrustable professional activities for geriatric medicine. 2014 May;62(5):924-9 Cited in PubMed; PMID:24749846.`
      );
    });
    describe('fromPmid().format() short', () => {
      it('pmid:24749846', async () => {
        const parser = await PubmedParser.fromPmid('24749846');
        const short_result = parser.format(short_format);
        //console.log('short_format:' + short_result);
        expect(short_result).toBe(`J Am Geriatr Soc. 2014 May;62(5):924-9 pmid:24749846.`);
      });
    });
    describe('fromPmid().format() short', () => {
      it('pmid:24749846 to be J Am Geriatr Soc. 2014 May;62(5):924-9 pmid:24749846.', async () => {
        const parser = await PubmedParser.fromPmid('24749846');
        const short_result = parser.format(short_format);
        //console.log('short_format:' + short_result);
        expect(short_result).toBe(`J Am Geriatr Soc. 2014 May;62(5):924-9 pmid:24749846.`);
      });
    });
  });
  describe('from(searchword).format() short', () => {
    it(`from('${search_word1}') to be Br. J. Haematol. 1995 Jan;89(1):24-33 pmid:7530479.`, async () => {
      const parser = await PubmedParser.from(search_word1);
      const short_result = parser.format(short_format);
      //console.log(`fromsearchword('${search_word1}'):  ${short_result}`);
      expect(short_result).toEqual(`Br. J. Haematol. 1995 Jan;89(1):24-33 pmid:7530479.`);
    });
  });
});
