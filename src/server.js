const express = require('express')
const path = require('path')

const app = express()
console.log(path.join(__dirname, 'assets'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
});
app.use('/static', express.static(path.join(__dirname, 'assets')))
app.use('/', express.static(path.join(__dirname, '..', 'dist')))
app.listen('16778', console.log)