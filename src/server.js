const path = require("path");
const bodyParser = require('body-parser');
const port = 3000;
const express = require('express');
const cors = require('cors');
var multer  = require('multer')
var upload = multer({ dest: 'uploads' })
const { withJWTAuthMiddleware } = require('express-kun');
const uploadFile = require('./routes/uploadFile');
const login = require('./routes/loginroutes');
const classes = require('./routes/classesRouters');
const user = require('./routes/infoRouters');
const { UserInfo, Classes } = require("./sequelize");
require('dotenv').config();

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
const protectRouter = withJWTAuthMiddleware(router, 'yourSecretKey', getTokenFromBearer);
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//class
protectRouter.post('/classes/create', classes.createClass);
protectRouter.put('/classes/update/:id', classes.updateClass);
protectRouter.delete('/classes/delete', classes.deleteClass);
protectRouter.get('/classes', classes.getClass);
//user
protectRouter.get('/users/me', user.getMe);
protectRouter.put('/users/updateMe', user.updateMe);
protectRouter.post('/users/create', user.createInfoUser);
protectRouter.put('/users/update/:id', user.updateInfoUser);
protectRouter.delete('/users/delete', user.deleteInfoUser);
protectRouter.get('/users', user.getInfoUser);
protectRouter.get('/users/getTeacher', user.getTeacher);
//upload file
protectRouter.post('/upload/media', upload.single('file'), uploadFile.uploadFile);
protectRouter.get('/getMyFile', uploadFile.getFile);
//login
router.post('/register', login.register);
router.post('/forgot', login.forgot);
router.post('/reset/:token', login.reset);
router.post('/login', login.login);
router.post('/update', login.update);
router.post('/update1/:id', login.update1);
router.post('/updateState/:id', login.updateState);
protectRouter.get('/account/:id', login.get);
protectRouter.get('/account', login.getAll);
// router.post('/forgot-password',)
app.use('/api', router);

app.listen(port, function () {
  console.log("Your app running on port " + port);
});
