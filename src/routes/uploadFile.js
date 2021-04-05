// import User from '../sequelize';

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { Files } = require("../sequelize");
const Minio = require("minio");
require("dotenv").config();
const accessTokenSecret = "yourSecretKey";
// var cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: "huy12312312a",
//   api_key: "939978951671685",
//   api_secret: "6ytwQMsjyxJcZKUzd662tLZb-_o",
// });

var minioClient = new Minio.Client({
  endPoint: "minio.hisoft.com.vn",
  port: 443,
  useSSL: true,
  accessKey: "FKjV60DxexBajLfTkpTmxBE3PGbYmEon",
  secretKey: "7B3E7EB4F2796",
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
  var metaData = {
    "Content-Type": req.file.mimetype,
  };
  minioClient.fPutObject(
    "huytq",
    req.file.originalname,
    req.file.path,
    metaData,
    function (error, etag) {
      if (error) {
        return res.status(400).json({
          error: "Có lỗi xảy ra!",
          status: 400,
        });
      }
      minioClient.presignedGetObject(
        "huytq",
        req.file.originalname,
        7 * 24 * 60 * 60,
        function (err, presignedUrl) {
          if (err)
            return res.status(400).json({
              error: "Có lỗi xảy ra!",
              status: 400,
            });
          else {
            Files.create({
              idFile: uuidv4(),
              name: req.file.originalname,
              type: req.file.mimetype,
              url: presignedUrl,
              idUser: req.user.user.idUser,
              status: true,
            }).then((data) => {
              res.status(201).json({
                data,
                message: "Thành công!",
                status: 200,
              });
            });
          }
        }
      );
    }
  );
  // if (req.file.mimetype === "application/pdf") {
  //   console.log("up raw");
  //   cloudinary.uploader
  //     .upload(req.file.path, { resource_type: "raw" })
  //     .then((result) => {
  //       Files.create({
  //         idFile: uuidv4(),
  //         name: req.file.originalname,
  //         type: req.file.mimetype,
  //         url: result.url,
  //         idUser: req.user.user.idUser,
  //         status: true,
  //       }).then((data) => {
  //         res.status(201).json({
  //           data,
  //           message: "Thành công!",
  //           status: 200,
  //         });
  //       });
  //     });
  // } else
  //   cloudinary.uploader
  //     .upload(req.file.path, { resource_type: "auto" })
  //     .then((result) => {
  //       Files.create({
  //         idFile: uuidv4(),
  //         name: req.file.originalname,
  //         type: req.file.mimetype,
  //         url: result.url,
  //         idUser: req.user.user.idUser,
  //         status: true,
  //       }).then((data) => {
  //         res.status(201).json({
  //           data,
  //           message: "Thành công!",
  //           status: 200,
  //         });
  //       });
  //     });
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

exports.addExpiredFile = async (req, res) => {
  const file = await Files.findOne({
    where: {
      id: req.body.id,
    },
  });
  minioClient.presignedGetObject(
    "huytq",
    file.name,
    7 * 24 * 60 * 60,
    function (err, presignedUrl) {
      if (err)
        return res.status(400).json({
          error: "Có lỗi xảy ra!",
          status: 400,
        });
      else {
        file
          .update({
            url: presignedUrl,
          })
          .then((data) => {
            return res.status(201).json({
              data,
              message: "Gia hạn thành công!",
              status: 200,
            });
          });
      }
    }
  );
};
