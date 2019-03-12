import cheerio from 'cheerio';
import { AuthorList } from './ref-utils/author-list';
import { makeLink, LinkMaker } from './ref-utils/link-maker';

export class RefEntry {
  private $: CheerioStatic;
  constructor(xml: string) {
    const $ = cheerio.load(xml);
    this.$ = $;
  }
  private getPathTextFunc(path: string, delete_comma: boolean = false): string {
    let result = this.$(path)
      ? this.$(path)
          .first()
          .text()
      : '';
    if (delete_comma) {
      result = result.replace(/\.$/, '');
    }
    return result;
  }

  private getAuthorList(): AuthorList {
    const result = new AuthorList();
    this.$('AuthorList > Author').each((i, e) => {
      const familyname = this.$(e).find('LastName');
      const initials = this.$(e).find('Initials');
      const givenname = this.$(e).find('ForeName');
      if (familyname && initials && givenname && familyname.text()) {
        result.add({
          FamilyName: familyname.text(),
          GivenName: givenname.text(),
          Initial: initials.text()
        });
      }
    });
    return result;
  }

  private _makeLink(href: string, ...options: string[]): LinkMaker {
    return makeLink(href, ...options);
  }

  year = () => this.getPathTextFunc('PubDate > Year');
  month = () => this.getPathTextFunc('PubDate > Month');
  journal_short = () => this.getPathTextFunc('ISOAbbreviation', true);
  doi = () => this.getPathTextFunc('ArticleId[IdType="doi"]');
  journal = () => this.getPathTextFunc('Journal > Title', true);
  title = () => this.getPathTextFunc('ArticleTitle', true);
  vol = () => this.getPathTextFunc('Volume');
  issue = () => this.getPathTextFunc('JournalIssue > Issue');
  page = () => this.getPathTextFunc('MedlinePgn');
  pmid = () => this.getPathTextFunc('PMID');
  authors6 = () => this.getAuthorList().max(6);
  authors3 = () => this.getAuthorList().max(3);
  authors = () => this.getAuthorList();
  author1 = () => this.getAuthorList().max(1);
  link = () => this._makeLink;
}
