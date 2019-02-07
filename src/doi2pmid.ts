import { searchWord2Pmids } from './search-word2pmid';

export async function doi2Pmid(doi: string): Promise<string> {
  doi = doi.trim().toLowerCase();
  doi = doi.replace(/http?s\:\/\/(:?dx\.)?doi\.org\//, '');
  doi = doi.replace(/doi *\: */, '');
  doi = doi.replace(/.*doi *\/ */, '');
  doi = doi.trim();
  //console.log(`doi: ${doi}`);
  if (doi.match(/^10\.\d{4,9}[\-\.\_\;\(\)/:A-Z0-9]+$/i)) {
    const list = await searchWord2Pmids(doi + '[doi]', 1, false, true);
    //console.log(`result: ${list}`);
    if (list.length > 0) return list[0];
  }
  return '';
}
