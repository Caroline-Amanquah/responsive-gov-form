// const Hapi = require("@hapi/hapi");
// const mock = require("mock-fs");
// const init = require("./server"); // Import the init function

// describe("Hapi Server", () => {
//   let server;

//   beforeAll(async () => {
//     server = await init(0); // Use port 0 to let the system assign an available port
//   });

//   afterAll(async () => {
//     await server.stop();
//   });

//   beforeEach(() => {
//     mock({
//       dist: {
//         "index.html": "<html><body><h1>Test HTML</h1></body></html>",
//       },
//       public: {
//         "test.txt": "This is a test file in the public directory.",
//         assets: {
//           "test.txt": "This is a test file in the assets directory.",
//         },
//       },
//       "db.json": "[]", // Mock the db.json file as an empty array
//     });
//   });

//   afterEach(() => {
//     mock.restore();
//   });

//   test("should serve static files from dist directory", async () => {
//     const res = await server.inject({
//       method: "GET",
//       url: "/",
//     });
//     expect(res.statusCode).toBe(200);
//   });

//   test("should serve static files from public directory", async () => {
//     const res = await server.inject({
//       method: "GET",
//       url: "/public/test.txt",
//     });
//     expect(res.statusCode).toBe(200);
//   });

//   test("should serve static files from assets directory", async () => {
//     const res = await server.inject({
//       method: "GET",
//       url: "/assets/test.txt",
//     });
//     expect(res.statusCode).toBe(200);
//   });

//   test("should handle form submissions", async () => {
//     const payload = {
//       fullName: "John Doe",
//       eventName: "john.doe@example.com",
//       nationalInsuranceNumber: "PC123456C",
//       password: "Password123!",
//       "dob-day": 27,
//       "dob-month": 3,
//       "dob-year": 1992,
//       whereDoYouLive: "england",
//       accountPurpose: [
//         "Benefits and Financial Services",
//         "Personal and Family Services",
//       ],
//       telephoneNumber: "07123456789",
//     };

//     const res = await server.inject({
//       method: "POST",
//       url: "/submissions",
//       payload,
//     });

//     expect(res.statusCode).toBe(200);
//     expect(res.result.status).toBe("success");
//     expect(res.result.data).toMatchObject(payload);
//   });

//   test("should handle data retrieval", async () => {
//     const res = await server.inject({
//       method: "GET",
//       url: "/submissions",
//     });

//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.result)).toBe(true);
//   });

//   test("should return empty array if db.json does not exist", async () => {
//     mock.restore();
//     mock({
//       dist: {
//         "index.html": "<html><body><h1>Test HTML</h1></body></html>",
//       },
//       public: {
//         "test.txt": "This is a test file in the public directory.",
//         assets: {
//           "test.txt": "This is a test file in the assets directory.",
//         },
//       },
//     });

//     const res = await server.inject({
//       method: "GET",
//       url: "/submissions",
//     });

//     expect(res.statusCode).toBe(200);
//     expect(res.result).toEqual([]);
//   });

//   test("should handle error during reading db.json", async () => {
//     mock({
//       dist: {
//         "index.html": "<html><body><h1>Test HTML</h1></body></html>",
//       },
//       public: {
//         "test.txt": "This is a test file in the public directory.",
//         assets: {
//           "test.txt": "This is a test file in the assets directory.",
//         },
//       },
//       "db.json": mock.file({
//         content: "[]",
//         mode: 0o000, // No permissions
//       }),
//     });

//     const res = await server.inject({
//       method: "GET",
//       url: "/submissions",
//     });

//     expect(res.statusCode).toBe(500);
//     expect(res.result.status).toBe("error");
//     expect(res.result.message).toBe("Failed to read data");
//   });

//   test("should handle error during writing to db.json", async () => {
//     mock({
//       dist: {
//         "index.html": "<html><body><h1>Test HTML</h1></body></html>",
//       },
//       public: {
//         "test.txt": "This is a test file in the public directory.",
//         assets: {
//           "test.txt": "This is a test file in the assets directory.",
//         },
//       },
//       "db.json": mock.file({
//         content: "[]",
//         mode: 0o444, // Read-only permissions
//       }),
//     });

//     const payload = {
//       fullName: "John Doe",
//       eventName: "john.doe@example.com",
//       nationalInsuranceNumber: "PC123456C",
//       password: "Password123!",
//       "dob-day": 27,
//       "dob-month": 3,
//       "dob-year": 1992,
//       whereDoYouLive: "england",
//       accountPurpose: [
//         "Benefits and Financial Services",
//         "Personal and Family Services",
//       ],
//       telephoneNumber: "07123456789",
//     };

