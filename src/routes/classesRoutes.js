// import User from '../sequelize';

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { classes } = require("../sequelize");
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
  const data = await classes.findAll({});
  res.json({
    data,
    message: "Thành công!",
    status: 200,
  });
};

exports.createClass = async (req, res) => {
  if (!req.body.className || !req.body.idTeacher ||req.body.className === "" || req.body.idTeacher === "") {
    res.status(400).json({
      error: "Tên lớp học và giáo viên là bắt buộc!",
      status: 400,
    });
  }
  const { className, idTeacher, students, files, status } = req.body;
  classes.create({
    idClass: uuidv4(),
    className,
    idTeacher,
    students,
    files,
    status: status ? status : true
  }).then((data) => {
    res.status(201).json({
      data,
      message: "Thành công!",
      status: 200,
    });;
  });
};
