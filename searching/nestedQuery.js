var client=require ('../connection.js');  

client.search({  
    index: 'gov',
    type: 'petitions',
    body: {
      query: {
        bool: {
          must: [
            { match: { 'state': 'open' } },
            { nested: {
                path: 'signatures_by_constituency',
                query: {
                  bool: {
                    must: [
                      { 'match': { 'signatures_by_constituency.name': "Ipswich" }}
                    ]
                  }
                }
              }}
          ]
        }
      },
      sort: {  
        'signature_count': {
          order: 'asc'
        }
      }
  }
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