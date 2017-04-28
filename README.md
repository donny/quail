# quail

Quail is a [Serverless](https://serverless.com) app that fetches new properties for sale from [Domain](https://www.domain.com.au) and save them to [Airtable](https://airtable.com).

### Background

This project is part of [52projects](https://donny.github.io/52projects/) and the new stuff that I learn through this project: [Serverless Framework](https://serverless.com) and [Airtable](https://airtable.com).

### Serverless Framework

The [Serverless Framework](https://serverless.com) is an open-source, application framework to easily build serverless architectures on AWS Lambda and other platforms. Install the serverless command line tool: `npm install -g serverless`. We assume that the usual AWS credentials have been setup.

Create a service by running: `serverless create --template aws-nodejs --path helloWorldService`. Go to the `helloWorldService` directory and run: `serverless deploy`. This creates a CloudFormation stack and deploy an example function. We could invoke the function by running: `serverless invoke --function hello`. We could delete the service by running: `serverless remove`. This deletes the corresponding AWS services and destroy the CloudFormation stack.

### Airtable

[Airtable](https://airtable.com/product) is a SaaS product, offering a spreadsheet-database hybrid where the features of a database are applied to a spreadsheet. In a sense, it's more powerful compared to Google Sheets. Airtable offers [API](https://airtable.com/api) and [libraries](https://github.com/Airtable/airtable.js) to access and edit the spreadsheets programmatically.

### Project

Quail is a Serverless app that fetches new properties for sale in [Point Cook, Victoria](https://en.wikipedia.org/wiki/Point_Cook,_Victoria) from Domain once a day and save them to an Airtable spreadsheet. The main user interface is through an Airtable document as shown below. The user doesn't need to interact with Quail directly. He/she just need to check the Airtable spreadsheet once a day.

![Screenshot](https://raw.githubusercontent.com/donny/quail/master/screenshot.png)

### Implementation

Quail is written in Node.js running on [AWS Lambda](https://aws.amazon.com/lambda/details/) using the Serverless framework to manage the underlying AWS infrastructure. The regular scheduled job is implemented using [Scheduled Events](http://docs.aws.amazon.com/lambda/latest/dg/with-scheduled-events.html). The main Serverless configuration for Quail can be found below:

```yaml
functions:
  status:
    handler: handler.status
    events:
      - schedule: rate(1 day)
      - http:
          path: status
          method: get
```

The main section of the implementation file, [`handler.js`](https://github.com/donny/quail/blob/master/handler.js), is listed below:

```javascript
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
```

For each listing, we try to find whether it exists in the document or not (see `select` and `filterByFormula`). If it doesn't exist, it creates a new spreadsheet row (see `newListing`) and appends it (see `create`). The listings are fetched using the following HTTP resource:

```javascript
const domainAddress = 'https://rest.domain.com.au/searchservice.svc/search'
const domainParams = { sub: 'Point Cook', state: 'VIC', pcodes: '3030' }
const domainResource = domainAddress + '?' + querystring.stringify(domainParams)
```

### Conclusion

I really like the Serverless Framework. In the past when I build and deploy AWS Lambda functions, I needed to write CloudFormation config files and a few Bash scripts to codify the underlying AWS infrastructure. But with Serverless, it handles the creation and deletion of the required AWS resources, we just need to concentrate on writing the functions. It's simple and easy!

I quite like Airtable, the API is easy to use and it allows us to embed images in the spreadsheet document. Airtable presents an intuitive interface to our real estate data.
