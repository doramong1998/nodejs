const mysql = require("mysql");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const {
  Subjects,
  UserInfo,
  PointUserSubject,
  Point,
  Attendance,
  FileSubjects,
  Files,
  SubjectCalendar,
  Calendar,
} = require("../sequelize");

const jwt = require("jsonwebtoken");
const accessTokenSecret = "yourSecretKey";
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

exports.getSubject = async (req, res) => {
  const data = await Subjects.findAll({});
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

exports.createSubject = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.code ||
    req.body.name === "" ||
    req.body.code === ""
  ) {
    res.status(400).json({
      error: "Tên môn học và mã môn học là bắt buộc!",
      status: 400,
    });
  } else {
    const {
      name,
      code,
      status,
      studentNum,
      totalStudent,
      idTeacher,
      calendar,
    } = req.body;
    Subjects.findOne({
      where: {
        name: req.body.name,
      },
    }).then(async (data) => {
      if (data == null) {
        const idSubject = uuidv4();
        await Promise.all(
          calendar?.map((item) => {
            Calendar.create({
              idCalendar: uuidv4(),
              name: item.name,
              time: item.time,
              type: item.type,
              status: item?.status || true,
            }).then((res) => {
              SubjectCalendar.create({
                idSubject,
                idCalendar: res.idCalendar,
              });
            });
          })
        );
        Subjects.create({
          idSubject,
          name,
          code,
          studentNum,
          status,
          idTeacher,
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

exports.updateSubject = async (req, res) => {
  const { name, code, idTeacher, status, studentNum, totalStudent } = req.body;
  const data = await Subjects.findOne({
    where: { id: req.params.id },
  });
  if (data == null) {
    res.status(400).json({
      message: "Môn học không tồn tại!",
      status: 400,
    });
  } else if (data != null) {
    if (!name || !code || name === "" || code === "") {
      res.status(400).json({
        error: "Tên môn học và mã môn học là bắt buộc!",
        status: 400,
      });
    } else {
      data
        .update({
          name,
          code,
          idTeacher,
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
      message: "Môn học không tồn tại!",
      status: 400,
    });
  }
};

exports.deleteSubject = async (req, res) => {
  const data = await Subject.findOne({
    where: { id: req.body.id },
  });
  if (data == null) {
    res.status(400).json({
      message: "Môn học không tồn tại!",
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
      message: "Môn học không tồn tại!",
      status: 400,
    });
  }
};

exports.getDetailSubject = async (req, res) => {
  const element = await Subjects.findOne({
    where: { id: req.params.id },
  });
  if (element == null) {
    res.status(400).json({
      message: "Lớp học không tồn tại!",
      status: 400,
    });
  } else if (element != null) {
    const teacher = await UserInfo.findOne({
      where: {
        idUser: element.dataValues.idTeacher,
      },
    });
    const allIdUser = await PointUserSubject.findAll({
      where: { idSubject: element.dataValues.idSubject },
    });

    const newDataUser = await Promise.all(
      allIdUser?.map(async (item) => {
        const user = await UserInfo.findOne({
          where: {
            idUser: item.dataValues.idUser,
            permissionId: 3,
          },
        });
        const point = await Point.findOne({
          where: {
            idPoint: item.dataValues.idPoint,
          },
        });
        const attend = await Attendance.findAll({
          where: {
            idUser: item.dataValues.idUser,
            idSubject: element.dataValues.idSubject,
          },
        });
        return user?.dataValues
          ? {
              ...user?.dataValues,
              point: { ...point?.dataValues, pointDiligence: attend },
            }
          : null;
      })
    );

    const fileSubject = await FileSubjects.findAll({
      where: {
        idSubject: element.dataValues.idSubject,
      },
    });
    const newData = await Promise.all(
      fileSubject?.map(async (item) => {
        const file = await Files.findOne({
          where: {
            idFile: item.dataValues.idFile,
          },
        });
        return file?.dataValues;
      })
    );

    const allCalendar = await SubjectCalendar.findAll({
      where: { idSubject: element.dataValues.idSubject },
    });
    const dataCalendar = await Promise.all(
      allCalendar?.map(async (item) => {
        const calendar = await Calendar.findOne({
          where: {
            idCalendar: item.dataValues.idCalendar,
          },
        });
        return calendar?.dataValues;
      })
    );
    const newSubject = {
      ...element.dataValues,
      teacher: teacher?.dataValues || null,
      students: _.compact(newDataUser),
      listFile: _.compact(newData),
      calendar: _.compact(dataCalendar),
    };
    return res.status(200).json({
      message: "Thành công!",
      data: newSubject,
      status: 200,
    });
  }
};

exports.addStudentToSubject = async (req, res) => {
  const { idUser, idSubject } = req.body;
  const userSubject = await PointUserSubject.findOne({
    where: { idUser: idUser, idSubject: idSubject },
  });
  if (userSubject != null) {
    userSubject
      .update({
        idSubject,
      })
      .then(() => {
        res.status(200).json({
          message: "Thành công!",
          status: 200,
        });
      });
  } else if (userSubject == null) {
    PointUserSubject.create({
      idUser,
      idSubject,
    }).then(() => {
      res.status(200).json({
        message: "Thành công!",
        status: 200,
      });
    });
  } else {
    res.status(400).json({
      error: "Sinh viên đã có trong môn học!",
      status: 400,
    });
  }
};

exports.changeTeacherSubject = async (req, res) => {
  const { idUser, idSubject } = req.body;
  const userSubject = await PointUserSubject.findOne({
    where: { idUser: idUser },
  });
  if (userSubject != null) {
    const subjectes = await Subjects.findOne({
      where: { idSubject: idSubject },
    });
    subjectes.update({
      idTeacher: idUser,
    });
    userSubject
      .update({
        idSubject,
      })
      .then(() => {
        res.status(200).json({
          message: "Thành công!",
          status: 200,
        });
      });
  } else if (userSubject == null) {
    const subjectes = await Subjects.findOne({
      where: { idSubject: idSubject },
    });
    subjectes.update({
      idTeacher: idUser,
    });
    PointUserSubject.create({
      idUser,
      idSubject,
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

exports.deleteStudentFromSubject = async (req, res) => {
  const { idUser, idSubject } = req.params;
  const userSubject = await PointUserSubject.findOne({
    where: { idUser: idUser, idSubject: idSubject },
  });
  if (userSubject != null) {
    userSubject.destroy().then(() => {
      res.status(200).json({
        message: "Thành công!",
        status: 200,
      });
    });
  } else {
    res.status(400).json({
      error: "Sinh viên không ở trong môn học!",
      status: 400,
    });
  }
};

exports.getUserInSubject = async (req, res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  const element = await Subjects.findOne({
    where: { idSubject: req.params.idSubject },
  });
  if (element == null) {
    res.status(400).json({
      message: "Lớp học không tồn tại!",
      status: 400,
    });
  } else if (element != null) {
    const teacher = await UserInfo.findOne({
      where: {
        idUser: element.dataValues.idTeacher,
      },
    });
    const userInfo = await UserInfo.findOne({
      where: {
        idUser: req.user.user.idUser,
      },
    });
    const userPoint = await PointUserSubject.findOne({
      where: {
        idSubject: element.dataValues.idSubject,
        idUser: req.user.user.idUser,
      },
    });
    const point = await Point.findOne({
      where: {
        idPoint: userPoint.dataValues.idPoint,
      },
    });
    const attend = await Attendance.findAll({
      where: {
        idUser: req.user.user.idUser,
        idSubject: element.dataValues.idSubject,
      },
    });
    const fileSubject = await FileSubjects.findAll({
      where: {
        idSubject: element.dataValues.idSubject,
      },
    });
    const newData = await Promise.all(
      fileSubject?.map(async (item) => {
        const file = await Files.findOne({
          where: {
            idFile: item.dataValues.idFile,
          },
        });
        return file?.dataValues;
      })
    );
    const newSubject = {
      ...element.dataValues,
      teacher: teacher?.dataValues || null,
      user: userInfo?.dataValues,
      point: { ...point?.dataValues, pointDiligence: attend },
      listFile: _.compact(newData),
    };
    return res.status(200).json({
      message: "Thành công!",
      data: newSubject,
      status: 200,
    });
  }
};

exports.getSubjectByMe = async (req, res) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
  const userPoint = await PointUserSubject.findAll({
    where: { idUser: req.user.user.idUser },
  });
  const allSubject = await Promise.all(
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
    data: allSubject,
    status: 200,
  });
};
