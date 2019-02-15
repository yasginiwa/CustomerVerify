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


/**
 *  插入
 */
exports.add = function (table, sqlValue, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        console.log(sqlValue);
        return pool.query(`insert into ${table} values(${sqlValue})`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 *  删除
 */
exports.del = function (table, sqlParma, sqlValue, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`delete from ${table} where ${sqlParma} = ${sqlValue}`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};

/***
 * 查询
 */
exports.queryWithParams = function (table, sqlParam, sqlValue, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select * from ${table} where ${sqlParam} = '${sqlValue}'`);
    }).then(result => {
        successCallback(result.recordset);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 *  修改
 */
exports.update = function (table, sqlParam, sqlValue, rangeParam, rangeValue, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`update ${table} set ${sqlParam} = '${sqlValue}' where ${rangeParam} = '${rangeValue}'`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};