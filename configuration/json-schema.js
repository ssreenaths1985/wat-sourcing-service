const jsonSchema = {
  id: "/WatReqData",
  type: "object",
  properties: {
    userName: { type: "string" },
    userDesignation: { type: "string" },
    userWorkEmail: { type: "string" },
    reportingOfficerName: { type: "string" },
    reportingOfficerDesignation: { type: "string" },
    reportingOfficerDepartment: { type: "string" },
    user_password: {type: "string"}
  },
  roles: {
    type: "array",
    items: {
      properties: {
        roleLabel: {
          type: "string",
        },
        roleDescription: {
          type: "string",
        },
        activities: {
          type: "array",
        },
        competencies: {
          type: "array",
        },
      },
    },
  },
  required: [
    "userName",
    "userDesignation",
    "userWorkEmail",
    "reportingOfficerName",
    "reportingOfficerDesignation",
    "reportingOfficerDepartment",
    "roles",
    "userPassword"
  ],
};

module.exports = jsonSchema;
