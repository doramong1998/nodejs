module.exports = (sequelize, type) =>
  sequelize.define(
    "point_user_subject",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idPoint: {
        type: type.STRING,
      },
      idSubject: {
        type: type.STRING,
        allowNull: false,
      },
      idUser: {
        type: type.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "point_user_subject",
      timestamps: true,
    }
  );
