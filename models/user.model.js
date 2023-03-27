const con = require("../middlewares/db.connect");

var Validator = require("jsonschema").Validator;
var v = new Validator();
const jsonSchema = require("../configuration/json-schema");
v.addSchema(jsonSchema, "/WatReqData");

const CSVParser = require("json2csv").Parser;
var fs = require("fs");

module.exports = {
  createUser: (data, res) => {
    console.log("Function: createUser");
    try {
      var sql =
        "INSERT INTO users ( \
            user_name, \
            user_designation, \
            user_work_email, \
            reporting_officer_name, \
            reporting_officer_designation, \
            reporting_officer_department \
            ) VALUES ?";
      var values = [
        [
          data.userName,
          data.userDesignation,
          data.userWorkEmail,
          data.reportingOfficerName,
          data.reportingOfficerDesignation,
          data.reportingOfficerDepartment,
        ],
      ];
      con.query(sql, [values], function (err, result) {
        if (err) {
          response = { status: 400, error: err };
          console.log("Error: " + err.code);
          return res.status(response.status).json(response);
        } else {
          var sql =
            "INSERT INTO roles ( \
                user_id, \
                role_label, \
                role_description \
              ) VALUES ?";
          var userId = result.insertId;
          for (let i = 0; i < data.roles.length; i++) {
            var role = [];

            role.push([
              userId,
              data.roles[i].roleLabel,
              data.roles[i].roleDescription,
            ]);

            con.query(sql, [role], function (err, result) {
              if (err) {
                response = { status: 500, error: err };
                console.log("Error: " + err.code);
                return res.status(response.status).json(response);
              } else {
                var roleId = result.insertId;
                if (data.roles[i]["activities"].length > 0) {
                  var sql =
                    "INSERT INTO role_activities ( \
                      role_id, \
                      activity \
                      ) VALUES ?";

                  var activitiesList = [];
                  for (let j = 0; j < data.roles[i]["activities"].length; j++) {
                    activitiesList.push([
                      roleId,
                      data.roles[i]["activities"][j].label,
                    ]);
                  }

                  con.query(sql, [activitiesList], function (err, result) {
                    if (err) {
                      response = { status: 500, error: err };
                      console.log("Error: " + err.code);
                      return res.status(response.status).json(response);
                    }
                  });
                }
                if (data.roles[i]["competencies"].length > 0) {
                  var sql =
                    "INSERT INTO role_competencies ( \
                          role_id, \
                          competency, \
                          competency_area, \
                          competency_level \
                          ) VALUES ?";

                  var competenciesList = [];

                  for (
                    let k = 0;
                    k < data.roles[i]["competencies"].length;
                    k++
                  ) {
                    competenciesList.push([
                      roleId,
                      data.roles[i]["competencies"][k].label,
                      data.roles[i]["competencies"][k].area,
                      data.roles[i]["competencies"][k].level,
                    ]);
                  }

                  con.query(sql, [competenciesList], function (err, result) {
                    if (err) {
                      response = { status: 500, error: err };
                      console.log("Error: " + err.code);
                      return res.status(response.status).json(response);
                    }
                  });
                }
              }
            });
          }
          response = {
            status: 200,
            message: "Records inserted successfully.",
            name: data.name,
          };
          return res.status(response.status).json(response);
        }
      });
    } catch (err) {
      response = { status: 400, error: err, name: "data error" };
      return res.status(response.status).json(response);
    }
  },

  updateUsersTable: (id, payload, callBack) => {
    console.log("Function: updateUsersTable");

    try {
      let finalResponse;

      var sql =
        "UPDATE users SET user_name = ?, user_designation = ?, user_work_email = ?, reporting_officer_name = ?, reporting_officer_designation = ?, reporting_officer_department = ?, last_updated_at = ?, updated_by = ? WHERE id = ?";

      con.query(
        sql,
        [
          payload.user_name,
          payload.user_designation,
          payload.user_work_email,
          payload.reporting_officer_name,
          payload.reporting_officer_designation,
          payload.reporting_officer_department,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          payload.adminId,
          id,
        ],
        function (err, result, fields) {
          if (err) {
            response = { status: 400, error: err };
            console.log("Error: " + err.code);
            return callBack(null, response);
          } else {
            if (result.affectedRows > 0) {
              finalResponse = {
                status: 200,
                message: "Record updated successfully.",
              };
            } else {
              finalResponse = {
                status: 204,
                message: "Record not found.",
              };
            }

            setTimeout(() => {
              return callBack(null, finalResponse);
            }, 200);
          }
        }
      );
    } catch (err) {
      response = { status: 400, error: err, name: "update error" };
      return callBack(null, response);
    }
  },

  updateRolesTable: (payload, res) => {
    console.log("Function: updateRolesTable");

    try {
      let rolesActIdArray = [];
      let compsIdArray = [];
      let rolesIdArray = [];

      payload.map((i, j) => {
        var sql = "SELECT * FROM roles WHERE id = ?";
        con.query(sql, i.id, function (err, result) {
          if (err) {
            response = { status: 400, error: err };
            console.log("Error: " + err.code);
            return res.status(response.status).json(response);
          } else {
            if (result.length) {
              console.log("UPDATE");
              rolesIdArray.push(i.id);
              var sql =
                "UPDATE roles SET role_label = ?, role_description = ?, last_updated_at = ?, updated_by = ? WHERE id = ?";

              con.query(
                sql,
                [
                  i.roleLabel,
                  i.roleDescription,
                  new Date().toISOString().slice(0, 19).replace("T", " "),
                  i.adminId,
                  i.id,
                ],
                function (err, result) {
                  if (err) {
                    response = { status: 400, error: err };
                    console.log("Error: " + err.code);
                  }

                  // For activities
                  i.activities.map((m, n) => {
                    var actCheckSql =
                      "SELECT * FROM role_activities WHERE id = ?";

                    con.query(
                      actCheckSql,
                      m.id,
                      function (actCheckErr, actCheckResult) {
                        if (actCheckErr) {
                          response = { status: 400, error: actCheckErr };
                          console.log("Error: " + actCheckErr.code);
                        }

                        if (actCheckResult.length) {
                          console.log("Updating role_activities");
                          rolesActIdArray.push({ roleId: i.id, actId: m.id });
                          var actUpdate =
                            "UPDATE role_activities SET activity = ?, last_updated_at = ?, updated_by= ? WHERE id = ?";

                          con.query(
                            actUpdate,
                            [
                              m.label,
                              new Date()
                                .toISOString()
                                .slice(0, 19)
                                .replace("T", " "),
                              i.adminId,
                              m.id,
                            ],
                            function (actUpdateErr, actUpdateResult) {
                              if (actUpdateErr) {
                                response = { status: 400, error: actUpdateErr };
                                console.log("Error: " + actUpdateErr.code);
                              }
                            }
                          );
                        } else {
                          if (m.label !== "") {
                            console.log("Inserting role_activities");
                            var actInsert =
                              "INSERT INTO role_activities SET ? ";

                            con.query(
                              actInsert,
                              {
                                role_id: i.id,
                                activity: m.label,
                                updated_by: i.adminId,
                              },
                              function (
                                actInsertErr,
                                actInsertResult,
                                actInsertFields
                              ) {
                                if (actInsertErr) {
                                  response = {
                                    status: 400,
                                    error: actInsertErr,
                                  };
                                  console.log("Error: " + actInsertErr);
                                }
                                rolesActIdArray.push({
                                  roleId: i.id,
                                  actId: actInsertResult.insertId,
                                });
                              }
                            );
                          }
                        }
                      }
                    );
                  });

                  //For competencies
                  i.competencies.map((m, n) => {
                    var compCheckSql =
                      "SELECT * FROM role_competencies WHERE id = ?";

                    con.query(
                      compCheckSql,
                      m.id,
                      function (compCheckErr, compCheckResult) {
                        if (compCheckErr) {
                          response = { status: 400, error: compCheckErr };
                          console.log("Error: " + compCheckErr.code);
                        }

                        if (compCheckResult.length) {
                          console.log("Updating role_competencies");
                          compsIdArray.push({ roleId: i.id, compId: m.id });
                          var actUpdate =
                            "UPDATE role_competencies SET competency_area = ?, competency_level = ?, competency = ?, last_updated_at = ?, updated_by= ? WHERE id = ?";

                          con.query(
                            actUpdate,
                            [
                              m.area,
                              m.level,
                              m.label,
                              new Date()
                                .toISOString()
                                .slice(0, 19)
                                .replace("T", " "),
                              i.adminId,
                              m.id,
                            ],
                            function (compUpdateErr, compUpdateResult) {
                              if (compUpdateErr) {
                                response = {
                                  status: 400,
                                  error: compUpdateErr,
                                };
                                console.log("Error: " + compUpdateErr.code);
                              }
                            }
                          );
                        } else {
                          if (
                            m.label !== "" &&
                            m.area !== "" &&
                            m.level !== ""
                          ) {
                            console.log("Inserting role_competencies");

                            var compInsert =
                              "INSERT INTO role_competencies SET ? ";
                            con.query(
                              compInsert,
                              {
                                role_id: i.id,
                                competency: m.label,
                                competency_area: m.area,
                                competency_level: m.level,
                                updated_by: i.adminId,
                              },
                              function (
                                compInsertErr,
                                compInsertResult,
                                compInsertFields
                              ) {
                                if (compInsertErr) {
                                  response = {
                                    status: 400,
                                    error: compInsertErr,
                                  };
                                  console.log("Error: " + compInsertErr.code);
                                }
                                compsIdArray.push({
                                  roleId: i.id,
                                  compId: compInsertResult.insertId,
                                });
                              }
                            );
                          }
                        }
                      }
                    );
                  });
                }
              );
            } else {
              console.log("INSERT");

              if (i.roleLabel !== "" && i.roleDescription !== "") {
                var sql = "INSERT INTO roles SET ? ";
                con.query(
                  sql,
                  {
                    user_id: i.userId,
                    role_label: i.roleLabel,
                    role_description: i.roleDescription,
                    updated_by: i.adminId,
                  },
                  function (err, result) {
                    if (err) {
                      response = { status: 400, error: err };
                      console.log("Error: " + err.code);
                      return res.status(response.status).json(response);
                    }

                    let generatedRoleId = result.insertId;

                    rolesIdArray.push(generatedRoleId);

                    // For activities
                    i.activities.map((m, n) => {
                      var actCheckSql =
                        "SELECT * FROM role_activities WHERE id = ?";

                      con.query(
                        actCheckSql,
                        m.id,
                        function (actCheckErr, actCheckResult) {
                          if (actCheckErr) {
                            response = { status: 400, error: actCheckErr };
                            console.log("Error: " + actCheckErr.code);
                          }

                          if (actCheckResult.length) {
                            console.log("Updating role_activities");
                            rolesActIdArray.push({ roleId: i.id, actId: m.id });
                            var actUpdate =
                              "UPDATE role_activities SET activity = ?, last_updated_at = ?, updated_by= ? WHERE id = ?";

                            con.query(
                              actUpdate,
                              [
                                m.label,
                                new Date()
                                  .toISOString()
                                  .slice(0, 19)
                                  .replace("T", " "),
                                i.adminId,
                                m.id,
                              ],
                              function (actUpdateErr, actUpdateResult) {
                                if (actUpdateErr) {
                                  response = {
                                    status: 400,
                                    error: actUpdateErr,
                                  };
                                  console.log("Error: " + actUpdateErr.code);
                                }
                              }
                            );
                          } else {
                            if (m.label !== "") {
                              console.log("Inserting role_activities");
                              var actInsert =
                                "INSERT INTO role_activities SET ? ";

                              con.query(
                                actInsert,
                                {
                                  role_id: generatedRoleId,
                                  activity: m.label,
                                  updated_by: i.adminId,
                                },
                                function (
                                  actInsertErr,
                                  actInsertResult,
                                  actInsertFields
                                ) {
                                  if (actInsertErr) {
                                    response = {
                                      status: 400,
                                      error: actInsertErr,
                                    };
                                    console.log("Error: " + actInsertErr);
                                  }
                                  rolesActIdArray.push({
                                    roleId: generatedRoleId,
                                    actId: result.insertId,
                                  });
                                }
                              );
                            }
                          }
                        }
                      );
                    });

                    // For competencies
                    i.competencies.map((m, n) => {
                      var compCheckSql =
                        "SELECT * FROM role_competencies WHERE id = ?";

                      con.query(
                        compCheckSql,
                        m.id,
                        function (compCheckErr, compCheckResult) {
                          if (compCheckErr) {
                            response = { status: 400, error: compCheckErr };
                            console.log("Error: " + compCheckErr.code);
                          }

                          if (compCheckResult.length) {
                            console.log("Updating role_competencies");
                            compsIdArray.push({ roleId: i.id, compId: m.id });
                            var actUpdate =
                              "UPDATE role_competencies SET competency_area = ?, competency_level = ?, competency = ?, last_updated_at = ?, updated_by= ? WHERE id = ?";

                            con.query(
                              actUpdate,
                              [
                                m.area,
                                m.level,
                                m.label,
                                new Date()
                                  .toISOString()
                                  .slice(0, 19)
                                  .replace("T", " "),
                                i.adminId,
                                m.id,
                              ],
                              function (compUpdateErr, compUpdateResult) {
                                if (compUpdateErr) {
                                  response = {
                                    status: 400,
                                    error: compUpdateErr,
                                  };
                                  console.log("Error: " + compUpdateErr.code);
                                }
                              }
                            );
                          } else {
                            if (
                              m.label !== "" &&
                              m.area !== "" &&
                              m.level !== ""
                            ) {
                              console.log("Inserting role_competencies");

                              var compInsert =
                                "INSERT INTO role_competencies SET ? ";
                              con.query(
                                compInsert,
                                {
                                  role_id: generatedRoleId,
                                  competency: m.label,
                                  competency_area: m.area,
                                  competency_level: m.level,
                                  updated_by: i.adminId,
                                },
                                function (
                                  compInsertErr,
                                  compInsertResult,
                                  compInsertFields
                                ) {
                                  if (compInsertErr) {
                                    response = {
                                      status: 400,
                                      error: compInsertErr,
                                    };
                                    console.log("Error: " + compInsertErr.code);
                                  }
                                  compsIdArray.push({
                                    roleId: generatedRoleId,
                                    compId: compInsertResult.insertId,
                                  });
                                }
                              );
                            }
                          }
                        }
                      );
                    });
                  }
                );
              }
            }
          }
        });
      });

      response = {
        status: 200,
        message: "Records updated successfully.",
      };
      return res.status(response.status).json(response);
    } catch (err) {
      response = { status: 400, error: err, name: "update error" };
      return res.status(response.status).json(response);
    }
  },

  // updateRoleActivtiesTable: (payload, res) => {
  //   console.log("Function: updateRoleActivtiesTable");

  //   try {
  //     let data = payload.data;
  //     let idArray = [];
  //     data.map((i, j) => {
  //       var sql = "SELECT * FROM role_activities WHERE id = ?";
  //       con.query(sql, i.id, function (err, result) {
  //         if (err) {
  //           response = { status: 400, error: err };
  //           console.log("Error: " + err.code);
  //           return res.status(response.status).json(response);
  //         } else {
  //           if (result.length) {
  //             idArray.push(data[j].id);
  //             var sql =
  //               "UPDATE role_activities SET role_id = ?, activity = ?, last_updated_at = ? WHERE id = ?";

  //             con.query(
  //               sql,
  //               [
  //                 data[j].role_id,
  //                 data[j].activity,
  //                 new Date().toISOString().slice(0, 19).replace("T", " "),
  //                 data[j].id,
  //               ],
  //               function (err, result) {
  //                 if (err) {
  //                   response = { status: 400, error: err };
  //                   console.log("Error: " + err.code);
  //                   return res.status(response.status).json(response);
  //                 }
  //               }
  //             );
  //           } else {
  //             var sql =
  //               "INSERT INTO role_activities ( \
  //             role_id, \
  //             activity \
  //             ) VALUES ?";

  //             var activitiesList = [];

  //             activitiesList.push([data[j].role_id, data[j].activity]);

  //             con.query(sql, [activitiesList], function (err, result, fields) {
  //               if (err) {
  //                 response = { status: 400, error: err };
  //                 console.log("Error: " + err.code);
  //                 return res.status(response.status).json(response);
  //               }
  //               idArray.push(JSON.stringify(result.insertId));
  //             });
  //           }

  //           setTimeout(() => {
  //             var arr = idArray.map(function (el) {
  //               return el;
  //             });
  //             var sql =
  //               "DELETE FROM role_activities WHERE id NOT IN (" +
  //               con.escape(arr) +
  //               ") ";

  //             con.query(sql, function (err, result, fields) {
  //               if (err) {
  //                 response = { status: 400, error: err };
  //                 console.log("Error: " + err.code);
  //                 return res.status(response.status).json(response);
  //               }
  //             });
  //           }, 100);
  //         }
  //       });
  //     });
  //     response = {
  //       status: 200,
  //       message: "Records updated successfully.",
  //     };
  //     return res.status(response.status).json(response);
  //   } catch (err) {
  //     response = { status: 400, error: err, name: "update error" };
  //     return res.status(response.status).json(response);
  //   }
  // },

  // updateRoleCompetenciesTable: (payload, res) => {
  //   console.log("Function: updateRoleCompetenciesTable");

  //   try {
  //     let data = payload.data;

  //     data.map((i, j) => {
  //       var sql = "SELECT * FROM role_competencies WHERE id = ?";
  //       con.query(sql, i.id, function (err, result) {
  //         if (err) {
  //           response = { status: 400, error: err };
  //           console.log("Error: " + err.code);
  //           return res.status(response.status).json(response);
  //         } else {
  //           if (result.length) {
  //             var sql =
  //               "UPDATE role_competencies SET role_id = ?, competency = ?, competency_area = ?, competency_level = ?, last_updated_at = ? WHERE id = ?";

  //             con.query(
  //               sql,
  //               [
  //                 data[j].role_id,
  //                 data[j].competency,
  //                 data[j].competency_area,
  //                 data[j].competency_level,
  //                 new Date().toISOString().slice(0, 19).replace("T", " "),
  //                 data[j].id,
  //               ],
  //               function (err, result) {
  //                 if (err) {
  //                   response = { status: 400, error: err };
  //                   console.log("Error: " + err.code);
  //                   return res.status(response.status).json(response);
  //                 }
  //               }
  //             );
  //           } else {
  //             var sql =
  //               "INSERT INTO role_competencies ( \
  //             role_id, \
  //             competency, \
  //             competency_area, \
  //             competency_level \
  //             ) VALUES ?";

  //             var competenciesList = [];

  //             competenciesList.push([
  //               data[j].role_id,
  //               data[j].competency,
  //               data[j].competency_area,
  //               data[j].competency_level,
  //             ]);

  //             con.query(
  //               sql,
  //               [competenciesList],
  //               function (err, result, fields) {
  //                 if (err) {
  //                   response = { status: 400, error: err };
  //                   console.log("Error: " + err.code);
  //                   return res.status(response.status).json(response);
  //                 }
  //               }
  //             );
  //           }
  //         }
  //       });
  //     });
  //     response = {
  //       status: 200,
  //       message: "Records updated successfully.",
  //     };
  //     return res.status(response.status).json(response);
  //   } catch (err) {
  //     response = { status: 400, error: err, name: "update error" };
  //     return res.status(response.status).json(response);
  //   }
  // },

  insertCompetencies: (payload, callBack) => {
    console.log("Function: insertCompetencies");
    try {
      var sql =
        "INSERT INTO role_competencies ( \
        role_id, \
        competency, \
        competency_area, \
        competency_level \
        ) VALUES ?";

      var competenciesList = [];

      competenciesList.push([
        payload.role_id,
        payload.competency,
        payload.competency_area,
        payload.competency_level,
      ]);
      con.query(sql, [competenciesList], function (err, result, fields) {
        if (err) {
          response = { status: 400, error: err };
          console.log("Error: " + err);
          return callBack(null, response);
        } else {
          response = {
            status: 200,
            message: "Record inserted successfully.",
          };
          return callBack(null, response);
        }
      });
    } catch (err) {
      response = { status: 400, error: err, name: "Insert error" };
      return callBack(null, response);
    }
  },

  insertActivities: (payload, callBack) => {
    console.log("Function: insertActivities");
    try {
      var sql =
        "INSERT INTO role_activities ( \
        role_id, \
        activity \
        ) VALUES ?";

      var activitiesList = [];

      activitiesList.push([payload.role_id, payload.activity]);
      con.query(sql, [activitiesList], function (err, result, fields) {
        if (err) {
          response = { status: 400, error: err };
          console.log("Error: " + err);
          return callBack(null, response);
        } else {
          response = {
            status: 200,
            message: "Record inserted successfully.",
          };
          return callBack(null, response);
        }
      });
    } catch (err) {
      response = { status: 400, error: err, name: "Insert error" };
      return callBack(null, response);
    }
  },

  insertRoles: (payload, callBack) => {
    console.log("Function: insertRoles");
    try {
      var sql =
        "INSERT INTO roles ( \
        user_id, \
        role_label, \
        role_description \
      ) VALUES ?";

      var role = [];

      role.push([
        payload.user_id,
        payload.role_label,
        payload.role_description,
      ]);
      con.query(sql, [role], function (err, result, fields) {
        if (err) {
          response = { status: 400, error: err };
          console.log("Error: " + err);
          return callBack(null, response);
        } else {
          response = {
            status: 200,
            message: "Record inserted successfully.",
          };
          return callBack(null, response);
        }
      });
    } catch (err) {
      response = { status: 400, error: err, name: "Insert error" };
      return callBack(null, response);
    }
  },

  userSignup: (data, res) => {
    console.log("Function: userSignup");
    try {
      var sql =
        "INSERT INTO wat_admin ( \
          user_email, \
          user_password, \
          role \
          ) VALUES ?";
      var values = [[data.userName, data.userPassword, data.userRole]];
      con.query(
        "SELECT * FROM wat_admin WHERE user_email = ?",
        data.userName,
        function (err, result) {
          if (err) {
            response = { status: 400, error: err };
            console.log("Error: " + err.code);
            return res.status(response.status).json(response);
          }

          if (!result.length) {
            con.query(sql, [values], function (err, result) {
              if (err) {
                response = { status: 400, error: err };
                console.log("Error: " + err.code);
                return res.status(response.status).json(response);
              } else {
                response = {
                  status: 200,
                  message: "Records inserted successfully.",
                  name: data.name,
                };
                return res.status(response.status).json(response);
              }
            });
          } else {
            response = {
              status: 202,
              name: data.userName,
              message: "Username already exists.",
            };
            return res.status(response.status).json(response);
          }
        }
      );
    } catch (err) {
      response = { status: 400, error: err, name: "data error" };
      return res.status(response.status).json(response);
    }
  },

  getUsers: (callBack) => {
    console.log("Function: getUsers");
    con.query(
      `select id,user_name,user_designation,user_work_email,reporting_officer_name,reporting_officer_designation, reporting_officer_department from users`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getUserByUserEmail: (email, callBack) => {
    console.log("Function: getUserByUserEmail");
    con.query(
      `select * from wat_admin where user_email = ?`,
      // `select * from users where user_name = ?`,
      [email],
      // [name],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }

        return callBack(null, results[0]);
      }
    );
  },

  getUserDetailsById: (userId, callBack) => {
    console.log("Function: getUserDetailsById");
    con.query(
      `SELECT users.id as user_id, users.user_name, users.user_designation, users.user_work_email, users.reporting_officer_name, users.reporting_officer_designation, roles.id as role_id, roles.role_label, roles.role_description, role_activities.id as role_act_id, role_activities.activity, role_competencies.id as role_comp_id, role_competencies.competency, role_competencies.competency_level, role_competencies.competency_area 
      FROM users 
      LEFT JOIN  roles ON roles.user_id = users.id 
      LEFT JOIN role_activities ON role_activities.role_id=roles.id 
      LEFT JOIN role_competencies ON role_competencies.role_id=roles.id 
      WHERE users.id= ?`,
      [userId],
      (error, result, fields) => {
        if (error) {
          callBack(error);
        }
        var roles = [];
        var rolename = [];

        for (var data of result) {
          if (!rolename.includes(data["role_label"])) {
            rolename.push(data["role_label"]);
            roles.push({
              databaseRolesId: data["role_id"],
              label: data["role_label"],
              description: data["role_description"],
              activity: [],
              databaseActRoleIds: [],
              databaseRoleCompIds: [],
              competency: [],
              competency_area: [],
              competency_level: [],
            });
          }
          var index = rolename.indexOf(data["role_label"]);
          if (
            !roles[index]["databaseActRoleIds"].includes(data["role_act_id"])
          ) {
            roles[index]["databaseActRoleIds"].push(data["role_act_id"]);
          }

          if (
            !roles[index]["databaseRoleCompIds"].includes(data["role_comp_id"])
          ) {
            roles[index]["databaseRoleCompIds"].push(data["role_comp_id"]);
          }

          if (!roles[index]["activity"].includes(data["activity"])) {
            roles[index]["activity"].push(data["activity"]);
          }

          if (!roles[index]["competency"].includes(data["competency"])) {
            roles[index]["competency"].push(data["competency"]);
          }

          if (
            !roles[index]["competency_area"].includes(data["competency_area"])
          ) {
            roles[index]["competency_area"].push(data["competency_area"]);
          }

          if (
            !roles[index]["competency_level"].includes(data["competency_level"])
          ) {
            roles[index]["competency_level"].push(data["competency_level"]);
          }
        }

        var response = [];
        if (result[0] && result[0]["user_id"]) {
          response.push({
            databaseUserId: result[0]["user_id"],
            name: result[0]["user_name"],
            designation: result[0]["user_designation"],
            user_work_email: result[0]["user_work_email"],
            reporting_officer: result[0]["reporting_officer_name"],
            reporting_officer_designation:
              result[0]["reporting_officer_designation"],
            roles: roles,
          });
          return callBack(null, response);
        } else {
          response = {
            status: 204,
            message: "Record not found.",
          };
          return callBack(null, response);
        }
      }
    );
  },

  deleleAllFromTable: (tableName, callBack) => {
    console.log("Function: deleleAllFromTable");
    try {
      var sql = "DELETE FROM ??";
      con.query(sql, tableName, function (err, result) {
        if (err) {
          response = { status: 400, error: err };
          console.log("Error: " + err.code);
          return callBack(null, response);
        } else {
          response = {
            status: 200,
            message: "Records deleted successfully.",
          };
          return callBack(null, response);
        }
      });
    } catch (err) {
      response = { status: 400, error: err, name: "delete error" };
      return callBack(null, response);
    }
  },

  deleteSingleRecord: (tableName, fieldName, value, callBack) => {
    console.log("Function: deleteSingleRecord");
    try {
      var sql = "DELETE FROM ?? WHERE ?? = ?";
      con.query(sql, [tableName, fieldName, value], function (err, result) {
        if (err) {
          response = { status: 400, error: err };
          console.log("Error: " + err.code);
          return callBack(null, response);
        } else {
          if (result.affectedRows > 0) {
            response = {
              status: 200,
              message: "Record deleted successfully.",
            };
          } else {
            response = {
              status: 204,
              message: "Record not found",
            };
          }

          return callBack(null, response);
        }
      });
    } catch (err) {
      response = { status: 400, error: err, name: "delete error" };
      return callBack(null, response);
    }
  },

  deleteRoleById: (id, callBack) => {
    console.log("Function: deleteRoleById");
    try {
      var actDeleteSql = "DELETE FROM role_activities WHERE role_id = ?";
      con.query(actDeleteSql, id, function (err, result) {
        if (err) {
          response = { status: 400, error: err };
          console.log("Error: " + err.code);
          return callBack(null, response);
        } else {
          var compDeleteSql = "DELETE FROM role_competencies WHERE role_id = ?";
          con.query(compDeleteSql, id, function (compDelErr, compDelRes) {
            if (compDelErr) {
              response = { status: 400, error: compDelErr };
              console.log("Error: " + compDelErr.code);
            } else {
              var roleDeleteSql = "DELETE FROM roles WHERE id = ?";
              con.query(roleDeleteSql, id, function (roleDelErr, roleDelRes) {
                if (roleDelErr) {
                  response = { status: 400, error: roleDelErr };
                  console.log("Error: " + roleDelErr.code);
                } else {
                  if(roleDelRes.affectedRows > 0) {
                    response = {
                      status: 200,
                      message: "Record deleted successfully.",
                    };
                  } else {
                    response = {
                      status: 204,
                      message: "Record not found",
                    };
                  }
                  
                  return callBack(null, response);
                }
              });
            }
          });
        }
      });
    } catch (err) {
      response = { status: 400, error: err, name: "delete error" };
      return callBack(null, response);
    }
  },

  downloadAsCSV: (userId, res) => {
    console.log("Function: downloadAsCSV");
    con.query(
      `SELECT users.id as user_id, users.user_name, users.user_designation, users.user_work_email, users.reporting_officer_name, users.reporting_officer_designation, users.reporting_officer_department, roles.id as role_id, roles.role_label, roles.role_description, role_activities.id as role_act_id, role_activities.activity, role_competencies.id as role_comp_id, role_competencies.competency, role_competencies.competency_level, role_competencies.competency_area 
      FROM users 
      LEFT JOIN  roles ON roles.user_id = users.id 
      LEFT JOIN role_activities ON role_activities.role_id=roles.id 
      LEFT JOIN role_competencies ON role_competencies.role_id=roles.id 
      WHERE users.id= ?`,
      [userId],
      (error, result, fields) => {
        if (error) {
          callBack(error);
        }
        var roles = [];
        var rolename = [];

        for (var data of result) {
          if (!rolename.includes(data["role_label"])) {
            rolename.push(data["role_label"]);
            roles.push({
              label: data["role_label"],
              description: data["role_description"],
              activity: [],
              competency: [],
              competency_area: [],
              competency_level: [],
            });
          }
          var index = rolename.indexOf(data["role_label"]);

          if (!roles[index]["activity"].includes(data["activity"])) {
            roles[index]["activity"].push(data["activity"]);
          }

          if (!roles[index]["competency"].includes(data["competency"])) {
            roles[index]["competency"].push(data["competency"]);
          }

          if (
            !roles[index]["competency_area"].includes(data["competency_area"])
          ) {
            roles[index]["competency_area"].push(data["competency_area"]);
          }

          if (
            !roles[index]["competency_level"].includes(data["competency_level"])
          ) {
            roles[index]["competency_level"].push(data["competency_level"]);
          }
        }

        var response = [];

        // let rolesArray = [];
        // let activitiesArray = [];
        // let competenciesArray = [];
        // let competencyAreaArray = [];
        // let competencyLevelArray = [];

        // roles.map((i, j) => {
        //   rolesArray.push(i.label);
        //   i.activity.map((m, n) => {
        //     activitiesArray.push(m);
        //   });
        //   i.competency.map((m, n) => {
        //     competenciesArray.push(m);
        //   });
        //   i.competency_area.map((m, n) => {
        //     competencyAreaArray.push(m);
        //   });
        //   i.competency_level.map((m, n) => {
        //     competencyLevelArray.push(m);
        //   });
        // });

        // response.push({
        //   name: result[0]["user_name"],
        //   designation: result[0]["user_designation"],
        //   user_work_email: result[0]["user_work_email"],
        //   reporting_officer: result[0]["reporting_officer_name"],
        //   reporting_officer_designation:
        //     result[0]["reporting_officer_designation"],
        //   reporting_officer_department:
        //     result[0]["reporting_officer_department"],
        //   roles: rolesArray.toString(),
        //   activities: activitiesArray.toString(),
        //   competencies: competenciesArray.toString(),
        //   competencyArea: competencyAreaArray.toString(),
        //   competencyLevel: competencyLevelArray.toString(),
        // });

        const customFields = [
          "Name",
          "Position",
          "Work email",
          "Reporting officer name",
          "Reporting officer designation",
          "Department",
          "Role's",
          "Activity's",
          "Competency's",
          "Competency Area's",
          "Competency Level's",
        ];

        result.map((k, l) => {
          let data = {
            name: k.user_name,
            designation: k.user_designation,
            user_work_email: k.user_work_email,
            reporting_officer: k.reporting_officer_name,
            reporting_officer_designation: k.reporting_officer_designation,
            reporting_officer_department: k.reporting_officer_department,
            role: k.role_label,
            activities: k.activity,
            competencies: k.competency,
            competencyArea: k.competency_area,
            competencyLevel: k.competency_level,
          };

          response.push(data);
        });

        const parserFields = new CSVParser({ customFields });
        const parserData = parserFields.parse(response);

        res.set("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${response[0].name}.csv`
        );
        res.attachment(`${response[0].name}.csv`);

        res.status(200).send(parserData);
      }
    );
  },

  downloadAsCSVForDept: (departmentName, res) => {
    console.log("Function: downloadAsCSVForDept");

    con.query(
      `SELECT users.id as user_id, users.user_name, users.user_designation, users.user_work_email, users.reporting_officer_name, users.reporting_officer_designation, users.reporting_officer_department, roles.id as role_id, roles.role_label, roles.role_description, role_activities.id as role_act_id, role_activities.activity, role_competencies.id as role_comp_id, role_competencies.competency, role_competencies.competency_level, role_competencies.competency_area 
      FROM users 
      LEFT JOIN  roles ON roles.user_id = users.id 
      LEFT JOIN role_activities ON role_activities.role_id=roles.id 
      LEFT JOIN role_competencies ON role_competencies.role_id=roles.id 
      WHERE users.reporting_officer_department= ?`,
      [departmentName],
      (error, result, fields) => {
        if (error) {
          callBack(error);
        }
        var roles = [];
        var rolename = [];

        for (var data of result) {
          if (!rolename.includes(data["role_label"])) {
            rolename.push(data["role_label"]);
            roles.push({
              label: data["role_label"],
              description: data["role_description"],
              activity: [],
              competency: [],
              competency_area: [],
              competency_level: [],
            });
          }
          var index = rolename.indexOf(data["role_label"]);

          if (!roles[index]["activity"].includes(data["activity"])) {
            roles[index]["activity"].push(data["activity"]);
          }

          if (!roles[index]["competency"].includes(data["competency"])) {
            roles[index]["competency"].push(data["competency"]);
          }

          if (
            !roles[index]["competency_area"].includes(data["competency_area"])
          ) {
            roles[index]["competency_area"].push(data["competency_area"]);
          }

          if (
            !roles[index]["competency_level"].includes(data["competency_level"])
          ) {
            roles[index]["competency_level"].push(data["competency_level"]);
          }
        }

        var response = [];

        const customFields = [
          "Name",
          "Position",
          "Work email",
          "Reporting officer name",
          "Reporting officer designation",
          "Department",
          "Role",
          "Activity",
          "Competency",
          "Competency Area",
          "Competency Level",
        ];

        result.map((k, l) => {
          let data = {
            name: k.user_name,
            designation: k.user_designation,
            user_work_email: k.user_work_email,
            reporting_officer: k.reporting_officer_name,
            reporting_officer_designation: k.reporting_officer_designation,
            reporting_officer_department: k.reporting_officer_department,
            role: k.role_label,
            activities: k.activity,
            competencies: k.competency,
            competencyArea: k.competency_area,
            competencyLevel: k.competency_level,
          };

          response.push(data);
        });

        const parserFields = new CSVParser({ customFields });
        const parserData = parserFields.parse(response);

        res.set("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${response[0].reporting_officer_department}.csv`
        );
        res.attachment(`${response[0].reporting_officer_department}.csv`);

        res.status(200).send(parserData);
      }
    );
  },

  getAllAdmins: (callBack) => {
    console.log("Function: getAllAdmin");

    con.query(
      `SELECT id, user_email, role, created_at, last_updated_at FROM wat_admin WHERE role = "admin"`,
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
