import { searchWord2Pmids } from './search-word2pmid';
jest.unmock('./search-word2pmid');

const search_word1 = 'Br. J. Haematol. 1995;89(1):24-33';
const search_word2 = 'Br. J. Haematol. 1995';

describe('search-word2Pmids', () => {
  describe('searchWord2Pmids()', () => {
    it(`searchWord2Pmids('${search_word1}') to equal ['7530479']`, async () => {
      const idlist = await searchWord2Pmids(search_word1);
      //console.log(idlist);
      expect(idlist).toEqual(['7530479']);
    });
    it(`searchWord2Pmids('${search_word2}', retmax=7).length == 7`, async () => {
      const idlist = await searchWord2Pmids(search_word2, 7);
      //console.log(idlist);
      expect(idlist.length).toBe(7);
    });
  });
});
