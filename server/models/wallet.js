'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, { foreignKey: 'UserId' });  
    }
  }
  Wallet.init({
    walletName: DataTypes.STRING,
    address: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "Address already exists in the database"
      },
      allowNull: false,
      validate: {
        is: {
          args: /^0x[a-fA-F0-9]{40}$/,
          msg: "Invalid Ethereum address format"
        }
      } 
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};