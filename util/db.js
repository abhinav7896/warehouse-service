const mysql = require('mysql2')

const pool = mysql.createPool({
    // host: "localhost",    
    // user: "root",
    // password: "default",
    // database: "csci5409_project_warehouse_db",

    host: process.env.WAREHOUSE_DB_HOST,
    user: process.env.WAREHOUSE_DB_USER,
    password: process.env.WAREHOUSE_DB_PASSWORD,
    database: process.env.WAREHOUSE_DB_SCHEMA,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
});
module.exports = pool;
// module.exports = pool.promise();



