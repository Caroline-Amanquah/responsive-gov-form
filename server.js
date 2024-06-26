// const Hapi = require("@hapi/hapi");
// const Path = require("path");
// const fs = require("fs");
// const util = require("util");
// const Joi = require("joi");

// const init = async (port = process.env.PORT || 3000) => {
//   const server = Hapi.server({
//     port: port,
//     host: "localhost",
//   });

//   // Register the Inert plugin for serving static files
//   await server.register(require("@hapi/inert"));

//   // Serve static files from the "dist" directory
//   server.route({
//     method: "GET",
//     path: "/{param*}",
//     handler: {
//       directory: {
//         path: Path.join(__dirname, "dist"),
//         index: ["index.html"], // This will serve "index.html" for the root URL
//       },
//     },
//   });

//   // Serve static files from the "public" directory
//   server.route({
//     method: "GET",
//     path: "/public/{param*}",
//     handler: {
//       directory: {
//         path: Path.join(__dirname, "public"),
//       },
//     },
//   });

//   // Serve JavaScript, CSS, images, and fonts from "assets" directory
//   server.route({
//     method: "GET",
//     path: "/assets/{param*}",
//     handler: {
//       directory: {
//         path: Path.join(__dirname, "public", "assets"),
//       },
//     },
//   });

//   const submissionSchema = Joi.object({
//     fullName: Joi.string().min(2).required(),
//     eventName: Joi.string().email().required(),
//     nationalInsuranceNumber: Joi.string()
//       .pattern(/^[A-CEGHJ-PR-TW-Z]{2}[0-9]{6}[A-D]?$/)
//       .required(),
//     password: Joi.string()
//       .min(8)
//       .pattern(
//         /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]).{8,}$/,
//       )
//       .required(),
//     "dob-day": Joi.number().integer().min(1).max(31).required(),
//     "dob-month": Joi.number().integer().min(1).max(12).required(),
//     "dob-year": Joi.number()
//       .integer()
//       .min(1900)
//       .max(new Date().getFullYear())
//       .required(),
//     whereDoYouLive: Joi.string()
//       .valid("england", "scotland", "wales", "northern-ireland")
//       .required(),
//     accountPurpose: Joi.array()
//       .items(
//         Joi.string().valid(
//           "Benefits and Financial Services",
//           "Personal and Family Services",
//           "Travel and Legal Services",
//         ),
//       )
//       .min(1)
//       .required(),
//     telephoneNumber: Joi.string()
//       .pattern(/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/)
//       .required(),
//     fileUpload: Joi.any().optional(),
//   });

//   // Handle form submissions
//   server.route({
//     method: "POST",
//     path: "/submissions",
//     options: {
//       validate: {
//         payload: submissionSchema,
//         failAction: (request, h, err) => {
//           return h
//             .response({ status: "error", message: err.details[0].message })
//             .code(400)
//             .takeover();
//         },
//       },
//     },
//     handler: async (request, h) => {
//       const payload = request.payload;
//       console.log("Received form submission:", payload);

//       const readFile = util.promisify(fs.readFile);
//       const writeFile = util.promisify(fs.writeFile);
//       let existingData = [];

//       try {
//         const data = await readFile("db.json", "utf8");
//         existingData = JSON.parse(data);
//       } catch (err) {
//         if (err.code === "ENOENT") {
//           console.log("db.json not found, initializing new file.");
//         } else {
//           console.error("Error reading db.json:", err);
//           return h
//             .response({ status: "error", message: "Failed to read data" })
//             .code(500);
//         }
//       }

//       existingData.push(payload);

//       try {
//         await writeFile("db.json", JSON.stringify(existingData, null, 2));
//         console.log("Data written to db.json");
//       } catch (err) {
//         console.error("Error writing to db.json:", err);
//         return h
//           .response({ status: "error", message: "Failed to write data" })
//           .code(500);
//       }

//       return h.response({ status: "success", data: payload }).code(200);
//     },
//   });

//   // Handle data retrieval (GET)
//   server.route({
//     method: "GET",
//     path: "/submissions",
//     handler: async (request, h) => {
//       const readFile = util.promisify(fs.readFile);
//       let existingData = [];

