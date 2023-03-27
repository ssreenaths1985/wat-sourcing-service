const {
  getDepartmentDetailsByName,
  getAllDept,
  insertDepartments,
  getDeptList,
  deleteAnDepartment,
  getMappedAdmins,
  updateMDO,
  getMDODetail,
  createAdmins,
  getAllDeptByAdmin,
} = require("../models/dept.model");

module.exports = {
  getDepartmentDetails: (req, res) => {
    const params = req.params;
    getDepartmentDetailsByName(params.name, (error, results) => {
      if (error) {
        console.log(error);
        return;
      }
      var response = { success: 1, data: results };
      return res.json(results);
    });
  },

  getAllDepartments: (req, res) => {
    getAllDept((err, results) => {
      if (err) {
        return res.json({
          success: 0,
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  getAllDepartmentsByAdminId: (req, res) => {
    getAllDeptByAdmin(req.params.id, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  addDepartments: (req, res) => {
    insertDepartments(req.body, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      if (result.status === 409) {
        return res.status(409).json({
          success: 0,
          message: "MDO already exist!",
        });
      } else {
        return res.status(200).json({
          success: 1,
          message: `MDO inserted successfully.`,
        });
      }
    });
  },

  deleteDepartmentById: (req, res) => {
    deleteAnDepartment(req.params.id, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log(result);
      if (result.affectedRows > 0) {
        return res.json({
          success: 1,
          message: `MDO and its mapping were deleted successfully.`,
        });
      } else {
        return res.json({
          success: 1,
          message: `MDO not found.`,
        });
      }
    });
  },

  getAllDepartmentsList: (req, res) => {
    getDeptList((err, results) => {
      if (err) {
        return res.json({
          success: 0,
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  getAllMappedAdmins: (req, res) => {
    getMappedAdmins(req.params.id, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          error: err,
        });
      }

      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  updateMDOById: (req, res) => {
    updateMDO(req.params.id, req.body, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          error: err,
        });
      }
      if (results.data.affectedRows === 0) {
        return res.json({
          success: 1,
          message: `MDO with id ${req.params.id} not found.`,
        });
      } else {
        return res.json({
          success: 1,
          message: `MDO with id ${req.params.id} is updated successfully.`,
        });
      }
    });
  },

  getMDODetailByID: (req, res) => {
    getMDODetail(req.params.id, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  createAdminsForMDO: (req, res) => {
    createAdmins(req.body, (err, results) => {
      if (err) {
        return res.json({
          success: 0,
          error: err,
        });
      }

      if (results.status === 403) {
        return res.json({
          success: 1,
          data: results,
        });
      } else {
        return res.json({
          success: 1,
          data: "Record inserted and mapped successfully.",
        });
      }
    });
  },
};
