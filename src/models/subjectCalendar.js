module.exports = (sequelize, type) => {
  var subjectCalendar = sequelize.define(
    "subject_calendar",
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
      idSubject: {
        type: type.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "subject_calendar",
      timestamps: true,
    }
  );
  return subjectCalendar;
};
