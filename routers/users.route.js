const AuthMiddleWare = require("../middlewares/jwt_token");

// import the controllers
const {
  login,
  getUsers,
  createUser,
  getUserDetails,
  userSignup,
  deleteAll,
  deleteAnRecord,
  updateUsersTableById,
  updateRolesTableById,
  updateRoleActivitiesTableById,
  updateRoleCompetenciesTableById,
  deleteAnRole,
  downloadData,
  getAdmins,
  downloadDataForDepartment,
} = require("../controllers/user.controller");

const {
  getDepartmentDetails,
  getAllDepartments,
  addDepartments,
  getAllDepartmentsList,
  deleteDepartmentById,
  getAllMappedAdmins,
  updateMDOById,
  getMDODetailByID,
  createAdminsForMDO,
  getAllDepartmentsByAdminId,
} = require("../controllers/dept.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * Public/Common routes
   **/

  app.post("/login", login);

  app.post("/save", createUser);

  app.get("/get/allMdos", getAllDepartmentsList);

  /**
   * Superadmin routes
   **/

  app.post(
    "/signup",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    userSignup
  );

  app.delete(
    "/deleteAll/:table",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    deleteAll
  );

  app.delete(
    "/deleteAnRecord/:table/:field/:value",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    deleteAnRecord
  );

  app.post(
    "/add/mdo",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    addDepartments
  );

  app.get(
    "/get/admins",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    getAdmins
  );

  app.delete(
    "/delete/mdo/:id",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    deleteDepartmentById
  );

  app.get(
    "/get/mappedAdmins/:id",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    getAllMappedAdmins
  );

  app.put(
    "/update/mdo/:id",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    updateMDOById
  );

  app.get(
    "/get/mdo/:id",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    getMDODetailByID
  );

  app.post(
    "/create/mdo/admin",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isSuperAdmin],
    createAdminsForMDO
  );

  /**
   * Admin routes
   **/

  app.get(
    "/mdo/:name",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
    getDepartmentDetails
  );

  app.get(
    "/officer/:id",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
    getUserDetails
  );

  app.delete(
    "/deleteAnRole/:id",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
    deleteAnRole
  );

  app.put(
    "/update/users/:id",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
    updateUsersTableById
  );

  app.put(
    "/update/roles",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
    updateRolesTableById
  );

  app.get(
    "/download/:id",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
    downloadData
  );

  app.get(
    "/download/mdo/:name",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
    downloadDataForDepartment
  );

  app.get(
    "/get/admin/mdo/:id",
    [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
    getAllDepartmentsByAdminId
  );

  /**
   * Unused routes
   **/

  // app.get("/getAllUsers", [AuthMiddleWare.verifyToken], getUsers);

  // app.get(
  //   "/getDept",
  //   [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
  //   getAllDepartments
  // );

  // app.put(
  //   "/update/role_activities",
  //   [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
  //   updateRoleActivitiesTableById
  // );

  // app.put(
  //   "/update/role_competencies",
  //   [AuthMiddleWare.verifyToken, AuthMiddleWare.isAdmin],
  //   updateRoleCompetenciesTableById
  // );
};
