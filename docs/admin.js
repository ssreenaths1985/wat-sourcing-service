// Get offcier details by id
const getOfficerDetails = {
  tags: ["Admin"],
  description: "Get officer details by id",
  operationId: "getOfficerDetails",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/getOfficerDetailsRes1" },
              { $ref: "#/components/responses/getOfficerDetailsRes2" },
            ],
          },
        },
      },
    },
  },
};

// Get officer details response one
const getOfficerDetailsRes1 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          databaseUserId: {
            type: "integer",
            example: 60,
          },
          name: {
            type: "string",
            example: "Test name 1",
          },
          designation: {
            type: "string",
            example: "Position 1",
          },
          user_work_email: {
            type: "string",
            example: "work@email.com",
          },
          reporting_officer: {
            type: "string",
            example: "RO Name 1",
          },
          reporting_officer_designation: {
            type: "string",
            example: "RO Position 1",
          },
          roles: {
            type: "array",
            items: {
              type: "object",
              properties: {
                databaseRolesId: {
                  type: "integer",
                  example: 117,
                },
                label: {
                  type: "string",
                  example: "Role 1",
                },
                description: {
                  type: "string",
                  example: "Desc 1",
                },
                activity: {
                  type: "array",
                  items: {
                    type: "string",
                    example: "Act 1",
                  },
                },
                databaseActRoleIds: {
                  type: "array",
                  items: {
                    type: "integer",
                    example: 250,
                  },
                },
                databaseRoleCompIds: {
                  type: "array",
                  items: {
                    type: "integer",
                    example: 166,
                  },
                },
                competency: {
                  type: "array",
                  items: {
                    type: "string",
                    example: "Comp 1",
                  },
                },
                competency_area: {
                  type: "array",
                  items: {
                    type: "string",
                    example: "Area 1",
                  },
                },
                competency_level: {
                  type: "array",
                  items: {
                    type: "string",
                    example: "Level 2",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// Get officer details response two
const getOfficerDetailsRes2 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    data: {
      type: "object",
      properties: {
        type: "object",
        properties: {
          status: {
            type: "integer",
            example: 204,
          },
          message: {
            type: "string",
            example: "Record not found.",
          },
        },
      },
    },
  },
};

// Update user details by id
const updateUserDetails = {
  tags: ["Admin"],
  description: "Update user details by id",
  operationId: "updateUserDetails",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/updateUserDetailsPayload",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/updateUserDetailsRes1" },
              { $ref: "#/components/responses/updateUserDetailsRes2" },
            ],
          },
        },
      },
    },
  },
};

// Update user details request
const updateUserDetailsPayload = {
  type: "object",
  properties: {
    adminId: {
      type: "integer",
      example: 73,
    },
    user_name: {
      type: "string",
      example: "Test name 2",
    },
    user_designation: {
      type: "string",
      example: "Position 2",
    },
    user_work_email: {
      type: "string",
      example: "work@email.com",
    },
    reporting_officer_name: {
      type: "string",
      example: "RO Name 2",
    },
    reporting_officer_designation: {
      type: "string",
      example: "RO Position 1",
    },
    reporting_officer_department: {
      type: "string",
      example: "Department of Economic Affairs",
    },
  },
};

// Update user details response one
const updateUserDetailsRes1 = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Record with id 61 from users table is updated.",
    },
  },
};

// Update user details response two
const updateUserDetailsRes2 = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Record with id 62 from users table is not found.",
    },
  },
};

// Update roles details
const updateRolesDetails = {
  tags: ["Admin"],
  description: "Update roles details",
  operationId: "updateRolesDetails",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/updateRolesDetailsPayload",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "integer",
                example: 200,
              },
              message: {
                type: "string",
                example: "Records updated successfully.",
              },
            },
          },
        },
      },
    },
  },
};

// Update roles details request
const updateRolesDetailsPayload = {
  type: "array",
  items: {
    type: "object",
    properties: {
      roleLabel: {
        type: "string",
        example: "Role 1",
      },
      roleDescription: {
        type: "string",
        example: "Desc 1",
      },
      activities: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 250,
            },
            parent: {
              type: "integer",
              example: 0,
            },
            label: {
              type: "string",
              example: "Act 1",
            },
          },
        },
      },
      competencies: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 166,
            },
            parent: {
              type: "integer",
              example: 0,
            },
            label: {
              type: "string",
              example: "Comp 1",
            },
            area: {
              type: "string",
              example: "Area 1",
            },
            level: {
              type: "string",
              example: "Level 2",
            },
          },
        },
      },
      id: {
        type: "string",
        example: "117",
      },
      userId: {
        type: "string",
        example: "62",
      },
      adminId: {
        type: "integer",
        example: 73,
      },
    },
  },
};

