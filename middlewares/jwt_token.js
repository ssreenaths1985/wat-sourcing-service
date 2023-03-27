const JWT = require("jsonwebtoken");
const { id } = require("../configuration/json-schema");
const con = require("../middlewares/db.connect");

module.exports = {
  loginAccesToken: (userData) => {
    return new Promise((resolve, reject) => {
      const payload = {
        userId: userData.id,
        name: userData.user_email,
      };
      const secret = process.env.APP_WAT_BE_JWT_SECRET_KEY;
      const options = {
        expiresIn: "1d",
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  },

  verifyToken: (req, res, next) => {
    console.log("Function: verifyToken");
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "Token not found!" });
    }

    const secret = process.env.APP_WAT_BE_JWT_SECRET_KEY;

    JWT.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized token!" });
      }
      req.userId = decoded.userId;
      next();
    });
  },

  isSuperAdmin: (req, res, next) => {
    console.log("Function: isSuperAdmin");

    var userId = req.userId;
    con.query(
      `select * from wat_admin where id = ?`,
      [userId],
      (error, results, fields) => {
        if (error) {
          console.log(err);
        }

        if (results[0].role === "superAdmin") {
          next();
        } else {
          return res.status(401).send({ message: "Unauthorized access!" });
        }
      }
    );
  },

  isAdmin: (req, res, next) => {
    console.log("Function: isAdmin");

    var userId = req.userId;
    con.query(
      `select * from wat_admin where id = ?`,
      [userId],
      (error, results, fields) => {
        if (error) {
          console.log(err);
        }

        if (results[0].role === "admin") {
          next();
        } else {
          return res.status(401).send({ message: "Unauthorized access!" });
        }
      }
    );
  },

  isL1: (req, res, next) => {
    console.log("Function: isL1");

    var userId = req.userId;
    con.query(
      `select * from wat_admin where id = ?`,
      [userId],
      (error, results, fields) => {
        if (error) {
          console.log(err);
        }

        if (results[0].role === "L1") {
          next();
        } else {
          return res.status(401).send({ message: "Unauthorized access!" });
        }
      }
    );
  },

  isL2: (req, res, next) => {
    console.log("Function: isL2");

    var userId = req.userId;
    con.query(
      `select * from wat_admin where id = ?`,
      [userId],
      (error, results, fields) => {
        if (error) {
          console.log(err);
        }

        if (results[0].role === "L2") {
          next();
        } else {
          return res.status(401).send({ message: "Unauthorized access!" });
        }
      }
    );
  },
};
