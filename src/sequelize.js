const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const UserInfoModel = require('./models/infoUser');
const ClassesModel = require('./models/classes');
const sequelize = new Sequelize('database', 'tranquanghuy', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});


const User = UserModel(sequelize, Sequelize);
const user_info = UserInfoModel(sequelize, Sequelize);
const classes = ClassesModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  console.log('-----------------------------------------------------');
});

module.exports = { User, user_info, classes };
