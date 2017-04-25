'use strict';

const querystring = require('querystring');
const fetch = require('node-fetch');

const domainAddress = 'https://rest.domain.com.au/searchservice.svc/search'
const domainParams = { sub: 'Point Cook', state: 'VIC', pcodes: '3030' }
const domainResource = domainAddress + '?' + querystring.stringify(domainParams)

fetch(domainResource)
.then(res => res.json())
.then(json => console.log(json));
