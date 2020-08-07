var client = require('../connection.js');

client.search({  
  index: 'gov',
  type: 'petitions',  
  _source:['action','signature_count'],
  size: 1,
  body: {
     query: {
      bool: {
        must: [
          { match: { 'action': 'government' } },
          { range : {
                'signature_count' : {
                    'gte' : 10000
                }
            }
          }
        ]
      }
    },
    sort: {  
      'signature_count': {
        order: 'desc'
      }
    }
  },
},function (error, response,status) {
    if (error){
      console.log("search error: "+error)
    }
    else {
      console.log("--- Response ---");
      console.log(response);
      console.log("--- Hits ---");
      response.hits.hits.forEach(function(hit,index){
        console.log(hit);
      })
    }
});