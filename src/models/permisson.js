module.exports = (sequelize, type) => sequelize.define('permisson', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idPermisson: {
      type: type.STRING,
      allowNull: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    status: {
      type: type.BOOLEAN,
    },
  }, {
    tableName: 'permisson',
    timestamps: false,
  });