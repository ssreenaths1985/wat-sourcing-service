// For login
const superAdminLogin = {
  tags: ["Superadmin"],
  description: "Login user into superadmin portal",
  operationId: "login",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/loginPayload",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "User login object",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "integer",
                example: 1,
              },
              data: {
                type: "object",
                properties: {
                  userName: {
                    type: "string",
                    example: "superadmin@sourcing.com",
                  },
                  role: {
                    type: "string",
                    example: "superAdmin",
                  },
                  superAdminId: {
                    type: "integer",
                    example: 9,
                  },
                },
              },
              token: {
                type: "string",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksIm5hbWUiOiJzdXBlcmFkbWluQHNvdXJjaW5nLmNvbSIsImlhdCI6MTY0MTk3MTE3OCwiZXhwIjoxNjQyMDU3NTc4fQ.GbNjY_8_9SlUpMyJ6rUWHPg4gjPVYRGGKTvJj_8rqvY",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Login failed object",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "integer",
                example: 0,
              },
              data: {
                type: "string",
                example: "Invalid credentials",
              },
            },
          },
        },
      },
    },
  },
};

// Login request payload
const loginPayload = {
  type: "object",
  properties: {
    email: {
      type: "string",
      example: "superadmin@sourcing.com",
    },
    password: {
      type: "string",
      description: "Unencrypted user's password",
      example: "$2b$10$zANMJEBVFoM6PjChDDWGROD58dIeygKPuIBcRPWkkDPwLt0ZjJADW",
    },
  },
};

// For creating new MDO
const createMDO = {
  tags: ["Superadmin"],
  description: "Create MDO",
  operationId: "createMDO",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/createMDOPayload",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "Create MDO object",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "integer",
                example: 1,
              },
              message: {
                type: "string",
                example: "MDO inserted successfully.",
              },
            },
          },
        },
      },
    },
    409: {
      description: "MDO exist object",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "integer",
                example: 0,
              },
              message: {
                type: "string",
                example: "MDO already exist!",
              },
            },
          },
        },
      },
    },
  },
};

// Create new MDO payload
const createMDOPayload = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          departmentName: {
            type: "string",
            example: "Department of Revenue",
          },
          superAdminId: {
            type: "integer",
            example: 9,
          },
        },
      },
    },
  },
};

// For getting all admins
const getAllAdmins = {
  tags: ["Superadmin"],
  description: "Get all admins",
  operationId: "getAllAdmins",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "List all available admins",
      content: {
        "application/json": {
          schema: {
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
                      example: 1,
                    },
                    user_email: {
                      type: "string",
                      example: "admin@sourcing.com",
                    },
                    role: {
                      type: "string",
                      example: "admin",
                    },
                    created_at: {
                      type: "string",
                      example: "2021-12-27T14:14:20.000Z",
                    },
                    last_updated_at: {
                      type: "string",
                      example: "2021-12-27T09:02:30.000Z",
                    },
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

// Get all mapped admins by MDO
const getAllMappedAdmins = {
  tags: ["Superadmin"],
  description: "Get all mapped admins by MDO",
  operationId: "getAllMappedAdmins",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "List all mapped admins by MDO",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/getAllMappedAdminsRes1" },
              { $ref: "#/components/responses/getAllMappedAdminsRes2" },
            ],
          },
        },
      },
    },
  },
};

// Get all mapped admins by MDO response type 1
const getAllMappedAdminsRes1 = {
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
            example: 1,
          },
          user_email: {
            type: "string",
            example: "admin@sourcing.com",
          },
          mdo: {
            type: "string",
            example: "Department of Economic Affairs",
          },
          mdoId: {
            type: "string",
            example: "23",
          },
          mappingId: {
            type: "integer",
            example: 35,
          },
        },
      },
    },
  },
};

// Get all mapped admins by MDO response type 2
const getAllMappedAdminsRes2 = {
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
            example: 404,
          },
          message: {
            type: "string",
            example: "No mappings found!",
          },
          data: {
            type: "object",
            properties: {
              mdoId: {
                type: "string",
                example: "27",
              },
              mdo: {
                type: "string",
                example: "Department of Revenue",
              },
            },
          },
        },
      },
    },
  },
};

// Update MDO by id
const updateMDO = {
  tags: ["Superadmin"],
  description: "Update MDO name using its id",
  operationId: "updateMDOByID",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  requestBody: {
    description: "Request payload for update MDO name by its id",
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/updateMDOPayload",
        },
      },
    },
  },
  responses: {
    200: {
      description: "MDO updated",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/updateMDORes1" },
              { $ref: "#/components/responses/updateMDORes2" },
            ],
          },
        },
      },
    },
  },
};

// Update MDO request payload
const updateMDOPayload = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          departmentName: {
            type: "string",
            example: "Ministry of Telecommunications",
          },
          superAdminId: {
            type: "integer",
            example: 9,
          },
        },
      },
    },
  },
};

// Update MDO response one
const updateMDORes1 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    message: {
      type: "string",
      example: "MDO with id 27 is updated successfully.",
    },
  },
};

// Update MDO response two
const updateMDORes2 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    message: {
      type: "string",
      example: "MDO with id 2 not found.",
    },
  },
};

// Get MDO details by id
const getMDODetails = {
  tags: ["Superadmin"],
  description: "Get MDO details by id",
  operationId: "getMDODetails",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "MDO details by id",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/getMDODetailsRes1" },
              { $ref: "#/components/responses/getMDODetailsRes2" },
            ],
          },
        },
      },
    },
  },
};

