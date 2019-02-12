var sql = require('./module/DBUtil.js');
var express = require('express');
var bodyParser = require('body-parser');

var app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/registry', function (req, res) {

})



