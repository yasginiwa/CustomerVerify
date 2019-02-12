const sql = require('mssql');

const config = {
    user: 'ticketUser',
    password: 'Yasginiwa12#$',
    server: '192.168.10.12',
    database: 'ticketCustomAuth',
    port: 1433,
    pool: {
        min: 0,
        max: 50,
        idleTimeoutMillis: 3000
    }
};

/***
 * 查询
 * @param sqlStr    sql语句
 * @param params    查询参数
 * @param successCallback   查询成功回调
 * @param failCallback  查询失败回调
 */
var queryWithParams = function(sqlStr, params, successCallback, failCallback){

    var pool = new sql.ConnectionPool(config).connect().then(pool => {
        var request = pool.request();

        return pool.query((sqlStr + params).toString());
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });




};


// var queryWithParams = function(sqlStr, params, queryCallback, connCallback, poolCallback){
//     try {
//         var pool = new mssql.ConnectionPool(config,function(err) {
//             let request = pool.request();
//             request.multiple=true;
//             if (params != null) {
//                 for(let index in params){
//                     request.input(index, params[index].sqlType, params[index].inputValue);
//                 }
//             }
//             request.query(sqlStr,function(err, result){
//                 queryCallback(err, result);
//                 pool.close();//关闭连接池
//             });
//         });
//
//         //连接数据库异常
//         pool.on("error",  function(err) {
//             connCallback(err);
//             pool.close();//关闭连接池
//         });
//     } catch(e) {
//         poolCallback(e);
//         pool.close();//关闭连接池
//     }
// };


exports = sql;