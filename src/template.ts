export { Template, PrintErrorFuncType };

type PrintErrorFuncType = (key: string, soure: Template, e: Error) => string;

class Template {
  private _prefixForRegEx = '';
  private _postfixForRegEx = '';
  private _prefix = '${';
  private _postfix = '}';
  private _currentSource = '';
  maxCharForEval = 256;

  constructor() {
    this.postfix = this._postfix;
    this.prefix = this._prefix;
  }

  get currentSource() {
    return this._currentSource;
  }

  get prefix() {
    return this._prefix;
  }

  get postfix() {
    return this._postfix;
  }

  set prefix(newprefix: string) {
    this._prefix = newprefix;
    this._prefixForRegEx = this.escapeRegExp(newprefix);
  }

  set postfix(newpostfix: string) {
    this._postfix = newpostfix;
    this._postfixForRegEx = this.escapeRegExp(newpostfix);
  }

  private escapeRegExp(target: string) {
    return target.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&');
  }

  private evaluate(
    expr: string,
    option: { [key: string]: string | Function },
    onError: PrintErrorFuncType
  ) {
    let result = '';
    try {
      if (expr.length > this.maxCharForEval) {
        throw new Error(
          `Eval error: key length should not exceed ${this.maxCharForEval}(length:${expr.length})`
        );
      }
      result = new Function(...Object.keys(option), 'return ' + expr)(...Object.values(option));
      result = result.toString();
    } catch (e) {
      result = onError(expr, this, e);
    }
    return result;
  }

  private printErrorHandler(key: string, source: Template, e: Error): string {
    return `${source.prefix} error:'${key}' - '${e}' ${source.postfix}`;
  }

  private emptyErrorHandler(): string {
    return '';
  }

  formatEval(
    text: string,
    option: { [key: string]: string | Function },
    printError?: PrintErrorFuncType | boolean | null
  ): string {
    let errorHandler: PrintErrorFuncType;
    if (arguments.length < 3 || printError == null) {
      errorHandler = this.printErrorHandler;
    } else if (typeof printError === 'boolean') {
      errorHandler = (printError as boolean) ? this.printErrorHandler : this.emptyErrorHandler;
    } else {
      errorHandler = printError as PrintErrorFuncType;
    }
    return this.format(text, key => {
      return this.evaluate(key, option, errorHandler) as string;
    });
    '';
  }

  format(text: string, dict: { [key: string]: string }): string;
  format(text: string, func: (key: string) => string): string;
  format(text: string, processor: any): string {
    this._currentSource = text;
    return text.replace(
      new RegExp(this._prefixForRegEx + '(.*?)' + this._postfixForRegEx, 'g'),
      (all, key) => {
        if (processor instanceof Function) {
          return (processor as (key: string) => string)(key);
        } else {
          return Object.prototype.hasOwnProperty.call(processor, key) ? processor[key] : '';
        }
      }
    );
  }
}
