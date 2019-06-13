/* jshint indent: 2 */
import Song from './song'

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_song', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // song_id: {
    //   type: DataTypes.INTEGER(11),
    //   allowNull: false,
    //   references: {
    //     model: 'song',
    //     key: 'id'
    //   }
    // },
    // user_id: {
    //   type: DataTypes.INTEGER(11),
    //   allowNull: false,
    //   references: {
    //     model: 'user',
    //     key: 'id'
    //   }
    // }
  }, {
    tableName: 'user_song',
  });
};
