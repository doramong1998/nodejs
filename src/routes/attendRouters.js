const mysql = require("mysql");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const {
  Classes,
  UserInfo,
  UserClass,
  PointUserSubject,
  Point,
  Subjects,
  Attendance,
} = require("../sequelize");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "database",
  port: 3336
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

exports.getAttendSubject = async (req, res) => {
  const { date, idSubject } = req.body;
  const allIdUser = await PointUserSubject.findAll({
    where: {
      idSubject: idSubject,
    },
  });
  const newData = await Promise.all(
    allIdUser?.map(async (item) => {
      const user = await UserInfo.findOne({
        where: {
          idUser: item.dataValues.idUser,
          permissionId: 3,
        },
      });

      const attend = await Attendance.findOne({
        where: {
          idUser: item.dataValues.idUser,
          date: date,
          idSubject: idSubject,
        },
      });

      return user?.dataValues ? { ...user?.dataValues, attend: attend } : null;
    })
  );
  res.json({
    data: _.compact(newData),
    message: "Thành công!",
    status: 200,
  });
};

exports.postAttendSubject = async (req, res) => {
  const { date, idSubject, idUser, value } = req.body;
  const attend = await Attendance.findOne({
    where: {
      idUser: idUser,
      date: date,
      idSubject: idSubject,
    },
  });
  if (attend != null) {
    attend
      .update({
        value: value,
      })
      .then(() => {
        res.json({
          message: `${value ? "Điểm danh" : "Hủy điểm danh"} thành công!`,
          status: 200,
        });
      })
      .catch(() => {
        res.status(404).json({
          message: "Có lỗi xảy ra, vui lòng thử lại!",
          status: 404,
        });
      });
  }
  if (attend == null) {
    Attendance.create({
      idUser: idUser,
      idSubject: idSubject,
      date: date,
      value: true,
    })
      .then(() => {
        res.json({
          message: "Điểm danh thành công!",
          status: 200,
        });
      })
      .catch(() => {
        res.status(404).json({
          message: "Có lỗi xảy ra, vui lòng thử lại!",
          status: 404,
        });
      });
  }
};
