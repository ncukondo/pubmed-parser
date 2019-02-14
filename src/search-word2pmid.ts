import axios, { AxiosPromise } from 'axios';

const BASE_URL =
  'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&sort=relevance&term=%1&retmax=%2';
const cache = new Map<string, SearchUrl2Pmids>();

class SearchUrl2Pmids {
  private _url = '';
  private _request: AxiosPromise | null = null;
  private _list = new Array<string>();

  private constructor(url: string) {
    this._url = url;
  }

  static create(url: string): SearchUrl2Pmids {
    const key = url;
    //console.log(`search-key=${key}`);
    let result = cache.get(key);
    if (!result) {
      result = new SearchUrl2Pmids(url);
      cache.set(key, result);
      //console.log(`searchurl=${url}`);
    }
    return result;
  }

  async doGet(): Promise<string[]> {
    if (this._list.length > 0) return this._list;
    if (!this._request) {
      this._request = axios.get(this._url);
    }
    try {
      let res = await this._request;
      this._request = null;
      let data = res.status == 200 ? res.data : null;
      if (data && data.esearchresult && data.esearchresult.idlist) {
        const result = data.esearchresult.idlist;
        this._list = result.length > 0 ? result : this._list;
        //console.log(`idlist=${result}`);
      }
    } catch (e) {
      this._request = null;
      throw e;
    }
    return this._list;
  }
}

const makeurl = (word: string, retmax: number, appendautotag: boolean, escape: boolean): string => {
  if (!word) return '';
  let searchword = word;
  if (appendautotag) {
    searchword = searchword.replace(/([^\d])([12][0-9]{3})([^\d])/, '$1$2[DP]$3');
  }
  searchword = searchword.replace(/\:/g, ' ').replace(/\;/g, ' ');
  //console.log(`searchword=${searchword}`);
  let url = BASE_URL.replace('%2', retmax.toString());
  if (escape) {
    url = url.replace('%1', encodeURIComponent(searchword));
  }
  return url;
};

export const searchWord2Pmids = async (
  word: string,
  retmax = 5,
  appendautotag = true,
  escape = true
): Promise<string[]> => {
  const url = makeurl(word, retmax, appendautotag, escape);
  if (!url) return new Array<string>();
  const worker = SearchUrl2Pmids.create(url);
  return await worker.doGet();
};
