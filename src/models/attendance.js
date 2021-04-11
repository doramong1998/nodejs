module.exports = (sequelize, type) => {
  var attendance = sequelize.define(
    "attendance",
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
      idUser: {
        type: type.STRING,
        allowNull: false,
      },
      date: {
        type: type.STRING,
        allowNull: false,
      },
      value: {
        type: type.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "attendance",
      timestamps: true,
    }
  );
  return attendance;
};
