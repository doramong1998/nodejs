const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const {
  Calendar, UserCalendar, UserInfo
} = require("../sequelize");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const accessTokenSecret = "yourSecretKey";
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

exports.getCalendarByMe = async (req, res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  const allCalendarId = await UserCalendar.findAll({
    where: { idUser: req.user.user.idUser },
  });

  const allCalendar = await Promise.all(
    allCalendarId?.map(async (item) => {
      const calendar = await Calendar.findOne({
        where: {
          idCalendar: item.dataValues.idCalendar,
        },
      });
      return calendar;
    })
  );

  return res.status(200).json({
    message: "Thành công!",
    data: allCalendar,
    status: 200,
  });
};

exports.createCalendar = async (req, res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  if (
    !req.body.name ||
    !req.body.time ||
    !req.body.type ||
    req.body.name === "" ||
    req.body.time === "" ||
    req.body.type === "" 
  ) {
    res.status(400).json({
      error: "Chưa điền đầy đủ thông tin!",
      status: 400,
    });
  } else {
    const {
     name, time, type, status
    } = req.body;
        const idCalendar = uuidv4()
        UserCalendar.create({
          idUser: req.user.user.idUser,
          idCalendar,
        })
        Calendar.create({
          idCalendar,
          name,
          time,
          type,
          status: status || true,
        }).then((data) => {
          return res.status(200).json({
            message: "Thành công!",
            data,
            status: 200,
          });
        } )
      }
};