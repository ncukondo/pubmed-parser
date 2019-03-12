export { makeLink, LinkMaker };

const makeLink = (href: string, ...options: string[]) => {
  return new LinkMaker(href, ...options);
};

class LinkMaker {
  private _href = '';
  private _title = '';
  constructor(href: string, ...options: string[]) {
    this._href = options.reduce((accum, option) => accum.replace('%s', option), href);
    this._title = this._href;
  }

  title(newtitle: string) {
    this._title = newtitle;
    return this;
  }

  toString() {
    return `<a href='${this._href}' target='_blank'>${this._title}</a>`;
  }
}
