const path = require("path");
const bodyParser = require("body-parser");
const port = 3000;
const express = require("express");
const cors = require("cors");
var multer = require("multer");
var upload = multer({
  dest: "uploads",
  destination: function (req, file, cb) {
    cb(null, config.DIR);
  },
  filename: function (req, file, cb) {
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, Date.now() + ext);
  },
});

const { withJWTAuthMiddleware } = require("express-kun");
const uploadFile = require("./routes/uploadFile");
const login = require("./routes/loginroutes");
const classes = require("./routes/classesRouters");
const user = require("./routes/infoRouters");
const subject = require("./routes/subjectRouter");
const point = require("./routes/pointRouter");
const attend = require("./routes/attendRouters");
const calendar = require("./routes/calendarRouters");
require("dotenv").config();

function getTokenFromBearer(req) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new Error("No Authorization Header");
  }
  try {
    const token = authorization.split("Bearer ")[1];
    return token;
  } catch {
    throw new Error("Invalid Token Format");
  }
}
const router = express.Router();
const protectRouter = withJWTAuthMiddleware(
  router,
  "yourSecretKey",
  getTokenFromBearer
);
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//class
protectRouter.post("/classes/create", classes.createClass);
protectRouter.put("/classes/update/:id", classes.updateClass);
protectRouter.delete("/classes/delete", classes.deleteClass);
protectRouter.get("/classes", classes.getClass);
protectRouter.get("/classes/detail/:id", classes.getDetailClass);
protectRouter.post("/classes/addStudentToClass", classes.addStudentToClass);
protectRouter.post("/classes/changeTeacherClass", classes.changeTeacherClass);
protectRouter.delete(
  "/classes/deleteStudentFromClass",
  classes.deleteStudentFromClass
);
protectRouter.post("/classes/getPointStudent", classes.getPointStudent);
protectRouter.post("/classes/getClassByStudent", classes.getClassByStudent);
protectRouter.get("/classes/getClassByMe", classes.getClassByMe);

//user
protectRouter.get("/users/me", user.getMe);
protectRouter.put("/users/updateMe", user.updateMe);
protectRouter.post("/users/create", user.createInfoUser);
protectRouter.put("/users/update/:id", user.updateInfoUser);
protectRouter.delete("/users/delete", user.deleteInfoUser);
protectRouter.get("/users", user.getInfoUser);
protectRouter.get("/users/getTeacher", user.getTeacher);
protectRouter.get("/users/getStudent", user.getStudent);
//upload file
protectRouter.post(
  "/upload/media",
  upload.single("file"),
  uploadFile.uploadFile
);
protectRouter.delete(
  "/upload/media/:id", uploadFile.deleteFile
);
protectRouter.delete(
  "/upload/fileClass",
  uploadFile.deleteFileClass
);
protectRouter.delete(
  "/upload/fileSubject",
  uploadFile.deleteFileSubject
);
protectRouter.post(
  "/subject/upload/media",
  upload.single("file"),
  uploadFile.uploadFileSubject
);
protectRouter.post(
  "/classes/upload/media",
  upload.single("file"),
  uploadFile.uploadFileClass
);
protectRouter.get("/getMyFile", uploadFile.getFile);
protectRouter.post("/addExpiredFile", uploadFile.addExpiredFile);
//subject
protectRouter.post("/subject/create", subject.createSubject);
protectRouter.put("/subject/update/:id", subject.updateSubject);
protectRouter.delete("/subject/delete", subject.deleteSubject);
protectRouter.get("/subject/detail/:id", subject.getDetailSubject);
protectRouter.post("/subject/addStudentToSubject", subject.addStudentToSubject);
protectRouter.post(
  "/subject/changeTeacherSubject",
  subject.changeTeacherSubject
);
protectRouter.delete(
  "/subject/deleteStudentFromSubject",
  subject.deleteStudentFromSubject
);
protectRouter.get("/subject", subject.getSubject);
protectRouter.get(
  "/subject/getUserInSubject/:idSubject",
  subject.getUserInSubject
);

protectRouter.get("/subject/getSubjectByMe", subject.getSubjectByMe);
// Calendar 
protectRouter.post("/calendar/addCalendar", calendar.createCalendar);
protectRouter.get("/calendar", calendar.getCalendarByMe);
// point
protectRouter.post("/point/updatePoint", point.updatePoint);
// attend
protectRouter.post("/attend/getAttend", attend.getAttendSubject);
protectRouter.post("/attend/postAttend", attend.postAttendSubject);
//login
router.post("/register", login.register);
router.post("/forgot", login.forgot);
router.post("/reset/:token", login.reset);
router.post("/login", login.login);
router.post("/update", login.update);
router.post("/update1/:id", login.update1);
router.post("/updateState/:id", login.updateState);
protectRouter.get("/account/:id", login.get);
protectRouter.get("/account", login.getAll);
// router.post('/forgot-password',)
app.use("/api", router);

app.listen(port, function () {
  console.log("Your app running on port " + port);
});
