const {
  getUsers,
  getUserByUserEmail,
  createUser,
  userSignup,
  getUserDetailsById,
  deleleAllFromTable,
  deleteSingleRecord,
  updateUsersTable,
  updateRolesTable,
  updateRoleActivtiesTable,
  updateRoleCompetenciesTable,
  insertCompetencies,
  insertRoles,
  deleteRoleById,
  downloadAsCSV,
  getAllAdmins,
  downloadAsCSVForDept,
} = require("../models/user.model");

require("dotenv").config();
const { loginAccesToken } = require("../middlewares/jwt_token");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");

module.exports = {
  // This API is used to get data from WAT - Sourcing FE & Save data in MySQL
  createUser: (req, res) => {
    console.log("Got a POST request to save data...");

    var data, response;
    if (req.get("Content-Type") != "application/json") {
      response = { status: 401, error: "Invalid header format..." };
      return res.status(response.status).json(response);
    }
    try {
      data = req.body;
      // const salt = genSaltSync(10);
      // data.userPassword = hashSync(data.userPassword, salt);
      createUser(data, res);
    } catch (err) {
      response = { status: 401, error: "Invalid json format..." };
      return res.status(response.status).json(response);
    }
  },

  userSignup: (req, res) => {
    var data, response;
    if (req.get("Content-Type") != "application/json") {
      response = { status: 401, error: "Invalid header format..." };
      return res.status(response.status).json(response);
    }
    try {
      data = req.body;
      if (data.userPassword && data.userName) {
        const salt = genSaltSync(10);
        data.userPassword = hashSync(data.userPassword, salt);
        // console.log(data)
        userSignup(data, res);
      } else {
        response = { status: 401, error: "Invalid json format..." };
        return res.status(response.status).json(response);
      }
    } catch (err) {
      response = { status: 401, error: "Invalid json format..." };
      return res.status(response.status).json(response);
    }
  },

  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  login: (req, res) => {
    const body = req.body;

    getUserByUserEmail(body.email, async (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.status(401).json({
          success: 0,
          message: "Invalid credentials",
        });
      }
      const result = compareSync(body.password, results.user_password);
      if (result) {
        let jsontoken = await loginAccesToken(results);

        if (results.role === "superAdmin") {
          return res.json({
            success: 1,
            data: {
              userName: results.user_email,
              role: results.role,
              superAdminId: results.id,
            },
            token: jsontoken,
          });
        } else {
          return res.json({
            success: 1,
            data: {
              userName: results.user_email,
              role: results.role,
              adminId: results.id,
            },
            token: jsontoken,
          });
        }
      } else {
        return res.status(401).json({
          success: 0,
          data: "Invalid credentials",
        });
      }
    });
  },

  getUserDetails: (req, res) => {
    const params = req.params;
    getUserDetailsById(params.id, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      return res.json({
        success: 1,
        data: result,
      });
    });
  },

  deleteAll: (req, res) => {
    let tableName = req.params.table;
    deleleAllFromTable(tableName, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      if (result.status === 400) {
        return res.json({
          message: `${tableName} not found.`,
        });
      } else {
        return res.json({
          message: `All entries from ${tableName} table is deleted.`,
        });
      }
    });
  },

  deleteAnRecord: (req, res) => {
    let tableName = req.params.table;
    let fieldName = req.params.field;
    let value = req.params.value;

    deleteSingleRecord(tableName, fieldName, value, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      if (result.status !== 204) {
        return res.json({
          message: `Record with field name ${fieldName} and with value ${value} from ${tableName} table is deleted.`,
        });
      } else {
        return res.json({
          message: "Record not found.",
        });
      }
    });
  },

  deleteAnRole: (req, res) => {
    let id = req.params.id;

    deleteRoleById(id, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      if (result.status !== 204) {
        return res.json({
          message: `Record with id ${id} in roles table is deleted.`,
        });
      } else {
        return res.json({
          message: `Record with id ${id} in roles table is not found.`,
        });
      }
    });
  },

  updateUsersTableById: (req, res) => {
    let userId = req.params;

    updateUsersTable(userId.id, req.body, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      if (result.status === 204) {
        return res.json({
          message: `Record with id ${userId.id} from users table is not found.`,
        });
      } else {
        return res.json({
          message: `Record with id ${userId.id} from users table is updated.`,
        });
      }
    });
  },

  updateRolesTableById: (req, res) => {
    let payload = req.body;

    updateRolesTable(payload, res, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      return res.json({
        message: `Record from roles table is updated.`,
      });
    });
  },

  // updateRoleActivitiesTableById: (req, res) => {
  //   let payload = req.body;

  //   updateRoleActivtiesTable(payload, res, (error, result) => {
  //     if (error) {
  //       console.log(error);
  //       return;
  //     }
  //     return res.json({
  //       message: `Record from role_activties table is updated.`,
  //     });
  //   });
  // },

  // updateRoleCompetenciesTableById: (req, res) => {
  //   let payload = req.body;

  //   updateRoleCompetenciesTable(payload, res, (error, result) => {
  //     if (error) {
  //       console.log(error);
  //       return;
  //     }
  //     return res.json({
  //       message: `Record from role_competencies table is updated.`,
  //     });
  //   });
  // },

  downloadData: (req, res) => {
    const params = req.params;

    downloadAsCSV(params.id, res, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      return res.json({
        success: 1,
        data: result,
      });
    });
  },

  downloadDataForDepartment: (req, res) => {
    const params = req.params;

    downloadAsCSVForDept(params.name, res, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      return res.json({
        success: 1,
        data: result,
      });
    });
  },

  getAdmins: (req, res) => {
    getAllAdmins((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
};
