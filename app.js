// Express
const express = require("express");
const app = express();

//Swagger
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load("./utils/swagger.yaml");
//const swaggerJsDocs = require("swagger-jsdoc");
//const { swaggerOptions } = require("./utils/swagger");
//const swaggerDocs = swaggerJsDocs(swaggerOptions);
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));

//Morgan
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
var rfs = require("rotating-file-stream");

//rotating write stream
const accessLogRFStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "logs"),
});
//rotating write stream
const errorLogRFStream = rfs.createStream("error.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "logs"),
});

// setup the logger for dev mode only:
const ENV = process.env.NODE_ENV || "dev";
if (ENV === "dev") {
  // log errors to the console.
  app.use(
    morgan("combined", {
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );

  app.use(morgan("dev", { stream: accessLogRFStream }));

  app.use(
    morgan("combined", {
      stream: errorLogRFStream,
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );
}

// Error-handling functions
const {
  handle404s,
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./utils/errors");

// Routers
const articlesRouter = require("./routers/articles.router");
const commentsRouter = require("./routers/comments.router");
const topicsRouter = require("./routers/topics.router");
const usersRouter = require("./routers/users.router");

//parse req.body
app.use(express.json());

app.get("/api", (req, res, next) => {
  res.status(200).send({ msg: "all ok" });
});

// Mount-points
app.use("/api/topics", topicsRouter);
app.use("/api/users", usersRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);

// Handle errors
app.all("/*", handle404s);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

// Export app
module.exports = app;
