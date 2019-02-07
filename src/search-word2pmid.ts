import axios from 'axios';

const BASE_URL =
  'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&sort=relevance&term=%1&retmax=%2';
const cache = new Map<string, string[]>();

export async function searchWord2Pmids(word: string, retmax = 5): Promise<string[]> {
  let key = word + retmax;
  let prev = cache.get(key);
  let result = prev ? prev : new Array<string>();
  if (!word || result.length > 0) return result;
  let searchword = word
    .replace(/([^\d])([12][0-9]{3})([^\d])/, '$1$2[year]$3')
    .replace(/\:/g, ' ')
    .replace(/\;/g, ' ');
  //console.log(`searchword=${searchword}`);
  const url = BASE_URL.replace('%2', retmax.toString()).replace(
    '%1',
    encodeURIComponent(searchword)
  );
  //console.log(`searchurl=${url}`);
  const res = await axios.get(url);
  let data = res.data;
  if (data.esearchresult && data.esearchresult.idlist) {
    result = data.esearchresult.idlist;
    if (result) cache.set(key, result);
    //console.log(`idlist=${result}`);
  }
  return result;
}