//     const res = await server.inject({
//       method: "POST",
//       url: "/submissions",
//       payload,
//     });

//     expect(res.statusCode).toBe(500);
//     expect(res.result.status).toBe("error");
//     expect(res.result.message).toBe("Failed to write data");
//   });

//   test("should return validation error for invalid submission", async () => {
//     const payload = {
//       fullName: "J",
//       eventName: "invalid-email",
//       nationalInsuranceNumber: "INVALID",
//       password: "123",
//       "dob-day": 32,
//       "dob-month": 13,
//       "dob-year": 1800,
//       whereDoYouLive: "invalid",
//       accountPurpose: [],
//       telephoneNumber: "invalid-phone",
//     };

//     const res = await server.inject({
//       method: "POST",
//       url: "/submissions",
//       payload,
//     });

//     expect(res.statusCode).toBe(400);
//     expect(res.result.status).toBe("error");
//   });
// });

/* eslint-env jest */

const mock = require("mock-fs");
const init = require("./server.js");

describe("Hapi Server", () => {
  let server;

  beforeAll(async () => {
    server = await init(0); // Use port 0 to let the system assign an available port
  });

  afterAll(async () => {
    await server.stop();
  });

  beforeEach(() => {
    mock({
      dist: {
        "index.html": "<html><body><h1>Test HTML</h1></body></html>",
      },
      public: {
        "test.txt": "This is a test file in the public directory.",
        assets: {
          "test.txt": "This is a test file in the assets directory.",
        },
      },
      "db.json": "[]", // Mock the db.json file as an empty array
    });
  });

  afterEach(() => {
    mock.restore();
  });

  test("should serve static files from dist directory", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/",
    });
    expect(res.statusCode).toBe(200);
  });

  test("should serve static files from public directory", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/public/test.txt",
    });
    expect(res.statusCode).toBe(200);
  });

  test("should serve static files from assets directory", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/assets/test.txt",
    });
    expect(res.statusCode).toBe(200);
  });

  test("should handle form submissions", async () => {
    const payload = {
      fullName: "John Doe",
      eventName: "john.doe@example.com",
      nationalInsuranceNumber: "PC123456C",
      password: "Password123!",
      "dob-day": 27,
      "dob-month": 3,
      "dob-year": 1992,
      whereDoYouLive: "england",
      accountPurpose: [
        "Benefits and Financial Services",
        "Personal and Family Services",
      ],
      telephoneNumber: "07123456789",
    };

    const res = await server.inject({
      method: "POST",
      url: "/submissions",
      payload,
    });

    expect(res.statusCode).toBe(200);
    expect(res.result.status).toBe("success");
    expect(res.result.data).toMatchObject(payload);
  });

  test("should handle data retrieval", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/submissions",
    });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.result)).toBe(true);
  });

  test("should return empty array if db.json does not exist", async () => {
    mock({}); // Remove all files

    const res = await server.inject({
      method: "GET",
      url: "/submissions",
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual([]);
  });

  test("should handle error during reading db.json", async () => {
    mock({
      "db.json": mock.file({
        mode: 0o000, // No read permission
      }),
    });

    const res = await server.inject({
      method: "GET",
      url: "/submissions",
    });

    expect(res.statusCode).toBe(500);
    expect(res.result.status).toBe("error");
    expect(res.result.message).toBe("Failed to read data");
  });

  test("should handle error during writing to db.json", async () => {
    mock({
      "db.json": mock.file({
        content: "[]",
        mode: 0o000, // No write permission
      }),
    });

    const payload = {
      fullName: "John Doe",
      eventName: "john.doe@example.com",
      nationalInsuranceNumber: "PC123456C",
      password: "Password123!",
      "dob-day": 27,
      "dob-month": 3,
      "dob-year": 1992,
      whereDoYouLive: "england",
      accountPurpose: [
        "Benefits and Financial Services",
        "Personal and Family Services",
      ],
      telephoneNumber: "07123456789",
    };

    const res = await server.inject({
      method: "POST",
      url: "/submissions",
      payload,
    });

    expect(res.statusCode).toBe(500);
    expect(res.result.status).toBe("error");
    expect(res.result.message).toBe("Failed to write data");
  });
});
