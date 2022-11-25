# Test and Run the code

## Installing the application

```
cd json-transformation-server
npm install
```

## Requirements

- Running mongodb server locally
- NPM and Yarn

## Running the Application

`yarn dev` || `npm run dev`

## API ENDPOINTS

- `http://localhost:3000/v1/uploadMapping/`

The above api can be used to upload the mapping file.

Follow the below example

```var request = require('request');
var fs = require('fs');
var options = {
  'method': 'POST',
  'url': 'http://localhost:3000/v1/uploadMapping/',
  'headers': {
  },
  formData: {
    'file': {
      'value': fs.createReadStream('/Users/jatinbansal/Documents/major/json-transformation/data/sample_3/mapping.csv'),
      'options': {
        'filename': 'mapping.csv',
        'contentType': null
      }
    },
    'version': 'sample1'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```

- `http://localhost:3000/v1/transform/`

The api can be used to get the transformed json by providing the version.

The request is as follows:

```
var request = require('request');
var options = {
  'method': 'GET',
  'url': 'http://localhost:3000/v1/transform/',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "srcJson": {
      "id": "122-34-6543",
      "region": "NA",
      "firstName": "Leanne",
      "lastName": "Graham",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874"
      },
      "occupation": "self-employed",
      "age": 29,
      "loanHistory": [
        {
          "princicpal": 40000,
          "periodInYears": "3",
          "rateOfInterest": 10,
          "collateral": [
            {
              "assetName": "property",
              "estimatedValues": 7000
            }
          ]
        },
        {
          "princicpal": 140000,
          "periodInYears": "4",
          "rateOfInterest": 12,
          "isCommercial": true,
          "collateral": [
            {
              "assetName": "condo",
              "estimatedValues": 30000
            }
          ]
        },
        {
          "princicpal": 60000,
          "periodInYears": "4",
          "rateOfInterest": 12
        }
      ],
      "liquid_assets": 100000,
      "non_liquid_assets": 300000
    },
    "version": "sample3.v1"
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```
