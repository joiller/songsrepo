/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_song', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // user_id: {
    //   type: DataTypes.INTEGER(11),
    //   allowNull: true,
    //   references: {
    //     model: 'user',
    //     key: 'id'
    //   }
    // },
    // song_id: {
    //   type: DataTypes.INTEGER(11),
    //   allowNull: true,
    //   references: {
    //     model: 'song',
    //     key: 'id'
    //   }
    // }
  }, {
    tableName: 'user_song'
  });
};
