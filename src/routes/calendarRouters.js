const mysql = require("mysql");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const {
  Calendar,
  UserCalendar,
  UserInfo,
  PointUserSubject,
  SubjectCalendar,
} = require("../sequelize");

const jwt = require("jsonwebtoken");
const accessTokenSecret = "yourSecretKey";
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
  const subjectUser = await PointUserSubject.findAll({
    where: { idUser: req.user.user.idUser },
  });
  const allSubject = await Promise.all(
    subjectUser?.map(async (item) => {
      const calendar = await SubjectCalendar.findAll({
        where: {
          idSubject: item.dataValues.idSubject,
        },
      });
      return calendar?.length > 0
        ? calendar?.map((item) => item.dataValues)
        : null;
    })
  );

  const allCalendar = await Promise.all(
    allCalendarId
      ?.map((item) => item.dataValues)
      ?.concat(_.compact(allSubject))
      .flatMap((item) => item)
      ?.map(async (item) => {
        const calendar = await Calendar.findOne({
          where: {
            idCalendar: item.idCalendar,
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
    const { name, time, type, status } = req.body;
    const idCalendar = uuidv4();
    UserCalendar.create({
      idUser: req.user.user.idUser,
      idCalendar,
    });
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
    });
  }
};

exports.deleteCalendar = async (req, res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  const userPermisson = await UserInfo.findOne({
    where: { idUser: req.user.user.idUser },
  });
  if (userPermisson?.dataValues?.permissionId === 3) {
    const userCalendar = await UserCalendar.findOne({
      where: { idUser: req.user.user.idUser, idCalendar: req.body.idCalendar },
    });
    if (userCalendar !== null) {
      const calendar = await Calendar.findOne({
        where: { idCalendar: req.body.idCalendar },
      });
      userCalendar.destroy().then(() =>
        calendar.destroy().then(() => {
          res.status(200).json({
            message: "Thành công!",
            status: 200,
          });
        })
      );
    } else  res.status(400).json({
      message: "Không thể xóa lịch!",
      status: 400,
    });
  } else if (userPermisson?.dataValues?.permissionId !== 3) {
      const subjectCalendar = await SubjectCalendar.findOne({
        where: { idCalendar: req.body.idCalendar },
      });
      const userCalendar = await UserCalendar.findOne({
        where: { idUser: req.user.user.idUser, idCalendar: req.body.idCalendar },
      });
      const calendar = await Calendar.findOne({
        where: { idCalendar: req.body.idCalendar },
      });
      if(subjectCalendar){
        subjectCalendar.destroy().then(() =>
        calendar.destroy().then(() => {
          res.status(200).json({
            message: "Thành công!",
            status: 200,
          });
        })
      );
      }
      else if(userCalendar){
        userCalendar.destroy().then(() =>
        calendar.destroy().then(() => {
          res.status(200).json({
            message: "Thành công!",
            status: 200,
          });
        })
      );
      }
      else  res.status(400).json({
        message: "Không thể xóa lịch!",
        status: 400,
      });
   
  } else {
    res.status(400).json({
      message: "Lỗi, không xác định được tài khoản!",
      status: 400,
    });
  }
};

exports.updateCalendar = async (req, res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  const userPermisson = await UserInfo.findOne({
    where: { idUser: req.user.user.idUser },
  });
  if (userPermisson?.dataValues?.permissionId === 3) {
    const userCalendar = await UserCalendar.findOne({
      where: { idUser: req.user.user.idUser, idCalendar: req.body.idCalendar },
    });
    
    if (userCalendar !== null) {
      const { name, time, type, status } = req.body;
      const calendar = await Calendar.findOne({
        where: { idCalendar: req.body.idCalendar },
      });
      
        calendar.update({
          name,
          time,
          type,
        }).then((data) => {
          res.status(200).json({
            message: "Thành công!",
            data: data,
            status: 200,
          });
        })
    
    } else  res.status(400).json({
      message: "Không thể cập nhập lịch!",
      status: 400,
    });
  } else if (userPermisson?.dataValues?.permissionId !== 3) {
    const { name, time, type, status } = req.body;
    const calendar = await Calendar.findOne({
      where: { idCalendar: req.body.idCalendar },
    });
      calendar.update({
        name,
        time,
        type,
      }).then((data) => {
        res.status(200).json({
          message: "Thành công!",
          data: data,
          status: 200,
        });
      })
  } else {
    res.status(400).json({
      message: "Lỗi, không xác định được tài khoản!",
      status: 400,
    });
  }
};

exports.createACalendarSubject = async (req, res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });

  const userPermisson = await UserInfo.findOne({
    where: { idUser: req.user.user.idUser },
  });
  if (userPermisson?.dataValues?.permissionId === 3) {
     res.status(400).json({
      message: "Bạn không có quyền tạo lịch cho môn học!",
      status: 400,
    });
  } else if (userPermisson?.dataValues?.permissionId !== 3) {
    const { name, time, type, status, idSubject } = req.body;
    console.log(name, time, type, status, idSubject)
    const idCalendar = uuidv4();
    SubjectCalendar.create({
      idSubject,
      idCalendar,
    });
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
    });
  } else {
    res.status(400).json({
      message: "Lỗi, không xác định được tài khoản!",
      status: 400,
    });
  }
};