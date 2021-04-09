const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const { PointUserSubject, Point } = require("../sequelize");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "tranquanghuy",
  password: "123456",
  database: "database",
});

connection.connect((err) => {
  if (!err) {
    // eslint-disable-next-line no-console
    console.log("Database is connected ... nn");
  } else {
    // eslint-disable-next-line no-console
    console.log(err, "Error connecting database ... nn", err);
  }
});

exports.updatePoint = async (req, res) => {
  const {
    idPoint,
    pointDiligence,
    pointMidTerm,
    pointEndTerm,
    idUser,
    idSubject,
  } = req.body;
  if (idPoint) {
    const point = await Point.findOne({
      where: {
        idPoint: idPoint,
      },
    });
    if (point != null) {
      point
        .update({
          pointDiligence,
          pointMidTerm,
          pointEndTerm,
        })
        .then((data) => {
          res.status(200).json({
            data,
            message: "Thành công!",
            status: 200,
          });
        });
    }
  } else {
    const newIdPoint = uuidv4();
    const userPoint = await PointUserSubject.findOne({
      where: {
        idUser,
        idSubject,
      },
    });
    if (userPoint != null) {
      userPoint.update({
        idPoint: newIdPoint,
      });
      Point.create({
        idPoint: newIdPoint,
        pointDiligence,
        pointMidTerm,
        pointEndTerm,
      }).then((data) => {
        res.status(200).json({
          data,
          message: "Thành công!",
          status: 200,
        });
      });
    } else {
      PointUserSubject.create({
        idUser,
        idSubject,
        idPoint: newIdPoint,
      });
      Point.create({
        idPoint: newIdPoint,
        pointDiligence,
        pointMidTerm,
        pointEndTerm,
      }).then((data) => {
        res.status(200).json({
          data,
          message: "Thành công!",
          status: 200,
        });
      });
    }
  }
};
