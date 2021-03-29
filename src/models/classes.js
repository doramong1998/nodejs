module.exports = (sequelize, type) => sequelize.define('classes', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idClass: {
      type: type.STRING,
      allowNull: false,
    },
    className: {
      type: type.STRING,
      allowNull: false,
    },
    idTeacher: {
      type: type.STRING, 
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
  }, {
    tableName: 'classes',
    timestamps: false,
  });