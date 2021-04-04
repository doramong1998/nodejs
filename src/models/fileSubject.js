module.exports = (sequelize, type) => sequelize.define('file_subject', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idSubject: {
      type: type.STRING,
      allowNull: false,
    },
    idFile: {
      type: type.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'file_subject',
    timestamps: true,
  });