const con = require("../middlewares/db.connect");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");

var Validator = require("jsonschema").Validator;
var v = new Validator();
const jsonSchema = require("../configuration/json-schema");

v.addSchema(jsonSchema, "/WatReqData");

module.exports = {
  getDepartmentDetailsByName: (departmentName, callBack) => {
    con.query(
      `SELECT id, user_name, user_designation, reporting_officer_name FROM users WHERE reporting_officer_department = ?`,
      [departmentName],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getAllDept: (callback) => {
    con.query(
      `select DISTINCT reporting_officer_department from users`,
      [],
      (error, results) => {
        if (error) {
          callback(error);
        }

        return callback(null, results);
      }
    );
  },

  getAllDeptByAdmin: (id, callBack) => {
    console.log("Function: getAllDeptByAdmin");
    var sql = "SELECT * FROM admin_departments WHERE adminId = ? ";

    con.query(sql, id, (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length === 0) {
        response = {
          status: 200,
          message: "No department mapping found!",
          data: results,
        };

        return callBack(null, response);
      } else {
        var getDeptDetailsSql = "SELECT * from departments where id = ?";
        let deptArray = [];
        results.map((i, j) => {
          con.query(
            getDeptDetailsSql,
            i.departmentId,
            (getDeptDetailsErr, getDeptDetailsRes) => {
              if (getDeptDetailsErr) {
                console.log(getDeptDetailsErr);
              }

              deptArray.push(getDeptDetailsRes[0]);
            }
          );
        });

        setTimeout(() => {
          return callBack(null, deptArray);
        }, 100);
      }
    });
  },

  insertDepartments: (data, callBack) => {
    var existCheckSql = "SELECT * FROM departments where name = ?";

    let payload = data.data;

    payload.map((i, j) => {
      con.query(existCheckSql, [i.departmentName], (error, results) => {
        if (error) {
          console.log("Error: " + error);
        }

        if (results.length) {
          response = {
            status: 409,
            message: "MDO already exist!",
          };
          return callBack(null, response);
        } else {
          var sql = "INSERT INTO departments SET ? ";

          con.query(
            sql,
            {
              name: i.departmentName,
              created_at: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
              last_updated_at: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
              created_by: i.superAdminId,
            },
            function (error, results) {
              if (error) {
                response = {
                  status: 400,
                  error: error,
                };
                console.log("Error: " + error);
              }
              return callBack(null, results);
            }
          );
        }
      });
    });
  },

  deleteAnDepartment: (id, callBack) => {
    var deleteMappingSql =
      "DELETE FROM admin_departments WHERE departmentId = ? ";

    con.query(deleteMappingSql, id, (error, results) => {
      if (error) {
        console.log(error);
      }

      var deptDeleteSql = "DELETE FROM departments WHERE id = ? ";

      con.query(deptDeleteSql, id, (deptDeleteErr, deptDeleteRes) => {
        if (deptDeleteErr) {
          console.log(error);
        }
        return callBack(null, deptDeleteRes);
      });
    });
  },

  getMappedAdmins: (id, callBack) => {
    var sql = "SELECT * FROM admin_departments WHERE departmentId = ?";

    con.query(sql, id, (error, results) => {
      if (error) {
        return callBack(error);
      }

      let mdo = "";
      if (results.length > 0) {
        var getDeptName = "SELECT name FROM departments where id = ?";
        con.query(getDeptName, id, (getDeptNameErr, getDeptNameRes) => {
          if (getDeptNameErr) {
            return callBack(getDeptNameErr);
          }
          mdo = getDeptNameRes[0].name;
        });
        let resArray = [];

        results.map((i, j) => {
          var getAdminSql = "SELECT id, user_email FROM wat_admin WHERE id = ?";
          con.query(getAdminSql, i.adminId, (getAdminErr, getAdminRes) => {
            if (getAdminErr) {
              return callBack(getAdminErr);
            }
            getAdminRes[0]["mdo"] = mdo;
            getAdminRes[0]["mdoId"] = id;

            var getAdminDeptSql =
              "SELECT id from admin_departments WHERE departmentId = ? AND adminId = ?";

            con.query(
              getAdminDeptSql,
              [id, i.adminId],
              (getAdminDeptErr, getAdminDeptRes) => {
                if (getAdminDeptErr) {
                  return callBack(getAdminDeptErr);
                }
                if (getAdminDeptRes[0].id) {
                  getAdminRes[0]["mappingId"] = getAdminDeptRes[0].id;
                }
              }
            );
            resArray.push(getAdminRes[0]);
          });
        });

        setTimeout(() => {
          return callBack(null, resArray);
        }, 100);
      } else {
        let mdoName = "";
        var getDeptName = "SELECT name FROM departments where id = ?";
        con.query(getDeptName, id, (getDeptNameErr, getDeptNameRes) => {
          if (getDeptNameErr) {
            return callBack(getDeptNameErr);
          }
          if (getDeptNameRes.length) {
            mdoName = getDeptNameRes[0].name;
          }
        });

        setTimeout(() => {
          if (mdoName !== "") {
            response = {
              status: 404,
              message: "No mappings found!",
              data: { mdoId: id, mdo: mdoName },
            };
          } else {
            response = {
              status: 404,
              message: "No mappings found!",
            };
          }

          return callBack(null, response);
        }, 100);
      }
    });
  },

  getDeptList: (callBack) => {
    con.query(`SELECT * FROM departments`, [], (error, results) => {
      if (error) {
        callBack(error);
      }

      results.map((i, j) => {
        var getCounts =
          "SELECT count(*) AS count FROM admin_departments WHERE departmentId = ?";
        con.query(getCounts, i.id, (getCountErr, getCountRes) => {
          if (getCountErr) {
            return callBack(getCountErr);
          }
          i["adminCount"] = getCountRes[0].count;
        });
      });
      setTimeout(() => {
        return callBack(null, results);
      }, 100);
    });
  },

  updateMDO: (id, data, callBack) => {
    var sql = "SELECT * FROM users where reporting_officer_department = ?";

    con.query(sql, [data.data[0].olderMdo], (err, res) => {
      if (err) {
        console.log(err);
      }

      let finalResponse;

      if (res.length) {
        var updateUsersSql =
          "UPDATE users SET reporting_officer_department = ?, last_updated_at = ?, updated_by = ? WHERE id = ?";

        res.map((i, j) => {
          con.query(
            updateUsersSql,
            [
              data.data[0].departmentName,
              new Date().toISOString().slice(0, 19).replace("T", " "),
              data.data[0].superAdminId,
              i.id,
            ],
            (updateUsersErr, updateUsersRes) => {
              if (updateUsersErr) {
                console.log(updateUsersErr);
              }

              var updateDeptSql =
                "UPDATE departments SET name = ?, last_updated_at = ?, updated_by = ? WHERE id = ?";

              con.query(
                updateDeptSql,
                [
                  data.data[0].departmentName,
                  new Date().toISOString().slice(0, 19).replace("T", " "),
                  data.data[0].superAdminId,
                  id,
                ],
                (updateDeptErrRes, updateDeptSqlRes) => {
                  if (updateDeptErrRes) {
                    callBack(updateDeptErrRes);
                  }
                  finalResponse = updateDeptSqlRes;
                }
              );
            }
          );
        });
      } else {
        var sql =
          "UPDATE departments SET name = ?, last_updated_at = ?, updated_by = ? WHERE id = ?";

        con.query(
          sql,
          [
            data.data[0].departmentName,
            new Date().toISOString().slice(0, 19).replace("T", " "),
            data.data[0].superAdminId,
            id,
          ],
          (error, results) => {
            if (error) {
              callBack(error);
            }

            finalResponse = results;
          }
        );
      }
      setTimeout(() => {
        response = {
          status: 200,
          data: finalResponse,
        };
        return callBack(null, response);
      }, 200);
    });
  },

  getMDODetail: (id, callBack) => {
    var sql = "SELECT * FROM departments WHERE id = ?";

    try {
      con.query(sql, id, (err, result) => {
        if (err) {
          return callBack(err.stack)
        };
        return callBack(null, result);
    
      });
    } catch (err) {
      return callBack(err.stack)
    }
  },

  createAdmins: (data, callBack) => {
    var sql = `SELECT user_email, id FROM wat_admin WHERE user_email = ?`;

    var payload = data.data;

    payload.map((i, j) => {
      con.query(sql, [i.userEmail], (error, results) => {
        if (error) {
          return callBack(error);
        }
        if (results.length === 0) {
          const salt = genSaltSync(10);
          i.userPassword = hashSync(i.userPassword, salt);

          var adminInsertSql =
            "INSERT INTO wat_admin ( \
          user_email, \
          user_password, \
          role \
          ) VALUES ?";
          var values = [[i.userEmail, i.userPassword, i.userRole]];

          con.query(
            adminInsertSql,
            [values],
            (adminInsetErr, adminInsertRes) => {
              if (adminInsetErr) {
                return callBack(adminInsetErr);
              }

              var genAdminId = adminInsertRes.insertId;

              var adminMapSql = "INSERT INTO admin_departments SET ? ";

              con.query(
                adminMapSql,
                {
                  departmentId: i.mdoId,
                  adminId: genAdminId,
                  created_at: new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " "),
                  last_updated_at: new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " "),
                  updated_by: i.superAdminId,
                },
                (adminMapErr, adminMapRes) => {
                  if (adminMapErr) {
                    return callBack(adminMapErr);
                  }
                }
              );
            }
          );
          return callBack(null, results);
        } else {
          results.map((m, n) => {
            var mappingCheckSql =
              "SELECT * FROM admin_departments WHERE departmentId = ? AND adminId = ?";

            con.query(
              mappingCheckSql,
              [i.mdoId, m.id],
              (mappingCheckErr, mappingCheckRes) => {
                if (mappingCheckErr) {
                  return callBack(mappingCheckErr);
                }
                if (mappingCheckRes.length) {
                  response = {
                    status: 403,
                    message: "Mapping already exists!",
                  };
                  return callBack(null, response);
                } else {
                  var adminMapSql = "INSERT INTO admin_departments SET ? ";

                  con.query(
                    adminMapSql,
                    {
                      departmentId: i.mdoId,
                      adminId: m.id,
                      created_at: new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " "),
                      last_updated_at: new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " "),
                      updated_by: i.superAdminId,
                    },
                    (adminMapErr, adminMapRes) => {
                      if (adminMapErr) {
                        return callBack(adminMapErr);
                      }
                      return callBack(null, adminMapRes);
                    }
                  );
                }
              }
            );
          });
        }
      });
    });
  },
};
