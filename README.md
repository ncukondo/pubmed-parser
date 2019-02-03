# pubmed-parser

## Getting Started

```
yarn add @ncukondo/pubmed-parser
```

or

```
npm install --save @ncukondo/pubmed-parser
```

## usage

```typescript
import { PubmedParser } from "./index";

const parser = await PubmedParser.fromPmid("26314775");

console.log(parser.get("authors6"));

const long_format =
  '${makeAuthorList()}. ${title}. ${year} ${month};${vol}${ issue ? "("+issue+")" : ""}:${page}${ pmid ? " Cited in PubMed; PMID:"+pmid : ""}.';
const short_format =
  '${abbrej}. ${year}${month ? " "+ month : ""};${vol}${ issue ? "("+issue+")" : ""}:${page}${ pmid ? " pmid:" + pmid : ""}.';
const result = parser.format(long_format);
const short_result = parser.format(short_format);
console.log("format:" + result);
console.log("short_format:" + short_result);
```

## License

This software is released under the MIT License, see LICENSE.txt.
