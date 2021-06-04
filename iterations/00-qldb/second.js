// eslint-disable-next-line import/prefer-default-export
export const hello = (event, context, cb) => {
  const p = new Promise(resolve => {
    resolve('success');
  });
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless Webpack (Ecma Script) v1.0! Second module!',
        input: event,
      },
      null,
      2
    ),
  };
  p.then(() => cb(null, response)).catch(e => cb(e));
};


Data Model:
{
  "benchmarkId": "1",
  "benchmarkName": "Turnover Benchmark SMB",
  "benchmarkUnit": "€",
  "benchmarkees": [{
    "benchmarkeeId": "1",
    "benchmarkeePseudonym": "s/21",
    // separates System für Zuordnung Pseudonym => Firma 
    "value": {
      "valueId": "1",
      "value": 5.5
    }
  }]

}