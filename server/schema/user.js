/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.CHAR(8),
      allowNull: false
    },
    password: {
      type: DataTypes.CHAR(16),
      allowNull: false
    },
    sex: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isVip: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'user'
  });
};
