// import User from '../sequelize';

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { Files } = require("../sequelize");

require("dotenv").config();
const accessTokenSecret = "yourSecretKey";
var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "huy12312312a",
  api_key: "939978951671685",
  api_secret: "6ytwQMsjyxJcZKUzd662tLZb-_o",
});

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

exports.uploadFile = async (req, res, next) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  cloudinary.uploader
    .upload(req.file.path, { resource_type: "auto" })
    .then((result) => {
      Files.create({
        idFile: uuidv4(),
        name: req.file.originalname,
        type: req.file.mimetype,
        url: result.url,
        idUser: req.user.user.idUser,
        status: true,
      }).then((data) => {
        res.status(201).json({
          data,
          message: "Thành công!",
          status: 200,
        });
      });
    });
};

exports.getFile = async (req, res, next) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  const listFile = await Files.findAll({
    where: {
      idUser: req.user.user.idUser,
    },
  });
  res.status(200).json({
    message: "Thành công!",
    data: listFile,
    status: 200,
  });
};

