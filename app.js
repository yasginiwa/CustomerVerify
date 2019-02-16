var db = require('./module/DBUtil.js');
var express = require('express');
var bodyParser = require('body-parser');

var app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * 客户注册
 */
app.post('/registry', function (req, res) {
    var openid = req.body.openid,
        company = req.body.company,
        contact = req.body.contact,
        phone = req.body.phone,
        authstatus = (req.body.authstatus.length) ? req.body.authstatus : 0,
        regdate = (req.body.regdate),
        table = 't_registry';
    sqlValue = `'${openid}', '${company}', '${contact}', '${phone}', '${authstatus}', '${regdate}'`;
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

/**
 * 客户审核管理登录
 */
app.post('/login', function (req, res) {
    var username = req.body.username,
        sqlParam = 'username',
        table = 't_user';
    db.queryWithParams(table, sqlParam, username, function (result) {
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

/**
 * 查询所有客户
 */
app.post('/auth', function (req, res) {
    var authstatus = req.body.authstatus,
        sqlParam = 'authstatus',
        table = 't_registry';
    db.queryAll(table, function (result) {
        res.json({
            code: 1,
            msg: '提交成功',
            result: result
        });
    }, function (error) {
        res.json({
            code: 0,
            msg: '提交失败',
            result: error
        });
    })
});

/**
 * 审核客户 改变客户审核状态
 */
app.post('/authupdate', function (req, res) {
    var authstatus = req.body.authstatus,
        sqlValue = req.body.sqlValue,
        r_id = req.body.r_id,
        rangeValue = req.body.rangeValue,
        table = 't_registry';
    db.update(table, authstatus, sqlValue, r_id, rangeValue, function (result) {
        res.json({
            code: 1,
            msg: '提交成功',
            result: result
        });
    }, function (error) {
        res.json({
            code: 0,
            msg: '提交失败',
            result: error
        });
    })
});

/**
 * 查询审核是否通过 不通过UI则显示审核进度页面
 */
app.post('/queryauth', function (req, res) {
    var sqlParams = req.body.sqlParams,
        sqlValues = req.body.sqlValues,
        table = 't_registry';
    db.queryAllWithParams(table, sqlParams, sqlValues, function (result) {
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


app.listen(18000, '192.168.10.214');


