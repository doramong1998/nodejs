// import User from '../sequelize';
require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { Files, UserFile, FileSubjects, ClassFile, UserInfo } = require("../sequelize");
const Minio = require("minio");

const accessTokenSecret = "yourSecretKey";
const fs = require("fs");
const VirusTotalApi = require("virustotal-api");
// var cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: "huy12312312a",
//   api_key: "939978951671685",
//   api_secret: "6ytwQMsjyxJcZKUzd662tLZb-_o",
// });
const virusTotal = new VirusTotalApi(
  "51048b28ab891f17a50c22327a4d2414fe42f65d568a0a168712e204de2d975a"
);

var minioClient = new Minio.Client({
  endPoint: "minio.hisoft.com.vn",
  port: 443,
  useSSL: true,
  accessKey: "FKjV60DxexBajLfTkpTmxBE3PGbYmEon",
  secretKey: "7B3E7EB4F2796",
});
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
  virusTotal
    .fileScan(req.file, req.file.originalname)
    .then((response) => {
      let resource = response.resource;
      virusTotal.fileReport(resource).then((result) => {
        if (result.positives > 0) {
          res.status(400).json({
            message: "File có nguy cơ chứa mã độc/virus, hủy tải lên!",
            status: 400,
          });
        } else {
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
                    const idFile = uuidv4();
                    UserFile.create({
                      idFile,
                      idUser: req.user.user.idUser,
                    });
                    Files.create({
                      idFile,
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
        }
      });
    })
    .catch((err) =>
      res.status(400).json({
        message: "Có lỗi xảy ra, vui lòng thử lại!",
        status: 400,
      })
    );
};

exports.uploadFileSubject = async (req, res, next) => {
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
  virusTotal
    .fileScan(req.file, req.file.originalname)
    .then((response) => {
      let resource = response.resource;
      virusTotal.fileReport(resource).then((result) => {
        if (result.positives > 0) {
          res.status(400).json({
            message: "File có nguy cơ chứa mã độc/virus, hủy tải lên!",
            status: 400,
          });
        } else {
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
                    const idFile = uuidv4();
                    FileSubjects.create({
                      idFile,
                      idSubject: req.body.idSubject,
                    });
                    Files.create({
                      idFile,
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
        }
      });
    })
    .catch((err) =>
      res.status(400).json({
        message: "Có lỗi xảy ra, vui lòng thử lại!",
        status: 400,
      })
    );
};

exports.uploadFileClass = async (req, res, next) => {
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
  virusTotal
    .fileScan(req.file, req.file.originalname)
    .then((response) => {
      let resource = response.resource;
      virusTotal.fileReport(resource).then((result) => {
        if (result.positives > 0) {
          res.status(400).json({
            message: "File có nguy cơ chứa mã độc/virus, hủy tải lên!",
            status: 400,
          });
        } else {
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
                    const idFile = uuidv4();
                    ClassFile.create({
                      idFile,
                      idClass: req.body.idClass,
                    });
                    Files.create({
                      idFile,
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
        }
      });
    })
    .catch((err) =>
      res.status(400).json({
        message: "Có lỗi xảy ra, vui lòng thử lại!",
        status: 400,
      })
    );
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

exports.deleteFile = async (req, res) => {
  const data = await Files.findOne({
    where: { idFile: req.params.id },
  });
  if (data == null) {
    res.status(400).json({
      message: "File không tồn tại!",
      status: 400,
    });
  } else if (data != null) {
    data.destroy().then(() => {
      res.status(200).json({
        message: "Thành công!",
        status: 200,
      });
    });
  } else {
    res.status(400).json({
      message: "File không tồn tại!",
      status: 400,
    });
  }
};

exports.deleteFileClass = async (req, res) => {
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
  if(userPermisson?.dataValues?.permissionId === 3){
    const file = await Files.findOne({
      where: { idFile: req.body.idFile},
    });
    if (file == null) {
    res.status(400).json({
      message: "File không tồn tại!",
      status: 400,
    });
    } else {
      if(file?.dataValues?.idUser === req.user.user.idUser){
        const data = await ClassFile.findOne({
          where: { idFile: req.body.idFile, idClass: req.body.idClass },
        });
        file.destroy().then(() =>  data.destroy().then(() => {
          res.status(200).json({
            message: "Thành công!",
            status: 200,
          });
        }) )
      } else {
        res.status(400).json({
          message: "Bạn không có quyền xóa file này!",
          status: 400,
        });
      }
  } 

  } else if (userPermisson?.dataValues?.permissionId !== 3) {
    const file = await Files.findOne({
      where: { idFile: req.body.idFile},
    });
    if (file == null) {
    res.status(400).json({
      message: "File không tồn tại!",
      status: 400,
    });
    } else {
    const data = await ClassFile.findOne({
      where: { idFile: req.body.idFile, idClass: req.body.idClass },
    });
    file.destroy().then(() =>  data.destroy().then(() => {
      res.status(200).json({
        message: "Thành công!",
        status: 200,
      });
    }) )
  }}  else {
      res.status(400).json({
        message: "Lỗi, không xác định được tài khoản!",
        status: 400,
      });
    }
};

exports.deleteFileSubject = async (req, res) => {
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
  if(userPermisson?.dataValues?.permissionId === 3){
    const file = await Files.findOne({
      where: { idFile: req.body.idFile},
    });
    if (file == null) {
    res.status(400).json({
      message: "File không tồn tại!",
      status: 400,
    });
    } else {
      if(file?.dataValues?.idUser === req.user.user.idUser){
        const data = await FileSubjects.findOne({
          where: { idFile: req.body.idFile, idSubject: req.body.idSubject },
        });
        file.destroy().then(() =>  data.destroy().then(() => {
          res.status(200).json({
            message: "Thành công!",
            status: 200,
          });
        }) )
      } else {
        res.status(400).json({
          message: "Bạn không có quyền xóa file này!",
          status: 400,
        });
      }
  } 

  } else if (userPermisson?.dataValues?.permissionId !== 3) {
    const file = await Files.findOne({
      where: { idFile: req.body.idFile},
    });
    if (file == null) {
      res.status(400).json({
        message: "File không tồn tại!",
        status: 400,
      });
      } else {
    const data = await FileSubjects.findOne({
      where: { idFile: req.body.idFile, idSubject: req.body.idSubject },
    });
    file.destroy().then(() =>  data.destroy().then(() => {
      res.status(200).json({
        message: "Thành công!",
        status: 200,
      });
    }) )
  }}  else {
      res.status(400).json({
        message: "Lỗi, không xác định được tài khoản!",
        status: 400,
      });
    }
};

exports.addExpiredFile = async (req, res) => {
  const file = await Files.findOne({
    where: {
      idFile: req.body.idFile,
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
            console.log(data);
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
