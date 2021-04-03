const User = require('./infoUser');

module.exports = (sequelize, type) => {
  var classes = sequelize.define(
    "classes",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idClass: {
        type: type.STRING,
        allowNull: false,
      },
      name: {
        type: type.STRING,
        allowNull: false,
      },
      studentNum: {
        type: type.INTEGER,
      },
      idTeacher: {
        type: type.STRING,
        references: {
          model: User, 
          key: 'idUser',
       }
      },
      students: {
        type: type.STRING,
      },
      files: {
        type: type.STRING,
      },
      status: {
        type: type.BOOLEAN,
      },
    },
    {
      tableName: "classes",
      timestamps: false,
    }
  );
  return classes;
};