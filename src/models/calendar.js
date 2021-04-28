
module.exports = (sequelize, type) => {
  var calendar = sequelize.define(
    "calendar",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idCalendar: {
        type: type.STRING,
        allowNull: false,
      },
      name: {
        type: type.STRING,
         allowNull: false,
      },
      time: {
        type: type.INTEGER,
      },
      type: {
        type: type.STRING,
      },
      status: {
        type: type.BOOLEAN,
      },
    },
    {
      tableName: "calendar",
      timestamps: true,
    }
  );
  return calendar;
};
