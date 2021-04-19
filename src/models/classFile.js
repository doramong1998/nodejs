module.exports = (sequelize, type) =>
  sequelize.define(
    "subject_file",
    {
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
    },
    {
      tableName: "subject_file",
      timestamps: false,
    }
  );
