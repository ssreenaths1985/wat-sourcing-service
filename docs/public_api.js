// Get all MDO list
const getAllMDOs = {
  tags: ["Public"],
  description: "Get all MDO names",
  operationId: "getAllMDOs",
  responses: {
    200: {
      description: "Get list of all MDO's",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { $ref: "#/components/responses/getAllMDOsRes1" },
              { $ref: "#/components/responses/getAllMDOsRes2" },
            ],
          },
        },
      },
    },
  },
};

// Get all MDO list response one
const getAllMDOsRes1 = {
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
            example: 23,
          },
          name: {
            type: "string",
            example: "Department of Economic Affairs",
          },
          created_at: {
            type: "string",
            example: "2022-01-06T01:18:57.000Z",
          },
          last_updated_at: {
            type: "string",
            example: "2022-01-06T01:18:57.000Z",
          },
          created_by: {
            type: "integer",
            example: 0,
          },
          updated_by: {
            type: "integer",
            example: 0,
          },
          adminCount: {
            type: "integer",
            example: 2,
          },
        },
      },
    },
  },
};

// Get all MDO list response two
const getAllMDOsRes2 = {
  type: "object",
  properties: {
    success: {
      type: "integer",
      example: 1,
    },
    data: {
      type: "array",
      example: [],
    },
  },
};

// Submit survey
const submitSurveyData = {
  tags: ["Public"],
  description: "Submit officer survey data",
  operationId: "submitSurveyData",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/submitSurveyDataPayload",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "Submit officer survey data to an MDO",
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
                example: "Records inserted successfully.",
              },
            },
          },
        },
      },
    },
  },
};

// Submit survey payload
const submitSurveyDataPayload = {
  type: "object",
  properties: {
    userName: {
      type: "string",
      example: "Test name 20",
    },
    userDesignation: {
      type: "string",
      example: "Position 20",
    },
    userWorkEmail: {
      type: "string",
      example: "work@email.com",
    },
    reportingOfficerName: {
      type: "string",
      example: "RO Name 20",
    },
    reportingOfficerDesignation: {
      type: "string",
      example: "RO Position 20",
    },
    reportingOfficerDepartment: {
      type: "string",
      example: "Department of Expenditure",
    },
    roles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          roleLabel: {
            type: "string",
            example: "Role 20",
          },
          roleDescription: {
            type: "string",
            example: "Desc 20",
          },
          activities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: 0,
                },
                parent: {
                  type: "integer",
                  example: 0,
                },
                label: {
                  type: "string",
                  example: "Act 20",
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
                  example: 0,
                },
                parent: {
                  type: "integer",
                  example: 0,
                },
                label: {
                  type: "string",
                  example: "Comp 20",
                },
                area: {
                  type: "string",
                  example: "Area 20",
                },
                level: {
                  type: "string",
                  example: "Level 1",
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = {
  getAllMDOs,
  getAllMDOsRes1,
  getAllMDOsRes2,
  submitSurveyData,
  submitSurveyDataPayload,
};
