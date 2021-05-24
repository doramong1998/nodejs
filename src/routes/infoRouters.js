// import User from '../sequelize';
require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { UserInfo, User, UserClass } = require("../sequelize");

const accessTokenSecret = "yourSecretKey";
const saltRounds = 10;
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

exports.getInfoUser = async (req, res) => {
  const data = await UserInfo.findAll({});
  res.json({
    data,
    message: "Thành công!",
    status: 200,
  });
};

exports.createInfoUser = async (req, res) => {
  if (
    !req.body.fullName ||
    !req.body.username ||
    !req.body.password ||
    req.body.fullName === "" ||
    req.body.username === "" ||
    req.body.password === ""
  ) {
    res.status(400).json({
      error: "Tên, tài khoản, hoặc mật khẩu không được để trống!",
      status: 400,
    });
  } else {
    const {
      fullName,
      gender,
      dob,
      idClass,
      studentId,
      address,
      phone,
      email,
      username,
      password,
      permissionId,
      avatar,
      status,
    } = req.body;
    const encryptedPassword = await bcrypt
      .hash(password, saltRounds)
      .catch((e) => {
        throw e;
      });
    User.findOne({
      where: {
        username: req.body.username,
      },
    }).then((user) => {
      if (user == null) {
        const idUser = uuidv4();
        UserInfo.create({
          idUser,
          fullName,
          gender,
          dob,
          idClass,
          studentId,
          address,
          phone,
          email,
          permissionId,
          avatar,
          username,
          status,
        }).then((data) => {
          UserClass.create({
            idUser,
            idClass,
          });
          User.create({
            idUser,
            username,
            email,
            password: encryptedPassword,
            state: true,
          }).then(() => {
            res.status(201).json({
              message: "Tạo tài khoản thành công!",
              status: 201,
            });
          });
        });
      } else {
        res.status(400).json({
          error: "Tên đăng nhập đã tồn tại!",
          status: 400,
        });
      }
    });
  }
};

exports.updateInfoUser = async (req, res) => {
  const {
    fullName,
    gender,
    dob,
    idClass,
    studentId,
    address,
    phone,
    email,
    permissionId,
    avatar,
    status,
  } = req.body;
  const userInfo = await UserInfo.findOne({
    where: { id: req.params.id },
  });
  if (userInfo == null) {
    res.status(400).json({
      error: "Tài khoản không tồn tại!",
      status: 400,
    });
  } else if (userInfo != null) {
    const userClass = await UserClass.findOne({
      where: { idUser: userInfo.idUser },
    });
    if (userClass == null) {
      UserClass.create({
        idUser: userInfo.idUser,
        idClass,
      });
    } else {
      userClass.update({
        idClass,
      });
    }
    userInfo
      .update({
        fullName,
        gender,
        dob,
        idClass,
        studentId,
        address,
        phone,
        email,
        permissionId,
        avatar,
        status,
      })
      .then(() => {
        res.status(200).json({
          message: "Thành công!",
          status: 200,
        });
      });
  } else {
    res.status(400).json({
      error: "Tài khoản không tồn tại!",
      status: 400,
    });
  }
};

exports.deleteInfoUser = async (req, res) => {
  const userInfo = await UserInfo.findOne({
    where: { id: req.body.id },
  });
  if (userInfo == null) {
    res.status(400).json({
      error: "Tài khoản không tồn tại!",
      status: 400,
    });
  } else if (userInfo != null) {
    const user = await User.findOne({
      where: { idUser: userInfo.dataValues.idUser },
    });
    user.destroy().then(() =>
      userInfo.destroy().then(() => {
        res.status(200).json({
          message: "Thành công!",
          status: 200,
        });
      })
    );
  } else {
    res.status(400).json({
      error: "Tài khoản không tồn tại!",
      status: 400,
    });
  }
};

exports.getMe = async (req, res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  const userInfo = await UserInfo.findOne({
    where: {
      idUser: req.user.user.idUser,
    },
  });
  res.status(200).json({
    message: "Thành công!",
    data: userInfo,
    status: 200,
  });
};

exports.updateMe = async (req, res) => {
  const {
    fullName,
    gender,
    dob,
    idClass,
    studentId,
    address,
    phone,
    email,
    avatar,
  } = req.body;
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  const userInfo = await UserInfo.findOne({
    where: {
      idUser: req.user.user.idUser,
    },
  });
  if (userInfo == null) {
    res.status(400).json({
      error: "Tài khoản không tồn tại!",
      status: 400,
    });
  } else if (userInfo != null) {
    const userClass = await UserClass.findOne({
      where: { idUser: req.user.user.idUser },
    });
    if (userClass == null) {
      UserClass.create({
        idUser: req.user.user.idUser,
        idClass,
      });
    } else {
      userClass.update({
        idClass,
      });
    }
    userInfo
      .update({
        fullName,
        gender,
        dob,
        idClass,
        studentId,
        address,
        phone,
        email,
        avatar,
      })
      .then(() => {
        res.status(200).json({
          message: "Thành công!",
          status: 200,
        });
      });
  } else {
    res.status(400).json({
      error: "Tài khoản không tồn tại!",
      status: 400,
    });
  }
};

exports.getTeacher = async (req, res) => {
  const data = await UserInfo.findAll({
    where: {
      permissionId: 2,
    },
  });
  res.status(200).json({
    message: "Thành công!",
    data,
    status: 200,
  });
};

exports.getStudent = async (req, res) => {
  const data = await UserInfo.findAll({
    where: {
      permissionId: 3,
    },
  });
  res.status(200).json({
    message: "Thành công!",
    data,
    status: 200,
  });
};