// Get MDO details response one
const getMDODetailsRes1 = {
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

// Get MDO details response two
const getMDODetailsRes2 = {
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
      },
    },
  },
};

// Create admins for MDO
const createAdminsMDO = {
  tags: ["Superadmin"],
  description: "Create admins and its mapping for MDO",
  operationId: "createAdminsMDO",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  requestBody: {
    description: "Request payload for create admins and its mapping for MDO",
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/createAdminsMDOPayload",
        },
      },
    },
  },
  responses: {
    200: {
      description: "Create admin and map to MDO",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/createAdminsMDORes1" },
              { $ref: "#/components/responses/createAdminsMDORes2" },
            ],
          },
        },
      },
    },
  },
};

// Create admins for MDO request
const createAdminsMDOPayload = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          mdoId: {
            type: "integer",
            example: 27,
          },
          superAdminId: {
            type: "integer",
            example: 9,
          },
          userEmail: {
            type: "string",
            example: "newAdmin5@sourcing.com",
          },
          userPassword: {
            type: "string",
            example: "newAdmin5@sourcing.com",
          },
          userRole: {
            type: "string",
            example: "admin",
          },
        },
      },
    },
  },
};

// Create admins MDO response one
const createAdminsMDORes1 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    data: {
      type: "string",
      example: "Record inserted and mapped successfully.",
    },
  },
};

// Create admins MDO response two
const createAdminsMDORes2 = {
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
          status: {
            type: "integer",
            example: 403,
          },
          message: {
            type: "string",
            example: "Mapping already exists!",
          },
        },
      },
    },
  },
};

// Delete all records from table
const deleteAllFromTable = {
  tags: ["Superadmin"],
  description: "Delete all records from an table",
  operationId: "deleteAllFromTable",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "Delete all records from an table by its name",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/deleteAllFromTableRes1" },
              { $ref: "#/components/responses/deleteAllFromTableRes2" },
            ],
          },
        },
      },
    },
  },
};

// Delete all records from table response one
const deleteAllFromTableRes1 = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "All entries from users table is deleted.",
    },
  },
};

// Delete all records from table response two
const deleteAllFromTableRes2 = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "user not found.",
    },
  },
};

// Delete an record from table
const deleteAnRecordFromTable = {
  tags: ["Superadmin"],
  description: "Delete an record from an table",
  operationId: "deleteAnRecordFromTable",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description:
        "Delete a record from an table by its name, field and item id",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/deleteAnRecordFromTableRes1" },
              { $ref: "#/components/responses/deleteAnRecordFromTableRes2" },
            ],
          },
        },
      },
    },
  },
};

// Delete an record from table response one
const deleteAnRecordFromTableRes1 = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example:
        "Record with field name id and with value 42 from departments table is deleted.",
    },
  },
};

// Delete an record from table response two
const deleteAnRecordFromTableRes2 = {
  type: "object",
  properties: {
    message: {
      type: "string",
      example: "Record not found.",
    },
  },
};

// Create superadmin
const adminUserSignUp = {
  tags: ["Superadmin"],
  description: "Create superadmins",
  operationId: "adminUserSignUp",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/adminUserSignUpPayload",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "Create superadmin for the system",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/adminUserSignUpRes1" },
              { $ref: "#/components/responses/adminUserSignUpRes2" },
            ],
          },
        },
      },
    },
    401: {
      description: "Invalid JSON",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "integer",
                example: 401,
              },
              error: {
                type: "string",
                example: "Invalid json format...",
              },
            },
          },
        },
      },
    },
  },
};

// Create superadmin request
const adminUserSignUpPayload = {
  type: "object",
  properties: {
    userName: {
      type: "string",
      example: "superadmin2@sourcing.com",
    },
    userPassword: {
      type: "string",
      example: "superadmin2@sourcing.com",
    },
    userRole: {
      type: "string",
      example: "superAdmin",
    },
  },
};

// Create superadmin response one
const adminUserSignUpRes1 = {
  type: "object",
  properties: {
    status: {
      type: "integer",
      example: 200,
    },
    message: {
      type: "string",
      example: "Records inserted successfully.",
    },
  },
};

// Create superadmin response two
const adminUserSignUpRes2 = {
  type: "object",
  properties: {
    status: {
      type: "integer",
      example: 202,
    },
    name: {
      type: "string",
      example: "superadmin2@sourcing.com",
    },
    message: {
      type: "string",
      example: "Username already exists.",
    },
  },
};

// Delete an MDO by its id
const deleteAnMDOById = {
  tags: ["Superadmin"],
  description: "Delete an MDO by its id",
  operationId: "deleteAnMDOById",
  security: [
    {
      apiKeyAuth: [],
    },
  ],
  responses: {
    200: {
      description: "Delete an MDO and its admin mapping by id",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/deleteAnMDOByIdRes1" },
              { $ref: "#/components/responses/deleteAnMDOByIdRes2" },
            ],
          },
        },
      },
    },
  },
};

// Delete an department by its id response one
const deleteAnMDOByIdRes1 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    message: {
      type: "string",
      example: "MDO and its mapping were deleted successfully",
    },
  },
};

// Delete an department by its id response two
const deleteAnMDOByIdRes2 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    message: {
      type: "string",
      example: "MDO not found.",
    },
  },
};

module.exports = {
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
};
