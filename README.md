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

Quail is a Serverless app that fetches new properties for sale from Domain once a day and save them to an Airtable spreadsheet. The main user interface is through an Airtable document as shown below.

![Screenshot](https://raw.githubusercontent.com/donny/quail/master/screenshot.png)

### Implementation

...

### Conclusion

...
