const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product'); 

const Search = sequelize.define('Search', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  search_term: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product, 
      key: 'id',
    },
    allowNull: true,
  },
}, {
  tableName: 'searches',
  timestamps: true,
});

Search.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Search;
