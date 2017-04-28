'use strict';

const querystring = require('querystring');
const fetch = require('node-fetch');
const airtable = require('airtable');
const _ = require('lodash');

module.exports.status = (event, context, callback) => {
  const base = new airtable({apiKey: ''}).base('appMjKBG3KMmA2ihh');

  const domainAddress = 'https://rest.domain.com.au/searchservice.svc/search'
  const domainParams = { sub: 'Point Cook', state: 'VIC', pcodes: '3030' }
  const domainResource = domainAddress + '?' + querystring.stringify(domainParams)
  const tableName = 'Table';

  fetch(domainResource)
  .then(response => {
    if (response.ok) {
      return response;
    }
    return Promise.reject(new Error(`Failed to fetch ${response.url}: ${response.status} ${response.statusText}`));
  })
  .then(response => response.json())
  .then(json => {
    const listings = json['ListingResults']['Listings'];

    listings.forEach(listing => {
      base(tableName).select({
        fields: ['AdId'],
        maxRecords: 1,
        pageSize: 1,
        filterByFormula: `{AdId} = "${listing['AdId']}"`
      }).eachPage((records, fetchNextPage) => {
        if (records.length != 0) { return; }

        let newListing = _.pick(listing, ['AdId', 'DisplayableAddress', 'DisplayPrice', 'Bedrooms', 'Bathrooms', 'Carspaces', 'PropertyType']);
        newListing['Image'] = [{url: listing['RetinaDisplayThumbUrl']}];
        newListing['CreatedAt'] = new Date();
        newListing['Link'] = `https://domain.com.au/${listing['AdId']}`;

        base(tableName).create(newListing, (err, record) => {
            if (err) { console.error(err); return; }
        });
      }, function done(err) {
        if (err) { console.error(err); return; }
      })
    });

  })
  .then(v => callback(null, v), callback);

};
