module.exports = (sequelize, type) => sequelize.define('user_file', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idFile: {
      type: type.STRING,
      allowNull: false,
    },
    idUser: {
      type: type.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'user_file',
    timestamps: false,
  });