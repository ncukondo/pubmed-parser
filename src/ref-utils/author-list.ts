export { IAuthorInfo, AuthorList };

interface IAuthorInfo {
  Initial: string;
  FamilyName: string;
  GivenName: string;
}

class AuthorList {
  private authorInfoList: IAuthorInfo[];
  private _delimiter = ', ';
  private _max = 0;
  private _trimword = ', et al';
  private _format = '%F %I';
  constructor(infos: IAuthorInfo[] | null = null) {
    this.authorInfoList = infos || new Array<IAuthorInfo>();
  }

  add(info: IAuthorInfo) {
    this.authorInfoList.push(info);
    return this;
  }

  toString(): string {
    const namelist = this.authorInfoList.map(author => {
      return this._format
        .replace(/(\%F)|(familyname)/g, author.FamilyName)
        .replace(/(\%I)|(initial)/g, author.Initial)
        .replace(/(\%G)|(givenname)/g, author.GivenName)
        .trim();
    });
    if (this._max && namelist.length > this._max) namelist.length = this._max;
    const trimend = namelist.length < this.authorInfoList.length ? this._trimword : '';
    return namelist.join(this._delimiter) + trimend;
  }

  delimiter(delimit: string) {
    this._delimiter = delimit;
    return this;
  }

  max(maxlength: number) {
    this._max = maxlength;
    return this;
  }

  format(newformat: string) {
    this._format = newformat;
    return this;
  }

  trimWith(trimword: string) {
    this._trimword = trimword;
    return this;
  }
}
