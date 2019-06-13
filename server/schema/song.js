/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('song', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.CHAR(15),
      allowNull: false
    },
    singer: {
      type: DataTypes.CHAR(8),
      allowNull: false
    },
    url:{
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'song'
  });
};
