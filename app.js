var db = require('./module/DBUtil.js');
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');
var request = require('request');

var app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


/**
 * 获取wxopenid
 */
app.post('/getwxopenid', function (req, res) {
   var appid = 'wx7fc7b53df0fe91d2',
       secret = '64fa906971b92a829115e5011ba92aa5',
       js_code = req.body.js_code,
       grant_type= 'authorization_code',
       url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=${grant_type}`;

   request(url, function (error, response) {
       if (!error && response.statusCode === 200) {
           var result = {
               wxopenid: JSON.parse(response.body).openid
           };
           res.json({
               code: 1,
               msg: '提交成功',
               result: result
           });
       } else {
           res.json({
               code: 0,
               msg: '提交失败',
               result: error
           });
       }
   })
});


/**
 * 返回所有的wxopenid和对应的公司名称
 */
app.post('/querywxopenids', function (req, res) {
    var cols = req.body.cols,
        table = 't_registry';
   db.queryColAll(table, cols, function (result) {
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
 * 客户注册
 */
app.post('/registry', function (req, res) {
    var wxopenid = req.body.wxopenid,
        company = req.body.company,
        contact = req.body.contact,
        phone = req.body.phone,
        authstatus = (req.body.authstatus.length) ? req.body.authstatus : 0,
        regdate = (req.body.regdate),
        numbers = req.body.numbers,
        table = 't_registry',
        sqlValues = `'${wxopenid}', '${company}', '${contact}', '${phone}', '${authstatus}', '${regdate}', ${numbers}`;
    db.add(table, sqlValues, function (result) {
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
    db.queryWithParam(table, sqlParam, username, function (result) {
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
    var sqlParams = req.body.sqlParams,
        sqlValues = req.body.sqlValues,
        r_id = req.body.r_id,
        rangeValue = req.body.rangeValue,
        table = 't_registry';
    db.updateWithParams(table, sqlParams, sqlValues, r_id, rangeValue, function (result) {
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

/**
 * 认证时删除多余无用的注册信息
 */
app.post('/authdel', function (req, res) {
    var r_id = req.body.r_id,
        sqlValue = req.body.sqlValue,
        table = 't_registry';
    db.del(table, r_id, sqlValue, function (result) {
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
 * 添加卡券到数据库接口
 */
app.post('/addticket', function (req, res) {
    var company = req.body.company,
        ticketcode = req.body.ticketcode,
        ticketno = req.body.ticketno,
        productname = req.body.productname,
        price = req.body.price,
        wxopenid = req.body.wxopenid,
        distributestatus = req.body.distributestatus,   // 状态0为未使用 1为已使用
        table = 't_tickets';
    sqlValue = `'${company}', '${ticketcode}', '${ticketno}', '${productname}', '${price}', '${wxopenid}', '${distributestatus}'`;
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
 * 查询客户卡券可分发总数(合同规定券数量)
 */
app.post('/tickettotalcount', function (req, res) {
    var col = req.body.col,
        sqlParam = req.body.sqlParam,
        sqlValue = req.body.sqlValue,
        table = 't_registry';
    db.queryColWithParam(table, col, sqlParam, sqlValue, function (result) {
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
 * 查询客户已添加卡券数量
 */
app.post('/ticketaddcount', function (req, res) {
    var sqlParam = req.body.sqlParam,
        sqlValue = req.body.sqlValue,
        table = 't_tickets';
    db.queryCountWithParam(table, sqlParam, sqlValue, function (result) {
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
 * 查询客户所有卡券
 */
app.post('/tickets', function (req, res) {
    var sqlParam = req.body.sqlParam,
        sqlValue = req.body.sqlValue,
        table = 't_tickets';
    db.queryWithParam(table, sqlParam, sqlValue, function (result) {
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
 * 更新卡券发送后的状态
 */
app.post('/updatedistributestatus', function (req, res) {
    var sqlParam = req.body.sqlParam,
        sqlValue = req.body.sqlValue,
        rangeParam = req.body.rangeParam,
        rangeValue = req.body.rangeValue,
        table = 't_tickets';
    db.update(table, sqlParam, sqlValue, rangeParam, rangeValue,function (result) {
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


// var options = {
//     key: fs.readFileSync('cert/server.key', 'utf-8'),
//     cert: fs.readFileSync('cert/server.crt', 'utf-8')
// };

// https.createServer(options, app).listen(10443, '192.168.5.248');

app.listen(18000, '192.168.0.172');

