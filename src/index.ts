import axios from 'axios';
import { RefEntry } from './ref-entry';
import { Template } from './template';

const baseURL =
  'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=%s&retmode=xml';

export class PubmedParser {
  private _refEntry?: RefEntry;
  private _template: Template;

  private constructor() {
    this._template = new Template();
  }

  static async fromPmid(pmid: string): Promise<PubmedParser> {
    const parser = new PubmedParser();
    await parser.setPmid(pmid);
    return parser;
  }

  format(template: string): string {
    if (!this._refEntry) return '';
    const option: { [key: string]: any } = {};
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
