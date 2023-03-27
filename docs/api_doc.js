const {
  superAdminLogin,
  loginPayload,
  createMDO,
  createMDOPayload,
  getAllAdmins,
  getAllMappedAdmins,
  getAllMappedAdminsRes1,
  getAllMappedAdminsRes2,
  updateMDO,
  updateMDOPayload,
  updateMDORes1,
  updateMDORes2,
  getMDODetails,
  getMDODetailsRes1,
  getMDODetailsRes2,
  createAdminsMDO,
  createAdminsMDOPayload,
  createAdminsMDORes1,
  createAdminsMDORes2,
  deleteAllFromTable,
  deleteAllFromTableRes1,
  deleteAllFromTableRes2,
  deleteAnRecordFromTable,
  deleteAnRecordFromTableRes1,
  deleteAnRecordFromTableRes2,
  adminUserSignUp,
  adminUserSignUpPayload,
  adminUserSignUpRes1,
  adminUserSignUpRes2,
  deleteAnMDOById,
  deleteAnMDOByIdRes1,
  deleteAnMDOByIdRes2,
} = require("./super_admin");

const {
  getOfficerDetails,
  getOfficerDetailsRes1,
  getOfficerDetailsRes2,
  updateUserDetails,
  updateUserDetailsPayload,
  updateUserDetailsRes1,
  updateUserDetailsRes2,
  updateRolesDetails,
  updateRolesDetailsPayload,
  downloadUserLevelData,
  downloadDeptLevelData,
  getMDOByAdmin,
  getMDOByAdminRes1,
  getMDOByAdminRes2,
  deleteRoleAndItsMappings,
  deleteRoleAndItsMappingsRes1,
  deleteRoleAndItsMappingsRes2,
  getMDODetailByName,
  getMDODetailByNameRes1,
  getMDODetailByNameRes2,
} = require("./admin");

const {
  getAllMDOs,
  getAllMDOsRes1,
  getAllMDOsRes2,
  submitSurveyData,
  submitSurveyDataPayload,
} = require("./public_api");

const apiDocumentation = {
  openapi: "3.0.3",
  info: {
    version: "3.0",
    title: "WAT Sourcing",
    description: "Sourcing tool for MDO's to get officer details",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Server",
    },
    {
      url: "https://officer-survey.igot-dev.in/watapis",
      description: "Development Server",
    },
  ],
  tags: [
    {
      name: "Superadmin",
    },
    {
      name: "Admin",
    },
    {
      name: "Public",
    },
  ],
  paths: {
    "/login": {
      post: superAdminLogin,
    },
    "/signup": {
      post: adminUserSignUp,
    },
    "/add/mdo": {
      post: createMDO,
    },
    "/create/mdo/admin": {
      post: createAdminsMDO,
    },
    "/get/admins": {
      get: getAllAdmins,
    },
    "/get/mappedAdmins/{id}": {
      get: getAllMappedAdmins,
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
    },
    "/get/mdo/{id}": {
      get: getMDODetails,
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
    },
    "/update/mdo/{id}": {
      put: updateMDO,
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
    },
    "/deleteAll/{table}": {
      delete: deleteAllFromTable,
      parameters: [
        {
          in: "path",
          name: "table",
          required: true,
        },
      ],
    },
    "/deleteAnRecord/{table}/{field}/{value}": {
      delete: deleteAnRecordFromTable,
      parameters: [
        {
          in: "path",
          name: "table",
          required: true,
        },
        {
          in: "path",
          name: "field",
          required: true,
        },
        {
          in: "path",
          name: "value",
          required: true,
        },
      ],
    },
    "/delete/mdo/{id}": {
      delete: deleteAnMDOById,
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
    },
    "/officer/{id}": {
      get: getOfficerDetails,
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
    },
    "/download/{id}": {
      get: downloadUserLevelData,
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
    },
    "/download/mdo/{name}": {
      get: downloadDeptLevelData,
      parameters: [
        {
          in: "path",
          name: "name",
          required: true,
        },
      ],
    },
    "/get/admin/mdo/{id}": {
      get: getMDOByAdmin,
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
    },
    "/mdo/{name}": {
      get: getMDODetailByName,
      parameters: [
        {
          in: "path",
          name: "name",
          required: true,
        },
      ],
    },
    "/update/users/{id}": {
      put: updateUserDetails,
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
    },
    "/update/roles": {
      put: updateRolesDetails,
    },
    "/deleteAnRole/{id}": {
      delete: deleteRoleAndItsMappings,
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
        },
      ],
    },
    "/save": {
      post: submitSurveyData,
    },
    "/get/allMdos": {
      get: getAllMDOs,
    },
  },
  components: {
    securitySchemes: {
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-access-token",
      },
    },
    schemas: {
      loginPayload,
      createMDOPayload,
      updateMDOPayload,
      createAdminsMDOPayload,
      adminUserSignUpPayload,
      updateUserDetailsPayload,
      updateRolesDetailsPayload,
      submitSurveyDataPayload,
    },
    responses: {
      getAllMappedAdminsRes1,
      getAllMappedAdminsRes2,
      updateMDORes1,
      updateMDORes2,
      getMDODetailsRes1,
      getMDODetailsRes2,
      createAdminsMDORes1,
      createAdminsMDORes2,
      deleteAllFromTableRes1,
      deleteAllFromTableRes2,
      deleteAnRecordFromTableRes1,
      deleteAnRecordFromTableRes2,
      adminUserSignUpRes1,
      adminUserSignUpRes2,
      getOfficerDetailsRes1,
      getOfficerDetailsRes2,
      updateUserDetailsRes1,
      updateUserDetailsRes2,
      getMDOByAdminRes1,
      getMDOByAdminRes2,
      deleteRoleAndItsMappingsRes1,
      deleteRoleAndItsMappingsRes2,
      getMDODetailByNameRes1,
      getMDODetailByNameRes2,
      getAllMDOsRes1,
      getAllMDOsRes2,
      deleteAnMDOByIdRes1,
      deleteAnMDOByIdRes2,
    },
  },
};

module.exports = apiDocumentation;
