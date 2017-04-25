'use strict';

const querystring = require('querystring');
const fetch = require('node-fetch');

module.exports.status = (event, context, callback) => {
  const domainAddress = 'https://rest.domain.com.au/searchservice.svc/search'
  const domainParams = { sub: 'Point Cook', state: 'VIC', pcodes: '3030' }
  const domainResource = domainAddress + '?' + querystring.stringify(domainParams)

  fetch(domainResource)
  .then(res => res.json())
  .then(json => console.log(json))
  .then(v => callback(null, v), callback);

  // var Airtable = require('airtable');
  // var base = new Airtable({apiKey: ''}).base('appBwk4mgN0DonbUA');
  //
  // base('Price').find('rec0hrEYf995F3WHD', function(err, record) {
  //     if (err) { console.error(err); return; }
  //     console.log(record);
  // });
  //
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     input: event,
  //   }),
  // };
  //
  // callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