//       try {
//         const data = await readFile("db.json", "utf8");
//         existingData = JSON.parse(data);
//       } catch (err) {
//         if (err.code === "ENOENT") {
//           console.log("db.json not found, returning empty array.");
//           return h.response([]).code(200);
//         } else {
//           console.error("Error reading db.json:", err);
//           return h
//             .response({ status: "error", message: "Failed to read data" })
//             .code(500);
//         }
//       }

//       return h.response(existingData).code(200);
//     },
//   });

//   await server.start();
//   console.log(`Server running on ${server.info.uri}`);
//   return server; // Return the server instance
// };

// process.on("unhandledRejection", (err) => {
//   console.log("Unhandled Rejection:", err);
//   process.exit(1);
// });

// if (require.main === module) {
//   init().catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });
// }

// module.exports = init;

const Hapi = require("@hapi/hapi");
const Path = require("path");
const fs = require("fs");
const util = require("util");
const Joi = require("joi");

const init = async (port = process.env.PORT || 3000) => {
  const server = Hapi.server({
    port: port,
    host: "localhost",
  });

  await server.register(require("@hapi/inert"));

  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "dist"),
        index: ["index.html"],
      },
    },
  });

  server.route({
    method: "GET",
    path: "/public/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "public"),
      },
    },
  });

  server.route({
    method: "GET",
    path: "/assets/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "public", "assets"),
      },
    },
  });

  const submissionSchema = Joi.object({
    fullName: Joi.string().min(2).required(),
    eventName: Joi.string().email().required(),
    nationalInsuranceNumber: Joi.string()
      .pattern(/^[A-CEGHJ-PR-TW-Z]{2}[0-9]{6}[A-D]?$/)
      .required(),
    password: Joi.string()
      .min(8)
      .pattern(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\]{};':"\\|,.<>/?`~]).{8,}$/,
      )
      .required(),
    "dob-day": Joi.number().integer().min(1).max(31).required(),
    "dob-month": Joi.number().integer().min(1).max(12).required(),
    "dob-year": Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .required(),
    whereDoYouLive: Joi.string()
      .valid("england", "scotland", "wales", "northern-ireland")
      .required(),
    accountPurpose: Joi.array()
      .items(
        Joi.string().valid(
          "Benefits and Financial Services",
          "Personal and Family Services",
          "Travel and Legal Services",
        ),
      )
      .min(1)
      .required(),
    telephoneNumber: Joi.string()
      .pattern(/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/)
      .required(),
    fileUpload: Joi.any().optional(),
  });

  server.route({
    method: "POST",
    path: "/submissions",
    handler: async (request, h) => {
      const { error, value } = submissionSchema.validate(request.payload);
      if (error) {
        return h
          .response({ status: "error", message: error.details[0].message })
          .code(400);
      }
      const payload = value;
      console.log("Received form submission:", payload);

      const readFile = util.promisify(fs.readFile);
      const writeFile = util.promisify(fs.writeFile);
      let existingData = [];

      try {
        const data = await readFile("db.json", "utf8");
        existingData = JSON.parse(data);
      } catch (err) {
        if (err.code === "ENOENT") {
          console.log("db.json not found, initializing new file.");
        } else {
          console.error("Error reading db.json:", err);
        }
      }

      existingData.push(payload);

      try {
        await writeFile("db.json", JSON.stringify(existingData, null, 2));
        console.log("Data written to db.json");
      } catch (err) {
        console.error("Error writing to db.json:", err);
        return h
          .response({ status: "error", message: "Failed to write data" })
          .code(500);
      }

      return h.response({ status: "success", data: payload }).code(200);
    },
  });

  server.route({
    method: "GET",
    path: "/submissions",
    handler: async (request, h) => {
      const readFile = util.promisify(fs.readFile);
      let existingData = [];

      try {
        const data = await readFile("db.json", "utf8");
        existingData = JSON.parse(data);
      } catch (err) {
        if (err.code === "ENOENT") {
          console.log("db.json not found, returning empty array.");
          return h.response([]).code(200);
        } else {
          console.error("Error reading db.json:", err);
          return h
            .response({ status: "error", message: "Failed to read data" })
            .code(500);
        }
      }

      return h.response(existingData).code(200);
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
  process.exit(1);
});

if (require.main === module) {
  init().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = init;
