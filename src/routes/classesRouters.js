// import User from '../sequelize';

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const { Classes, UserInfo, UserClass } = require("../sequelize");
require("dotenv").config();
const accessTokenSecret = "yourSecretKey";
const saltRounds = 10;

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

exports.getClass = async (req, res) => {
  const data = await Classes.findAll({});
  const newData = await Promise.all(
    data?.map(async (item) => {
      const teacher = await UserInfo.findOne({
        where: {
          idUser: item.dataValues.idTeacher,
        },
      });
      return { ...item.dataValues, teacher: teacher?.dataValues };
    })
  );
  res.json({
    data: newData,
    message: "Thành công!",
    status: 200,
  });
};

exports.createClass = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.idTeacher ||
    req.body.name === "" ||
    req.body.idTeacher === ""
  ) {
    res.status(400).json({
      error: "Tên lớp học và giáo viên là bắt buộc!",
      status: 400,
    });
  } else {
    const {
      name,
      idTeacher,
      files,
      status,
      studentNum,
      totalStudent,
    } = req.body;
    Classes.findOne({
      where: {
        name: req.body.name,
      },
    }).then((classes) => {
      if (classes == null) {
        Classes.create({
          idClass: uuidv4(),
          name,
          idTeacher,

          files,
          studentNum,
          status,
          totalStudent,
        }).then((data) => {
          res.status(201).json({
            data,
            message: "Thành công!",
            status: 200,
          });
        });
      } else {
        res.status(404).json({
          message: "Lớp đã tồn tại!",
          status: 404,
        });
      }
    });
  }
};

exports.updateClass = async (req, res) => {
  const { name, idTeacher, files, status, studentNum, totalStudent } = req.body;
  const classes = await Classes.findOne({
    where: { id: req.params.id },
  });
  if (classes == null) {
    res.status(400).json({
      message: "Lớp học không tồn tại!",
      status: 400,
    });
  } else if (classes != null) {
    if (!name || !idTeacher || name === "" || idTeacher === "") {
      res.status(400).json({
        error: "Tên lớp học và giáo viên là bắt buộc!",
        status: 400,
      });
    } else {
      classes
        .update({
          name,
          idTeacher,

          files,
          studentNum,
          status,
          totalStudent,
        })
        .then(() => {
          res.status(200).json({
            message: "Thành công!",
            status: 200,
          });
        });
    }
  } else {
    res.status(400).json({
      message: "Lớp học không tồn tại!",
      status: 400,
    });
  }
};

exports.deleteClass = async (req, res) => {
  const classes = await Classes.findOne({
    where: { id: req.body.id },
  });
  if (classes == null) {
    res.status(400).json({
      message: "Lớp học không tồn tại!",
      status: 400,
    });
  } else if (classes != null) {
    classes.destroy().then(() => {
      res.status(200).json({
        message: "Thành công!",
        status: 200,
      });
    });
  } else {
    res.status(400).json({
      message: "Lớp học không tồn tại!",
      status: 400,
    });
  }
};

exports.getDetailClass = async (req, res) => {
  const classes = await Classes.findOne({
    where: { id: req.params.id },
  });
  if (classes == null) {
    res.status(400).json({
      message: "Lớp học không tồn tại!",
      status: 400,
    });
  } else if (classes != null) {
    const teacher = await UserInfo.findOne({
      where: {
        idUser: classes.dataValues.idTeacher,
      },
    });
    const allIdUser = await UserClass.findAll({
      where: { idClass: classes.dataValues.idClass },
    });
    const newDataUser = await Promise.all(
      allIdUser?.map(async (item) => {
        const user = await UserInfo.findOne({
          where: {
            idUser: item.dataValues.idUser,
          },
        });
        return user?.dataValues;
      })
    );

    const newClass = {
      ...classes.dataValues,
      teacher: teacher.dataValues,
      students: newDataUser,
    };
    return res.status(200).json({
      message: "Thành công!",
      data: newClass,
      status: 200,
    });
  }
};

exports.addStudentToClass = async (req, res) => {
  const { idUser, idClass } = req.body;
  const userClass = await UserClass.findOne({
    where: { idUser: idUser },
  });
  if (userClass != null) {
    userClass
      .update({
        idClass,
      })
      .then(() => {
        res.status(200).json({
          message: "Thành công!",
          status: 200,
        });
      });
  } else if (userClass == null) {
    UserClass.create({
      idUser,
      idClass,
    }).then(() => {
      res.status(200).json({
        message: "Thành công!",
        status: 200,
      });
    });
  } else {
    res.status(400).json({
      error: "Sinh viên đã ở trong lớp!",
      status: 400,
    });
  }
};
