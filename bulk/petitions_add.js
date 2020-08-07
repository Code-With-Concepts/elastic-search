var client = require('../connection.js');

var bulk = require("./petitions.json");

var handleError = function(err) {  
  if(!err) return false;
  console.log(err);
  return true;
};

var indexall = function(petitionlist,callback){  
  console.log('items left to index: '+(petitionlist.length/2));
  segment = petitionlist.splice(0,500);
  if (segment.length){
    bulkindex(segment,function(response){
      indexall(petitionlist,callback);
      callback(response);
    })
  }
  else {
    callback('No more petitions to index');
  }
}

var bulkindex = function(segment,callback){  
  client.bulk({
    index: 'gov',
    type: 'petitions',
    body: segment
  },function(err,resp){
    if (err) {
      console.log(err);
      callback(err);
    }
    else {
      console.log('items',resp.items.length);
      setTimeout(function() { callback('Indexed '+resp.items.length+' items'); }, 2000);
    }
  })
}

indexall(bulk,function(response){  
  console.log(response);
});