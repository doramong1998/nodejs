module.exports = (sequelize, type) =>
  sequelize.define(
    "files",
    {
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
        allowNull: false,
      },
      type: {
        type: type.STRING,
      },
      url: {
        type: type.STRING,
        allowNull: false,
      },
      status: {
        type: type.BOOLEAN,
      },
      idUser: {
        type: type.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "files",
      timestamps: false,
    }
  );
