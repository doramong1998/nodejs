module.exports = (sequelize, type) => sequelize.define('user_class', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idClass: {
      type: type.STRING,
      allowNull: false,
    },
    idUser: {
      type: type.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'user_class',
    timestamps: false,
  });