var sql = require('./module/mssqlUtil.js');

sql.queryWithParams('select * from t_custom where t_id = ', 10, function (res) {
    console.log(res);
}, function (err) {
    console.log(err);
})


