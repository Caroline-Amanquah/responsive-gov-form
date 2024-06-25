// const Hapi = require("@hapi/hapi");
// const Path = require("path");
// const fs = require("fs");
// const util = require("util");

// const init = async () => {
//   const server = Hapi.server({
//     port: 3000,
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

//   // Handle form submissions
//   server.route({
//     method: "POST",
//     path: "/submissions",
//     handler: async (request, h) => {
//       const payload = request.payload;
//       console.log("Received form submission:", payload);

//       // Read the existing data from db.json
//       const readFile = util.promisify(fs.readFile);
//       const writeFile = util.promisify(fs.writeFile);
//       let existingData = [];

//       try {
//         const data = await readFile("db.json", "utf8");
//         existingData = JSON.parse(data);
//       } catch (err) {
//         console.error("Error reading db.json:", err);
//       }

//       // Add the new submission to the existing data
//       existingData.push(payload);

//       // Write the updated data back to db.json
//       try {
//         await writeFile("db.json", JSON.stringify(existingData, null, 2));
//         console.log("Data written to db.json");
//       } catch (err) {
//         console.error("Error writing to db.json:", err);
//         return h
//           .response({ status: "error", message: "Failed to write data" })
//           .code(500);
//       }

//       // Respond with a success message
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
//         console.error("Error reading db.json:", err);
//         return h
//           .response({ status: "error", message: "Failed to read data" })
//           .code(500);
//       }

//       // Respond with the existing data
//       return h.response(existingData).code(200);
//     },
//   });

//   await server.start();
//   console.log("Server running on %s", server.info.uri);
// };

// process.on("unhandledRejection", (err) => {
//   console.log("Unhandled Rejection:", err);
//   process.exit(1);
// });

// init();


const Hapi = require("@hapi/hapi");
const Path = require("path");
const fs = require("fs");
const util = require("util");
const Joi = require("joi");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  // Register the Inert plugin for serving static files
  await server.register(require("@hapi/inert"));

  // Serve static files from the "dist" directory
  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "dist"),
        index: ["index.html"], // This will serve "index.html" for the root URL
      },
    },
  });

  // Serve static files from the "public" directory
  server.route({
    method: "GET",
    path: "/public/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "public"),
      },
    },
  });

  // Serve JavaScript, CSS, images, and fonts from "assets" directory
  server.route({
    method: "GET",
    path: "/assets/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "public", "assets"),
      },
    },
  });

  // Validation schema for form submissions
  const submissionSchema = Joi.object({
    fullName: Joi.string().min(2).required(),
    eventName: Joi.string().email().required(),
    nationalInsuranceNumber: Joi.string().pattern(/^[A-CEGHJ-PR-TW-Z]{2}[0-9]{6}[A-D]?$/).required(),
    password: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]).{8,}$/).required(),
    'passport-issued-day': Joi.number().integer().min(1).max(31).required(),
    'passport-issued-month': Joi.number().integer().min(1).max(12).required(),
    'passport-issued-year': Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    whereDoYouLive: Joi.string().valid('england', 'scotland', 'wales', 'northern-ireland').required(),
    waste: Joi.array().items(Joi.string().valid('carcasses', 'mines', 'farm')).min(1).required(),
    telephoneNumber: Joi.string().pattern(/^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/).required(),
    fileUpload1: Joi.any().optional(),
  });

  // Validation test route
  server.route({
    method: "POST",
    path: "/validate",
    handler: (request, h) => {
      const payload = request.payload;

      // Validate payload against schema
      const { error, value } = submissionSchema.validate(payload);
      if (error) {
        return h.response({ status: "error", message: error.details[0].message }).code(400);
      }

      return h.response({ status: "success", data: value }).code(200);
    }
  });

  // Existing route for form submissions
  server.route({
    method: "POST",
    path: "/submissions",
    handler: async (request, h) => {
      const payload = request.payload;

      // Validate payload against schema
      const { error } = submissionSchema.validate(payload);
      if (error) {
        return h.response({ status: "error", message: error.details[0].message }).code(400);
      }

      console.log("Received form submission:", payload);

      // Read the existing data from db.json
      const readFile = util.promisify(fs.readFile);
      const writeFile = util.promisify(fs.writeFile);
      let existingData = [];

      try {
        const data = await readFile("db.json", "utf8");
        existingData = JSON.parse(data);
      } catch (err) {
        console.error("Error reading db.json:", err);
      }

      // Add the new submission to the existing data
      existingData.push(payload);

      // Write the updated data back to db.json
      try {
        await writeFile("db.json", JSON.stringify(existingData, null, 2));
        console.log("Data written to db.json");
      } catch (err) {
        console.error("Error writing to db.json:", err);
        return h
          .response({ status: "error", message: "Failed to write data" })
          .code(500);
      }

      // Respond with a success message
      return h.response({ status: "success", data: payload }).code(200);
    },
  });

  // Handle data retrieval (GET)
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
        console.error("Error reading db.json:", err);
        return h
          .response({ status: "error", message: "Failed to read data" })
          .code(500);
      }

      // Respond with the existing data
      return h.response(existingData).code(200);
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
  process.exit(1);
});

init();
