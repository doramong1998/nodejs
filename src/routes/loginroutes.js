// import User from '../sequelize';

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { User, UserInfo } = require("../sequelize");
require("dotenv").config();
const accessTokenSecret = "yourSecretKey";
const saltRounds = 10;

const connection = mysql.createConnection({
  host: "localhost",
  user: "tranquanghuy",
  password: "123456",
  database: "database",
  port: 3306,
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
exports.register = async (req, res) => {
  if (
    req.body.username === "" ||
    req.body.email === "" ||
    req.body.password === ""
  ) {
    res.status(400).send("Các trường không được để trống");
  }
  const { password } = req.body;
  const encryptedPassword = await bcrypt
    .hash(password, saltRounds)
    .catch((e) => {
      throw e;
    });
  const users = {
    username: req.body.username,
    password: encryptedPassword,
    email: req.body.email,
  };

  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user == null) {
      User.create({
        idUser: uuidv4(),
        username: users.username,
        email: users.email,
        password: users.password,
        state: true,
      }).then(() => {
        res.status(201).json({
          message: "Tạo tài khoản thành công!",
          status: 201,
        });
      });
    } else {
      res.status(404).json({
        message: "Tài khoản đã tồn tại!",
        status: 404,
      });
    }
  });
};
// eslint-disable-next-line func-names
exports.login = async function (req, res, err) {
  const userLogin = {
    username: req.body.username,
    password: req.body.password,
  };
  const user = await User.findOne({
    where: {
      username: userLogin.username,
    },
  });
  const userInfo = await UserInfo.findOne({
    where: {
      username: userLogin.username,
    },
  });
  if (user == null || !userInfo?.status) {
    res.status(400).json({
      message: "Tài khoản hoặc mật khẩu không đúng",
      status: 400,
    });
  } else {
    const comparision = await bcrypt.compare(userLogin.password, user.password);
    if (comparision) {
      const accessToken = jwt.sign({ user }, accessTokenSecret, {
        expiresIn: "24h",
      });
      res.json({
        id: user.id,
        accessToken,
        permissionId: userInfo?.permissionId.toString(),
        message: "Đăng nhập thành công!",
      });
    } else {
      res.status(400).json({
        message: "Tài khoản hoặc mật khẩu không đúng",
        status: 400,
      });
    }
  }
};
exports.forgot = async function forgot(req, res) {
  if (req.body.email === "") {
    res.status(400).send("Email required");
  }
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user === null) {
      // eslint-disable-next-line no-console
      console.error("Email not in database");
      res.status(403).send("Email not in database");
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 360000,
      });
      const mailHost = "smtp.gmail.com";
      const mailPort = 587;
      const user123 = "minhlaso1hay2@gmail.com";
      const pass123= "huy123456";
      console.log("user",user123);
      console.log("123123", pass123);
      const transporter = nodemailer.createTransport({
        // host: mailHost,
        // port: mailPort,
        // secure: false,
        service: 'gmail',
        auth: {
          // user: `${process.env.EMAIL_ADDRESS}`,
          // pass: `${process.env.EMAIL_PASSWORD}`,
          user: user123,
          pass: pass123
        },
      });
      const mailOptions = {
        from:  "minhlaso1hay2@gmail.com",
        to: `${user.email}`,
        subject: "Link to Reset",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
          `http://localhost:3000/reset/${token}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };
      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          // eslint-disable-next-line no-console
          res.status(400).send("Email is not exists!");
          // eslint-disable-next-line no-console
          console.error("There was an error.", err);
        } else {
          // eslint-disable-next-line no-console
          console.log("here is the res", response);
          res.status(200).json("recovery email sent");
        }
      });
    }
  });
};
// eslint-disable-next-line func-names
exports.getAll = async function (req, res) {
  const user = await User.findAll({});
  res.json({
    user,
    message: "Thành công!",
  });
};

// eslint-disable-next-line func-names
exports.get = async function (req, res) {
  const user = await User.findOne({
    where: { id: req.params.id },
  });
  // eslint-disable-next-line no-console
  console.log("id", req.params.id);
  res.json({
    user,
    message: "Thành công!",
  });
};
// eslint-disable-next-line func-names
exports.reset = async function (req, res) {
  const user = await User.findOne({
    where: {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        [Op.gt]: Date.now(),
      },
    },
  });
  if (user == null) {
    res.status(400).json("password reset link is invalid or has expired");
  } else if (user != null) {
    bcrypt
      .hash(req.body.password, saltRounds)
      .then((hashedPassword) => {
        user.update({
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        });
      })
      .then(() => {
        res.status(200).json("password updated");
      });
  } else {
    res.status(401).json("no user exists in db to update");
  }
};
// eslint-disable-next-line func-names
exports.update = async function (req, res) {
  const user = await User.findOne({
    where: { email: req.body.email },
  });
  if (user == null) {
    res.status(400).json("Login again and update.");
  } else if (user != null) {
    bcrypt
      .hash(req.body.password, saltRounds)
      .then((hashedPassword) => {
        user.update({
          password: hashedPassword,
        });
      })
      .then(() => {
        res.status(200).json("User updated");
      });
  } else {
    res.status(401).json("no user exists in db to update");
  }
};
exports.update1 = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
  });
  if (user == null) {
    res.status(400).json("Not in database.");
  } else {
    const findEmail = await User.findOne({
      where: { email: req.body.email },
    });
    if (findEmail !== null && user.email !== req.body.email) {
      res.status(400).json("Email update have exists in database.");
    } else {
      user.update({
        username: req.body.username,
        email: req.body.email,
      });
      res.status(200).json({
        user,
        message: "Successfull.",
      });
    }
  }
};

exports.updateState = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (user === null) {
    res.status(400).send("User not in database.");
  } else {
    // eslint-disable-next-line no-unused-expressions
    req.body.state === "Active"
      ? user.update({
          state: "Deactive",
        })
      : user.update({
          state: "Active",
        });

    res.status(200).json({
      user,
      message: "Ok",
    });
  }
};
