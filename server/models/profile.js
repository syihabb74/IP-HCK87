'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, {foreignKey : 'UserId'})
    }
  }
  Profile.init({
    username: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });

  Profile.beforeCreate((profile) => {
    if (!profile.username) {
      profile.username = `user${Math.floor(1000 + Math.random() * 9000)}`;
    }
  });

  return Profile;
};