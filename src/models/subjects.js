module.exports = (sequelize, type) => {
  var subjects = sequelize.define(
    "subjects",
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
      name: {
        type: type.STRING,
        allowNull: false,
      },
      code: {
        type: type.STRING,
        allowNull: false,
      },
      totalStudent: {
        type: type.INTEGER,
      },
      studentNum: {
        type: type.INTEGER,
      },
      lessonNum: {
        type: type.INTEGER,
      },
      credit: {
        type: type.INTEGER,
      },
      idTeacher: {
        type: type.STRING,
      },
      status: {
        type: type.BOOLEAN,
      },
    },
    {
      tableName: "subjects",
      timestamps: false,
    }
  );
  return subjects;
};
