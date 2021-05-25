const Sequelize = require("sequelize");
const UserModel = require("./models/user");
const UserInfoModel = require("./models/infoUser");
const ClassesModel = require("./models/classes");
const ClassFileModel = require("./models/classFile");
const FileModel = require("./models/files");
const PermissonModel = require("./models/permisson");
const UserClassModel = require("./models/userClass");
const UserFileModel = require("./models/userFile");
const SubjectsModel = require("./models/subjects");
const FileSubjectsModel = require("./models/fileSubject");
const PointModel = require("./models/point");
const PointUserSubjectModel = require("./models/pointUserSubject");
const AttendanceModal = require("./models/attendance");
const CalendarModel = require("./models/calendar");
const UserCalendarModel = require("./models/userCalendar");
const SubjectCalendarModel = require("./models/subjectCalendar");
const sequelize = new Sequelize("database", "root", "password", { //root - password
  host: localhost,
  dialect: "mysql",
  port: 3336,
});

const User = UserModel(sequelize, Sequelize);
const UserInfo = UserInfoModel(sequelize, Sequelize);
const Classes = ClassesModel(sequelize, Sequelize);
const ClassFile = ClassFileModel(sequelize, Sequelize);
const Files = FileModel(sequelize, Sequelize);
const Permisson = PermissonModel(sequelize, Sequelize);
const UserClass = UserClassModel(sequelize, Sequelize);
const UserFile = UserFileModel(sequelize, Sequelize);
const Subjects = SubjectsModel(sequelize, Sequelize);
const FileSubjects = FileSubjectsModel(sequelize, Sequelize);
const Point = PointModel(sequelize, Sequelize);
const PointUserSubject = PointUserSubjectModel(sequelize, Sequelize);
const Attendance = AttendanceModal(sequelize, Sequelize);
const Calendar = CalendarModel(sequelize, Sequelize);
const UserCalendar = UserCalendarModel(sequelize, Sequelize);
const SubjectCalendar = SubjectCalendarModel(sequelize, Sequelize);
sequelize.sync().then(() => {
  console.log(
    "-----------------------------------------------------------------------------------------------"
  );
});

module.exports = {
  User,
  UserInfo,
  Classes,
  ClassFile,
  Files,
  Permisson,
  UserClass,
  UserFile,
  Subjects,
  FileSubjects,
  Point,
  Attendance,
  PointUserSubject,
  Calendar,
  UserCalendar,
  SubjectCalendar
};
