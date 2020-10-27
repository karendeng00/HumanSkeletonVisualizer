const express = require('express')
const app = express()
const port = 3000
var path = require('path');

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname+'/home.html'));
// })

app.use('/public', express.static(__dirname + '/public'));

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/home.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/visualize',function(req,res){
  res.sendFile(path.join(__dirname+'/views/visualize.html'));
  //__dirname : It will resolve to your project folder.
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})