// Download user level data
const downloadUserLevelData = {
  tags: ["Admin"],
  description: "Download user level details",
  operationId: "downloadUserLevelData",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "Download user level details as CSV",
      content: {
        "text/csv": {
          schema: {
            type: "string",
            example: `"name","designation","user_work_email","reporting_officer","reporting_officer_designation","reporting_officer_department","role","activities","competencies","competencyArea","competencyLevel"`,
          },
        },
      },
    },
  },
};

// Download department level data
const downloadDeptLevelData = {
  tags: ["Admin"],
  description: "Download MDO level details",
  operationId: "downloadDeptLevelData",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "Download the MDO level data as CSV",
      content: {
        "text/csv": {
          schema: {
            type: "string",
            example: `"name","designation","user_work_email","reporting_officer","reporting_officer_designation","reporting_officer_department","role","activities","competencies","competencyArea","competencyLevel"`,
          },
        },
      },
    },
  },
};

// Get MDO's by admin id
const getMDOByAdmin = {
  tags: ["Admin"],
  description: "Get all MDO by admin id",
  operationId: "getMDOByAdmin",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "Get the list of MDO's to which the admin is assigned to",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/getMDOByAdminRes1" },
              { $ref: "#/components/responses/getMDOByAdminRes1" },
            ],
          },
        },
      },
    },
  },
};

// Get all MDOs by admin response one
const getMDOByAdminRes1 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 27,
          },
          name: {
            type: "string",
            example: "Department of Expenditure",
          },
          created_at: {
            type: "string",
            example: "2022-01-10T03:51:37.000Z",
          },
          last_updated_at: {
            type: "string",
            example: "2022-01-16T23:45:04.000Z",
          },
          created_by: {
            type: "integer",
            example: 9,
          },
          updated_by: {
            type: "integer",
            example: 9,
          },
        },
      },
    },
  },
};

// Get all MDOs by admin response two
const getMDOByAdminRes2 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    data: {
      type: "object",
      properties: {
        status: {
          type: "integer",
          example: 200,
        },
        message: {
          type: "string",
          example: "No department mapping found!",
        },
        data: {
          type: "array",
          example: [],
        },
      },
    },
  },
};

// Delete role and its mappings by roleId
const deleteRoleAndItsMappings = {
  tags: ["Admin"],
  description: "Delete role and its mappings by roleId",
  operationId: "deleteRoleAndItsMappings",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description:
        "Delete a role using its id and also its mappings to other items",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/deleteRoleAndItsMappingsRes1" },
              { $ref: "#/components/responses/deleteRoleAndItsMappingsRes2" },
            ],
          },
        },
      },
    },
  },
};

// Delete role and its mappings by roleId response one
const deleteRoleAndItsMappingsRes1 = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Record with id 68 in roles table is deleted.",
    },
  },
};

// Delete role and its mappings by roleId response two
const deleteRoleAndItsMappingsRes2 = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Record with id 68 in roles table is not found.",
    },
  },
};

// Get MDO detail by name
const getMDODetailByName = {
  tags: ["Admin"],
  description: "Get MDO detail by its name",
  operationId: "getMDODetailByName",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "Get MDO metadata by its name",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/getMDODetailByNameRes1" },
              { $ref: "#/components/responses/getMDODetailByNameRes2" },
            ],
          },
        },
      },
    },
  },
};

// Get MDO detail by name response one
const getMDODetailByNameRes1 = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 61,
      },
      user_name: {
        type: "string",
        example: "Department of Revenue",
      },
      user_designation: {
        type: "string",
        example: "Deputy Director",
      },
      reporting_officer_name: {
        type: "string",
        example: "Rahul Kumar",
      },
    },
  },
};

// Get MDO detail by name response two
const getMDODetailByNameRes2 = {
  type: "array",
  example: [],
};

module.exports = {
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
};
