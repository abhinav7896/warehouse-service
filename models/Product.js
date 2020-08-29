const Sequelize = require('sequelize');
const orm = require("../util/orm");

const Product = orm.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.INTEGER,       
        allowNull: false
    }
});

module.exports = Product;