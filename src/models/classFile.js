module.exports = (sequelize, type) => sequelize.define('class_file', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idClass: {
      type: type.STRING,
      allowNull: false,
    },
    idFile: {
      type: type.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'class_file',
    timestamps: false,
  });