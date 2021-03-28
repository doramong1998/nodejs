module.exports = (sequelize, type) => sequelize.define('userInfo', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: {
      type: type.STRING,
      allowNull: false,
    },
    lastName: {
      type: type.STRING,
      allowNull: false,
    },
    firstName: {
      type: type.STRING,
      allowNull: false,
  
    },
    gender: {
      type: type.STRING,
    },
    dob: {
      type: type.STRING,
    },
    class: {
      type: type.STRING,
    },
    studentId: {
      type: type.STRING,
    },
    address: {
      type: type.STRING,
    },
    phone: {
      type: type.STRING,
    },
    email: {
      type: type.STRING,
    },
    permission: {
      type: type.STRING,
    },
    avatar: {
      type: type.STRING,
    },
  }, {
    tableName: 'user_info',
    timestamps: false,
  });