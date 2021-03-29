module.exports = (sequelize, type) => sequelize.define('files', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idFile: {
      type: type.STRING,
      allowNull: false,
    },
    name: {
      type: type.STRING,
    },
    type: {
      type: type.STRING, 
    },
    url: {
      type: type.STRING,
    },
    status: {
      type: type.BOOLEAN,
    },
  }, {
    tableName: 'files',
    timestamps: false,
  });