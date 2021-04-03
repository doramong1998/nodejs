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
    username: {
      type: type.STRING,
      allowNull: false,
    },
    fullName: {
      type: type.STRING,
      allowNull: false,
    },
    gender: {
      type: type.STRING, 
    },
    dob: {
      type: type.STRING,
    },
    idClass: {
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
    permissionId: {
      type: type.INTEGER,
    },
    avatar: {
      type: type.STRING,
    },
    status: {
      type: type.BOOLEAN,
    },
  }, {
    tableName: 'user_info',
    timestamps: false,
  });