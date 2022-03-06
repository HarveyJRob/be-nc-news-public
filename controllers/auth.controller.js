const { JWT_SECRET } = require("../config");

const jwt = require("jsonwebtoken");
const { selectUsers } = require("../models/auth.model");

exports.loginUser = (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  selectUsers(username)
    .then((user) => {
      if (!user || password !== user.password) {
        next({ status: 401, msg: "invalid username or password" });
      } else {
        res.status(200).send({ msg: `${username} logged in ok` });
        const token = jwt.sign(
          {
            username: user.username,
            iat: Date.now(),
          },
          JWT_SECRET
        );
        res.status(200).send({ token });
      }
    })
    .catch((err) => next(err));
};

exports.validateUser = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    // console.log(err, payload);
    if (err) {
      next({ status: 401, msg: "halt intruder! get outta here" });
    } else {
      req.user = payload;
      next();
    }
  });
};
