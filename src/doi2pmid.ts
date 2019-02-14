import { searchWord2Pmids } from './search-word2pmid';

export { text2Doi, doi2Pmid };

const text2Doi = (text: string): string => {
  let doi = text.trim().toLowerCase();
  doi = doi.replace(/http?s\:\/\/(:?dx\.)?doi\.org\//, '');
  doi = doi.replace(/doi *\: */, '');
  doi = doi.replace(/.*doi *\/ */, '');
  doi = doi.trim();
  //console.log(`doi: ${doi}`);
  if (doi.match(/^10\.\d{4,9}[\-\.\_\;\(\)/:A-Z0-9]+$/i)) {
    return doi;
  } else {
    return '';
  }
};

const doi2Pmid = async (doi: string): Promise<string> => {
  doi = text2Doi(doi);
  //console.log(`doi: ${doi}`);
  if (doi) {
    const list = await searchWord2Pmids(doi + '[AID]', 1, false, true);
    //console.log(`result: ${list}`);
    if (list.length > 0) return list[0];
  }
  return '';
};
