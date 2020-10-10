const express = require('express')
const app = express()
const port = 3000
var path = require('path');

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname+'/home.html'));
// })

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/home.html'));
  //__dirname : It will resolve to your project folder.
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})