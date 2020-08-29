const Sequelize = require('sequelize');



const orm = new Sequelize( 
    process.env.WAREHOUSE_DB_SCHEMA,
    process.env.WAREHOUSE_DB_USER,
    process.env.WAREHOUSE_DB_PASSWORD,
    {
        dialect: "mysql",
        host: process.env.WAREHOUSE_DB_HOST
    }

    // "csci5409_project_warehouse_db",
    // "root",
    // "default",
    // {
    //     dialect: "mysql",        
    //     host: "localhost"
    // }
);

module.exports = orm;
