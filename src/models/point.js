module.exports = (sequelize, type) =>
  sequelize.define(
    "point",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idPoint: {
        type: type.STRING,
        allowNull: false,
      },
      pointDiligence: {
        type: type.FLOAT,
      },
      pointMidTerm: {
        type: type.FLOAT,
      },
      pointEndTerm: {
        type: type.FLOAT,
      },
    },
    {
      tableName: "point",
      timestamps: true,
    }
  );
