var getJSON = require('get-json');  
var fs = require('fs');  
var client = require('../connection.js')

var bulk = [];

var firstfile = "https://petition.parliament.uk/petitions.json";

var handleError = function(err) {  
  if(!err) return false;
  console.log(err);
  return true;
};

var processMany = function(petitions,callback) {

  for(var increment in petitions.data){
    getJSON('https://petition.parliament.uk/petitions/'+petitions.data[increment].id+'.json', function(error, response){
      if(handleError(error)) {
        // handle errors here
      }
      else {

        var preCon = response.data.attributes.signatures_by_constituency;

        if(preCon)
        {
        for(var i = 0; i < preCon.length; i++) {
          response.data.attributes.signatures_by_constituency[i].importance = response.data.attributes.signatures_by_constituency[i].signature_count / response.data.attributes.signature_count;
        }

        var datetime = new Date();
        var indexbody = response.data.attributes;
        indexbody.tstamp = datetime;
        bulk.push(
          { index: {_index: 'gov', _type: 'petitions', _id: response.data.id } },
          { 'self': response.links.self,
            'action': response.data.attributes.action,
            'state': response.data.attributes.state,
            'background': response.data.attributes.background,
            'signatures_by_constituency': response.data.attributes.signatures_by_constituency,
            'signature_count': response.data.attributes.signature_count}
          );
      }
    }
    })
  };
  callback(bulk);
};

var processList = function(thisfile,callback){  
  getJSON(thisfile,function(error,response){
    if(handleError(error)) {
    }
    else {
      console.log('gathering: '+response.links.self);
      processMany(response,function(response){
      });
      if (response.links.next){
        processList(response.links.next,function(response){
          callback(response);
        })
      }
      else {
        callback(bulk);
      }
    }
  })
};

var savejson = function(petitionlist,callback){  
  console.log('saving '+(petitionlist.length/2)+' petitions');
  fs.writeFile('petitions.json', JSON.stringify(petitionlist), function (err) {
    if (err) return console.log(err);
    callback('done');
  });

};

processList(firstfile,function(response){  
  console.log('petitions: '+(response.length/2));
  savejson(response,function(response){
    console.log(response);
  });
});