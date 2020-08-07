var client = require('../connection.js');

client.delete({  
  index: 'gov',
  id: '1',
  type: 'constituencies'
},function(err,resp,status) {
    console.log(resp);
});