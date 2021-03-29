const path = require("path");
const bodyParser = require('body-parser');
const port = 3000;
const express = require('express');
const cors = require('cors');
// const nodemailer = require('nodemailer');
const { withJWTAuthMiddleware } = require('express-kun');
const login = require('./routes/loginroutes');
const classes = require('./routes/classesRoutes');
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
router.post('/register', login.register);
router.post('/forgot', login.forgot);
router.post('/reset/:token', login.reset);
router.post('/login', login.login);
router.post('/update', login.update);
router.post('/update1/:id', login.update1);
router.post('/updateState/:id', login.updateState);
protectRouter.get('/users/me', login.getMe);
protectRouter.post('/classes/create', classes.createClass);
protectRouter.get('/classes', classes.getClass);
protectRouter.get('/:id', login.get);
protectRouter.get('/', login.getAll);
// router.post('/forgot-password',)
app.use('/api', router);

app.listen(port, function () {
  console.log("Your app running on port " + port);
});
