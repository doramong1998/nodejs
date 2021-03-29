const Sequelize = require("sequelize");
const UserModel = require("./models/user");
const UserInfoModel = require("./models/infoUser");
const ClassesModel = require("./models/classes");
const ClassFileModel = require("./models/classFile");
const FileModel = require("./models/files");
const PermissonModel = require("./models/permisson");
const UserClassModel = require("./models/userClass");
const UserFileModel = require("./models/userFile");
const sequelize = new Sequelize("database", "tranquanghuy", "123456", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

const User = UserModel(sequelize, Sequelize);
const UserInfo = UserInfoModel(sequelize, Sequelize);
const Classes = ClassesModel(sequelize, Sequelize);
const ClassFile = ClassFileModel(sequelize, Sequelize);
const Files = FileModel(sequelize, Sequelize);
const Permisson = PermissonModel(sequelize, Sequelize);
const UserClass = UserClassModel(sequelize, Sequelize);
const UserFile = UserFileModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  console.log("-----------------------------------------------------------------------------------------------");
});

module.exports = {
  User,
  UserInfo,
  Classes,
  ClassFile,
  Files,
  Permisson,
  UserClass,
  UserFile,
};
