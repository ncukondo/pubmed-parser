import cheerio from 'cheerio';

export class RefEntry {
  private $: CheerioStatic;
  constructor(xml: string) {
    const $ = cheerio.load(xml);
    this.$ = $;
  }
  private getPathTextFunc(path: string, delete_comma: boolean = false): () => string {
    return () => {
      let result = this.$(path) ? this.$(path).text() : '';
      if (delete_comma) {
        result = result.replace(/\.$/, '');
      }
      return result;
    };
  }

  private getAuthorList(
    delimiter: string = ', ',
    maxCount: number = 0,
    postfix: string = 'et al'
  ): string {
    const list = new Array<string>();
    this.$('AuthorList > Author').each((i, e) => {
      const lastname = this.$(e).find('LastName');
      const initials = this.$(e).find('Initials');
      const name = (lastname && initials ? lastname.text() + ' ' + initials.text() : '').trim();
      if (name) {
        if (maxCount && i > maxCount - 1) {
          list.push(postfix);
          return false;
        }
        list.push(name);
      }
    });
    return list.join(delimiter);
  }

  year = this.getPathTextFunc('PubDate > Year');
  month = this.getPathTextFunc('PubDate > Month');
  abbrej = this.getPathTextFunc('ISOAbbreviation', true);
  doi = this.getPathTextFunc('ArticleId[IdType="doi"]');
  journal = this.getPathTextFunc('Journal > Title', true);
  title = this.getPathTextFunc('ArticleTitle', true);
  vol = this.getPathTextFunc('Volume');
  issue = this.getPathTextFunc('JournalIssue > Issue');
  page = this.getPathTextFunc('MedlinePgn');
  pmid = this.getPathTextFunc('PMID');
  authors6 = () => this.getAuthorList(', ', 6);
  authors = () => this.getAuthorList();
  makeAuthorList = () => this.getAuthorList.bind(this);
}
