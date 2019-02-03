export class Template {
  private _prefix = String.raw`\$\{`;
  private _postfix = String.raw`\}`;

  get prefix() {
    return this._prefix;
  }

  get postfix() {
    return this._postfix;
  }

  set prefix(newprefix: string) {
    this._prefix = this.escapeRegExp(newprefix);
  }

  set postfix(newpostfix: string) {
    this._postfix = this.escapeRegExp(newpostfix);
  }

  private escapeRegExp(target: string) {
    return target.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
  }

  private evaluate(expr: string, option: { [key: string]: any }) {
    let result = '';
    try {
      result = new Function(...Object.keys(option), 'return ' + expr)(...Object.values(option));
    } catch (e) {
      console.error(`Error evaluating( ${expr} )    ${e}`);
    }
    return result;
  }

  formatEval(text: string, option: { [key: string]: any }): string {
    return this.format(text, key => {
      return this.evaluate(key, option) as string;
    });
  }

  format(text: string, dict: { [key: string]: string }): string;
  format(text: string, func: (key: string) => string): string;
  format(text: string, processor: any): string {
    return text.replace(new RegExp(this.prefix + '(.*?)' + this.postfix, 'g'), (all, key) => {
      if (processor instanceof Function) {
        return (processor as (key: string) => string)(key);
      } else {
        return Object.prototype.hasOwnProperty.call(processor, key) ? processor[key] : '';
      }
    });
  }
}
