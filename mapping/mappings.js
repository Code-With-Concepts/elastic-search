var client = require('../connection.js');

// client.indices.putMapping({  
//   index: 'gov',
//   type: 'constituencies',
//   body: {
//     properties: {
//       'constituencyname': {
//         "type":"keyword",
//         "index": true
//       },
//       'electorate': {  
//         'type': 'integer'
//       },
//       'validvotes': {  
//         'type': 'integer'
//       }
//     }
//   },
//   includeTypeName: true
// },function(err,resp,status){
//     if (err) {
//       console.log(err);
//     }
//     else {
//       console.log(resp);
//     }
// });

client.indices.putMapping({  
  index: 'gov',
  type: 'petitions',
  body: {
    properties: {
      'signatures_by_constituency': {
        'type': 'nested',
        properties: {
          'name': {
            "type":"keyword",
            "index": true
          }
        }
      },
      'signatures_by_country': {
        'type': 'nested',
        properties: {
          'name': {
            "type":"keyword",
            "index": true
          }
        }
      }
    }
  },
  includeTypeName: true
},function(err,resp){
    if (err) {
      console.log(err);
    }
    else {
      console.log(resp);
    }
});