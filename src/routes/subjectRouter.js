const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const {
  Subjects,
  UserInfo,
  PointUserSubject,
  Point,
  Attendance,
} = require("../sequelize");
require("dotenv").config();

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
    } = req.body;
    Subjects.findOne({
      where: {
        name: req.body.name,
      },
    }).then((data) => {
      if (data == null) {
        Subjects.create({
          idSubject: uuidv4(),
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
    res.status(401).json({
      message: "Môn học không tồn tại!",
      status: 401,
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
    res.status(401).json({
      message: "Môn học không tồn tại!",
      status: 401,
    });
  }
};

exports.deleteSubject = async (req, res) => {
  const data = await Subject.findOne({
    where: { id: req.body.id },
  });
  if (data == null) {
    res.status(401).json({
      message: "Môn học không tồn tại!",
      status: 401,
    });
  } else if (data != null) {
    data.destroy().then(() => {
      res.status(200).json({
        message: "Thành công!",
        status: 200,
      });
    });
  } else {
    res.status(401).json({
      message: "Môn học không tồn tại!",
      status: 401,
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
    const newSubject = {
      ...element.dataValues,
      teacher: teacher?.dataValues || null,
      students: _.compact(newDataUser),
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
