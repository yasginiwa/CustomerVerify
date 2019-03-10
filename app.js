var db = require('./module/DBUtil.js');
var express = require('express');
var bodyParser = require('body-parser');
var multiParty = require('multiparty');
var https = require('https');
var fs = require('fs');
var request = require('request');
var querystring = require('querystring');

var app = new express();
var host = '192.168.0.172',
    port = '10444',
    protocol = 'http';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * 设置upload为静态文件夹
 */
app.use('/upload', express.static('upload'));


/**
 * post上传图片
 */
app.post('/upload', function (req, res) {
    var form = new multiParty.Form();
    form.uploadDir = 'upload';
    form.keepExtensions = true;
    form.parse(req, function (error, fields, files) {
        if (error) res.json({
            code: 0,
            msg: 'Upload Failed'
        });
        if (files != null) {
            res.json({
                code: 1,
                msg: 'ok',
                coverUrl: `${protocol}://192.168.0.172:${port}/${files.cover[0].path}`
            })
        } else {
            res.json({
                status: 0,
                msg: 'Cover Null',
                coverUrl: null
            })
        }
    });
});


/**
 * 获取皇冠卡券wxopenid
 */
app.post('/getcrowncakecardwxopenid', function (req, res) {
    var appid = 'wx7fc7b53df0fe91d2',
        secret = '64fa906971b92a829115e5011ba92aa5',
        js_code = req.body.js_code,
        grant_type = 'authorization_code',
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
 * 获取皇冠卡券审核wxopenid
 */
app.post('/getticketauthwxopenid', function (req, res) {
    var appid = 'wx655016ae5b6c5b1a',
        secret = '2a9faf8d39aea13763bb2c22af711a17',
        js_code = req.body.js_code,
        grant_type = 'authorization_code',
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
 * 生成卡券
 */
app.post('/icapi/tmticket', function (req, res) {
    var data = {
        token: req.body.token,
        sign: req.body.sign,
        content: req.body.content,
    };
    var dataStr = querystring.stringify(data);
    var url = 'http://crowncake.cn:27777/icapi/tmticket';
    request.post({
        url: url,
        headers: {
            "Content-length": dataStr.length,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: dataStr
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {    // 请求成功的处理逻辑
            res.send(body);
        }
    })
});

/**
 * 查询卡券
 */
app.post('/icapi/tmticketquery', function (req, res) {
    var data = {
        token: req.body.token,
        sign: req.body.sign,
        content: req.body.content,
    };
    var dataStr = querystring.stringify(data);
    var url = 'http://crowncake.cn:27777/icapi/tmticketquery';
    request.post({
        url: url,
        headers: {
            "Content-length": dataStr.length,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: dataStr
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {    // 请求成功的处理逻辑
            res.send(body);
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
 * 联合查询某wxopenid对应的注册信息和申请券信息
 */
app.post('/queryregistry', function (req, res) {
    db.joinQueryWithParam(function (result) {
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
        regdate = req.body.regdate,
        authstatus = (req.body.authstatus.length) ? req.body.authstatus : 0,
        table = 't_registry',
        sqlValues = `'${wxopenid}', '${company}', '${contact}', '${phone}', '${regdate}', '${authstatus}'`;
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
 * 审核客户注册信息
 */
app.post('/updateregistry', function (req, res) {
    var sqlParam = req.body.sqlParam,
        sqlValue = req.body.sqlValue,
        rangeParam = req.body.rangeParam,
        rangeValue = req.body.rangeValue;
        table = 't_registry';
    db.update(table, sqlParam, sqlValue, rangeParam, rangeValue, function (result) {
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
    var table = 't_expecttickets';
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
        rangeParam = req.body.rangeParam,
        rangeValue = req.body.rangeValue,
        table = 't_expecttickets';
    console.log(sqlParams, sqlValues);
    db.updateWithParams6(table, sqlParams, sqlValues, rangeParam, rangeValue, function (result) {
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
 * 查询审核是否通过
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
    var e_id = req.body.e_id,
        sqlValue = req.body.sqlValue,
        table = 't_expecttickets';
    db.del(table, e_id, sqlValue, function (result) {
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
        distributedate = req.body.distributedate,
        expectdate = req.body.expectdate,
        cover = req.body.cover,
        table = 't_tickets';
    sqlValue = `'${wxopenid}', '${company}', '${ticketcode}', '${ticketno}', '${productname}', '${price}',  '${distributestatus}', '${distributedate}' ,'${expectdate}', '${cover}'`;
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
        sqlParams = req.body.sqlParams,
        sqlValues = req.body.sqlValues,
        table = 't_expecttickets';
    db.queryColWithParams(table, col, sqlParams, sqlValues, function (result) {
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
    var sqlParams = req.body.sqlParams,
        sqlValues = req.body.sqlValues,
        table = 't_tickets';
    db.queryCountWithParams(table, sqlParams, sqlValues, function (result) {
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
        var expectdates = [];

        //  数组去重
        function uniq(arr) {
            var ret = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr.indexOf(arr[i]) === i) {
                    ret.push(arr[i]);
                }
            }
            return ret;
        }

        //  去除所有的申领卡券的日期
        for (var i = 0; i < result.length; i++) {
            var ticket = result[i];
            var expectdate = JSON.stringify(ticket.expectdate);
            expectdates.push(expectdate);
        }

        //  日期去重
        var uniqExpectdates = uniq(expectdates);

        //  把数组分成以日期为依据的若干个数组
        var ret = [];
        for (var j = 0; j < uniqExpectdates.length; j++) {
            expectdate = uniqExpectdates[j];
            var arr = [];
            for (var k = 0; k < result.length; k++) {
                ticket = result[k];
                if (JSON.stringify(ticket.expectdate) === expectdate) {
                    arr.push(ticket);
                    var obj = {
                        'expectdate': ticket.expectdate,
                        'expecttickets': arr
                    };
                }

            }
            ret.push(obj);
        }

        res.json({
            code: 1,
            msg: '提交成功',
            result: ret
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
    db.update(table, sqlParam, sqlValue, rangeParam, rangeValue, function (result) {
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
 * 添加申领卡券到数据库
 */
app.post('/addexpectticket', function (req, res) {
    var sqlParams = req.body.sqlParams,
        sqlValues = req.body.sqlValues,
        table = 't_expecttickets';
    db.addWithParams(table, sqlParams, sqlValues, function (result) {
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
 * 查询申领卡券审核状态为未审核最近时间的记录
 */
app.post('/expectunauth', function (req, res) {
    var sqlParams = req.body.sqlParams,
        sqlValues = req.body.sqlValues,
        condition = req.body.condition,
        table = 't_expecttickets';
    db.queryWithParamDesc(table, sqlParams, sqlValues, condition, function (result) {
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
 * 查询最后一条申领卡券审核状态为已审核的记录
 */
app.post('/expectauth', function (req, res) {
    var sqlParams = req.body.sqlParams,
        sqlValues = req.body.sqlValues,
        condition = req.body.condition,
        table = 't_expecttickets';
    db.queryWithParamDesc(table, sqlParams, sqlValues, condition, function (result) {
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
 * 查询券编号对应的券封面cover
 */
app.post('/queryticketcover', function (req, res) {
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


app.post('/userregistry', function (req, res) {
    var wxopenid = req.body.wxopenid,
        username = req.body.username,
        password = req.body.password,
        phone = req.body.phone,
        superuser = req.body.superuser,
        granted = req.body.granted,
        table = 't_user',
        sqlValues = `'${wxopenid}', '${username}', '${password}', '${phone}', '${superuser}', '${granted}'`;
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
 * 卡券审核-查询所有用户
 */
app.post('/userauth', function (req, res) {
    var table = 't_user';
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
 * 删除一个卡券审核-用户（信息填写错误）
 */
/**
 * 认证时删除多余无用的注册信息
 */
app.post('/userdel', function (req, res) {
    var sqlParam = req.body.sqlParam,
        sqlValue = req.body.sqlValue,
        table = 't_user';
    db.del(table, sqlParam, sqlValue, function (result) {
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


app.post('/userupdate', function (req, res) {
    var sqlParams = req.body.sqlParams,
        sqlValues = req.body.sqlValues,
        rangeParam = req.body.rangeParam,
        rangeValue = req.body.rangeValue,
        table = 't_user';
    console.log(sqlParams, sqlValues);
    db.updateWithParam2(table, sqlParams, sqlValues, rangeParam, rangeValue, function (result) {
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


// var options = {
//     key: fs.readFileSync('cert/ticketapi.hgsp.cn.key', 'utf-8'),
//     cert: fs.readFileSync('cert/ticketapi.hgsp.cn.pem', 'utf-8')
// };
//
// https.createServer(options, app).listen(port, host);

app.listen(port, host);

