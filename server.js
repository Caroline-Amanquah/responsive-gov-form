const Hapi = require("@hapi/hapi");
const Path = require("path");
const fs = require("fs");
const util = require("util");

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



  // Handle form submissions
  server.route({
    method: "POST",
    path: "/submissions",
    handler: async (request, h) => {
      const payload = request.payload;
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
