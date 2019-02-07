import { doi2Pmid } from './doi2pmid';
jest.unmock('./doi2pmid');

const doi = 'doi: 10.3109/00365540903384158 ';
const doi2 = 'https://doi.org/10.3109/00365540903384158 ';
const doi3 = 'http://www.pnas.org/cgi/doi/10.1073/pnas.1319030111';

describe('doi2pmid', () => {
  it(`doi2pmid('${doi}') to equal ['19958237']`, async () => {
    const pmid = await doi2Pmid(doi);
    //console.log(`doi to pmid => ${pmid}`);
    expect(pmid).toEqual('19958237');
  });
  it(`doi2pmid('${doi2}') to equal ['19958237']`, async () => {
    const pmid = await doi2Pmid(doi2);
    //console.log(`doi to pmid => ${pmid}`);
    expect(pmid).toEqual('19958237');
  });
  it(`doi2pmid('${doi3}') to equal ['24821756']`, async () => {
    const pmid = await doi2Pmid(doi3);
    //console.log(`doi to pmid => ${pmid}`);
    expect(pmid).toEqual('24821756');
  });
});
