'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, {foreignKey : 'UserId'})
    }
  }
  User.init({
    fullName: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : `Full name is required`
        },
        notEmpty : {
          msg : `Full name is required`
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : {
        args : true,
        msg : `Email already exists`
      },
      validate : {
        notNull : {
          msg : `Email is required`
        },
        notEmpty : {
          msg : `Email is required`
        },
        isEmail : {
          args : true,
          msg : `Invalid email format`
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : `Password is required`
        },
        notEmpty : {
          msg : `Password is required`
        }
      }
    },
    balance: {
      type : DataTypes.INTEGER,
      defaultValue : 0
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user) => {
    user.password = hashPassword(user.password);
  });

  User.afterCreate(async (user) => {
    await user.createProfile();
  })

  return User;
};