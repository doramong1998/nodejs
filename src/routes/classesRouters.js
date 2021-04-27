const mysql = require("mysql");
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
  ClassFile,
  Files
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
            permissionId: 3,
          },
        });
        return user?.dataValues;
      })
    );
    const newClass = {
      ...classes.dataValues,
      teacher: teacher.dataValues,
      students: _.compact(newDataUser),
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
    const userInfo = await UserInfo.findOne({
      where: { idUser: idUser },
    });
    userInfo.update({
      idClass,
    });
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

exports.changeTeacherClass = async (req, res) => {
  const { idUser, idClass } = req.body;
  const userClass = await UserClass.findOne({
    where: { idUser: idUser },
  });
  if (userClass != null) {
    const classes = await Classes.findOne({
      where: { idClass: idClass },
    });
    classes.update({
      idTeacher: idUser,
    });
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
    const classes = await Classes.findOne({
      where: { idClass: idClass },
    });
    classes.update({
      idTeacher: idUser,
    });
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
      error: "Không thể thêm giáo viên vào lớp!",
      status: 400,
    });
  }
};

exports.deleteStudentFromClass = async (req, res) => {
  const { idUser, idClass } = req.body;
  const userClass = await UserClass.findOne({
    where: { idUser: idUser, idClass: idClass },
  });
  if (userClass != null) {
    const userInfo = await UserInfo.findOne({
      where: { idUser: idUser },
    });
    userInfo.update({
      idClass: null,
    });
    userClass.destroy().then(() => {
      res.status(200).json({
        message: "Thành công!",
        status: 200,
      });
    });
  } else {
    res.status(400).json({
      error: "Sinh viên không ở trong lớp!",
      status: 400,
    });
  }
};

exports.getPointStudent = async (req, res) => {
  const { idUser } = req.body;
  const userPoint = await PointUserSubject.findAll({
    where: { idUser: idUser },
  });
  if (userPoint == null) {
    res.status(400).json({
      data: null,
      message: "Thành công!",
      status: 400,
    });
  } else {
    const allPoint = await Promise.all(
      userPoint?.map(async (item) => {
        const subjects = await Subjects.findOne({
          where: {
            idSubject: item.dataValues.idSubject,
          },
        });
        const point = await Point.findOne({
          where: {
            idPoint: item.dataValues.idPoint,
          },
        });
        const attend = await Attendance.findAll({
          where: {
            idUser: idUser,
            idSubject: item.dataValues.idSubject,
          },
        });
        return subjects
          ? {
              ...subjects.dataValues,
              point: { ...point?.dataValues, pointDiligence: attend },
            }
          : null;
      })
    );
    return res.status(200).json({
      message: "Thành công!",
      data: _.compact(allPoint),
      status: 200,
    });
  }
};

exports.getClassByStudent = async (req, res) => {
  const userPoint = await PointUserSubject.findAll({
    where: { idUser: req.body.idUser },
  });
  const allClass = await Promise.all(
    userPoint?.map(async (item) => {
      const subjects = await Subjects.findOne({
        where: {
          idSubject: item.dataValues.idSubject,
        },
      });
      return subjects;
    })
  );
  return res.status(200).json({
    message: "Thành công!",
    data: allClass,
    status: 200,
  });
};


exports.getClassByMe = async (req, res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  const userClass = await UserClass.findOne({
    where: { idUser: req.user.user.idUser },
  });
  const user = await UserInfo.findOne({
    where: { idUser: req.user.user.idUser },
  });
  const allUserClass = await UserClass.findAll({
    where: { idClass: userClass.dataValues.idClass },
  });

  const allStudentInClass = await Promise.all(
    allUserClass?.map(async (item) => {
      const student = await UserInfo.findOne({
        where: {
          idUser: item.dataValues.idUser,
          permissionId: 3
        },
      });
      return student;
    })
  );

  const classes = await Classes.findOne({
    where: {idClass: userClass.dataValues.idClass}
  })
  const teacher = await UserInfo.findOne({
    where: {idUser: classes.dataValues.idTeacher}
  })
  const classFile = await ClassFile.findAll({
    where: { idClass: userClass.dataValues.idClass }
  })
  const newData = await Promise.all(
    classFile?.map(async (item) => {
      const file = await Files.findOne({
        where: {
          idFile: item.dataValues.idFile,
        },
      });
      return file?.dataValues;
    })
  );
  return res.status(200).json({
    message: "Thành công!",
    data: {
      user,
      class: { ...classes.dataValues, students: _.compact(allStudentInClass)},
      teacher,
      listFile:  _.compact(newData) 
    },
    status: 200,
  });
};

