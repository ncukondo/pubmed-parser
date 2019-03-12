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
import { PubmedParser } from "@ncukondo/pubmed-parser";

const parser = await PubmedParser.fromPmid("26314775");

console.log(parser.get("authors6"));

const long_format =
  '{authors}. {title}. {year} {month};{vol}{ issue ? "("+issue+")" : ""}:{page}{ pmid ? " Cited in PubMed; PMID:"+pmid : ""}.';
const short_format =
  '{journal_short}. {year}{month ? " "+ month : ""};{vol}{ issue ? "("+issue+")" : ""}:{page}{ pmid ? " pmid:" + pmid : ""}.';
const result = parser.format(long_format);
const short_result = parser.format(short_format);
console.log("format:" + result);
console.log("short_format:" + short_result);
```

you can also use DOI

```typescript
import { PubmedParser } from "@ncukondo/pubmed-parser";

const doi = "doi: 10.3109/00365540903384158 ";
const short_format =
  '{journal_short}. {year}{month ? " "+ month : ""};{vol}{ issue ? "("+issue+")" : ""}:{page}{ pmid ? " pmid:" + pmid : ""}.';

const parser = await PubmedParser.from(doi);
const short_result = parser.format(short_format);
console.log(`fromDOI('${doisearch_word1}'):  ${short_result}`);
```

you can also use searchword

```typescript
import { PubmedParser } from "@ncukondo/pubmed-parser";

const search_word1 = "Br. J. Haematol. 1995;89(1):24-33";
const doi = "doi: 10.3109/00365540903384158 ";
const short_format =
  '{journal_short}. {year}{month ? " "+ month : ""};{vol}{ issue ? "("+issue+")" : ""}:{page}{ pmid ? " pmid:" + pmid : ""}.';

const parser = await PubmedParser.from(search_word1);
const short_result = parser.format(short_format);
console.log(`fromsearchword('${search_word1}'):  ${short_result}`);
```

## License

This software is released under the MIT License.
