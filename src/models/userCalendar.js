module.exports = (sequelize, type) => sequelize.define('user_calendar', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idCalendar: {
      type: type.STRING,
      allowNull: false,
    },
    idUser: {
      type: type.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'user_calendar',
    timestamps: true,
  });