var db = require('./module/DBUtil.js');
var express = require('express');
var bodyParser = require('body-parser');

var app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/registry', function (req, res) {
    var openid = req.body.openid,
        company = req.body.company,
        contact = req.body.contact,
        phone = req.body.phone,
        authstatus = (req.body.authstatus.length) ? req.body.authstatus : 0
        table = 't_registry';
        sqlValue = `'${openid}', '${company}', '${contact}', '${phone}', '${authstatus}'`;
    db.add(table, sqlValue, function (result) {
        res.json({
            code: 1,
            msg: '提交成功',
            result: result
        })
    }, function (error) {
        res.json({
            code: 0,
            msg: '提交失败',
            result: error
        });
    })
});

app.listen(18000, '192.168.0.172');


