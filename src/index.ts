import axios from 'axios';
import { RefEntry } from './ref-entry';
import { Template } from './template';
import { searchWord2Pmids } from './search-word2pmid';

const baseURL =
  'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=%s&retmode=xml';

const cache = new Map<string, PubmedParser>();

class PmidError implements Error {
  public name = 'PmidError';

  constructor(public message: string) {}

  toString() {
    return `${this.name}: ${this.message}`;
  }
}

export class PubmedParser {
  private _refEntry?: RefEntry;
  private _template: Template;

  private constructor() {
    this._template = new Template();
  }

  static tryFormatPmid(text: string): string {
    text = text.trim().toLowerCase();
    const reg_pmid1 = /^[0-9]+$/;
    const reg_pmid2 = /^pmid ?\: ?([0-9]+)$/;
    let result = reg_pmid1.exec(text);
    if (result) return result[0];
    result = reg_pmid2.exec(text);
    if (result) return result[1];
    return '';
  }

  static async tryGetPmid(text: string): Promise<string> {
    let result = PubmedParser.tryFormatPmid(text);
    if (result) return result;
    result = PubmedParser.tryGetPmidFromPubmedUrl(text);
    if (result) return result;
    const idlist = await searchWord2Pmids(text, 5);
    //console.log(`idlist = ${idlist}`);
    if (idlist.length > 0) return idlist[0];
    //console.log(`cannot find = ${text}`);
    return '';
  }

  static async from(text: string): Promise<PubmedParser> {
    const pmid = await PubmedParser.tryGetPmid(text);
    if (!pmid) throw new PmidError('Cannot get PMID');
    return PubmedParser.fromPmid(pmid);
  }

  static tryGetPmidFromPubmedUrl(url: string): string {
    url = url.trim().toLowerCase();
    const reg_url = /^https\:\/\/www\.ncbi\.nlm\.nih\.gov\/pubmed[\w\&\?\=]*(?:term\=|\/)([0-9]+)/;
    const result = reg_url.exec(url);
    if (result) return result[1];
    return '';
  }

  static async fromPmid(pmid: string): Promise<PubmedParser> {
    if (!pmid.match(/^[0-9]+$/)) throw new PmidError('Invalid PMID');
    let parser = cache.get(pmid);
    if (parser == undefined) {
      parser = new PubmedParser();
      await parser.setPmid(pmid);
      cache.set(pmid, parser);
    }
    return parser;
  }

  format(template: string, variants: { [key: string]: string } = {}): string {
    if (!this._refEntry) return '';
    const option: { [key: string]: any } = variants;
    for (let [key, value] of Object.entries(this._refEntry)) {
      option[key] = value();
    }
    return this._template.formatEval(template, option);
  }

  private async setPmid(pmid: string) {
    const res = await axios.get(baseURL.replace('%s', pmid));
    this.setXml(res.data);
  }

  private setXml(xml: string) {
    this._refEntry = new RefEntry(xml);
  }

  public get<T extends keyof RefEntry>(key: T): string {
    return this._refEntry ? this._refEntry[key]().toString() : '';
  }
}
