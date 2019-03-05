const sql = require('mssql');

const config = {
    user: 'ticketUser',
    password: 'Yasginiwa12#$',
    server: 'crowncake.cn',
    database: 'ticketCustomAuth',
    port: 10443,
    pool: {
        min: 0,
        max: 50,
        idleTimeoutMillis: 3000
    }
};


/**
 *  插入
 */
exports.add = function (table, sqlValues, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`insert into ${table} values(${sqlValues})`);
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
        return pool.query(`delete from ${table} where ${sqlParma} = '${sqlValue}'`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};

/***
 * 带参数带值条件查询
 */
exports.queryWithParam = function (table, sqlParam, sqlValue, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select * from ${table} where ${sqlParam} = '${sqlValue}'`);
    }).then(result => {
        successCallback(result.recordset);
    }).catch(err => {
        failCallback(err);
    });
};

/***
 * 全部查询
 */
exports.queryAll = function (table, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select * from ${table}`);
    }).then(result => {
        successCallback(result.recordset);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 * 带多参数带多值全部查询
 */
exports.queryAllWithParams = function (table, sqlParams, sqlValues, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select * from ${table} where ${sqlParams[0]} = '${sqlValues[0]}' and ${sqlParams[1]} = '${sqlValues[1]}' and ${sqlParams[2]} = '${sqlValues[2]}'`);
    }).then(result => {
        successCallback(result.recordset);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 * 带2参数带多值全部查询
 */
exports.queryAllWithParams2 = function (table, sqlParams, sqlValues, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select * from ${table} where ${sqlParams[0]} = '${sqlValues[0]}' and ${sqlParams[1]} = '${sqlValues[1]}'`);
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

/**
 * 带多参数修改
 */
exports.updateWithParams = function (table, sqlParams, sqlValues, rangeParam, rangeValue, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`update ${table} set ${sqlParams[0]} = '${sqlValues[0]}', ${sqlParams[1]} = '${sqlValues[1]}'  where ${rangeParam} = '${rangeValue}'`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 * 查询表记录总数
 */
exports.queryTotalCount = function (table, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select count(*) from ${table}`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 * 带一个参数查询记录个数
 */
exports.queryCountWithParams = function (table, sqlParams, sqlValues, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select count(*) as addcount from ${table} where ${sqlParams[0]} = '${sqlValues[0]}' and ${sqlParams[1]} = '${sqlValues[1]}'`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 * 查询带参数某列数据
 */
exports.queryColWithParam = function (table, col, sqlParam, sqlValue, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select ${col} from ${table} where ${sqlParam} = '${sqlValue}'`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 * 查询带多参数某列数据
 */
exports.queryColWithParams = function (table, col, sqlParams, sqlValues, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select ${col} from ${table} where ${sqlParams[0]} = '${sqlValues[0]}' and ${sqlParams[1]} = '${sqlValues[1]}'`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 * 查询带参数所有数据
 */
exports.queryColAll = function (table, cols, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select ${cols[0]}, ${cols[1]}, ${cols[2]}, ${cols[3]}, ${cols[4]}, ${cols[5]} from ${table}`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
};

/**
 * 降序带参数查询
 */
exports.queryWithParamDesc = function (table, sqlParams, sqlValues, condition, successCallback, failCallback) {
    new sql.ConnectionPool(config).connect().then(pool => {
        return pool.query(`select top 1 * from ${table} where ${sqlParams[0]} = '${sqlValues[0]}' and ${sqlParams[1]} = '${sqlValues[1]}' order by ${condition} DESC`);
    }).then(result => {
        successCallback(result);
    }).catch(err => {
        failCallback(err);
    });
}
