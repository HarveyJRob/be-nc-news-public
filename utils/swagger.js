exports.swaggerOptions = {
  definition: {
    swagger: "2.0",
    info: {
      title: "be-nc-news",
      version: "1.0.0",
      description: "Northcoders Portfolio Project for Backend Module",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Add name",
        url: "https://127.0.0.1",
        email: "add@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:9090",
      },
    ],
  },
  apis: ["./app.js", "./routers/*.js"],
};
