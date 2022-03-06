// Express
const express = require("express");
const app = express();

// Cors
const cors = require("cors");
app.use(cors());

//Swagger
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load("./utils/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));

//Morgan
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
var rfs = require("rotating-file-stream");

//rotating write stream
const accessLogRFStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "logs"),
});
//rotating write stream
const errorLogRFStream = rfs.createStream("error.log", {
  interval: "1d",
  path: path.join(__dirname, "logs"),
});

// setup the logger for dev mode only:
const ENV = process.env.NODE_ENV || "dev";
if (ENV === "dev") {
  // log errors to console.
  app.use(
    morgan("combined", {
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );

  // Log errors to file
  app.use(
    morgan("combined", {
      stream: errorLogRFStream,
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );
  // Log access to file
  app.use(morgan("dev", { stream: accessLogRFStream }));
}

// Error-handling functions
const { handle404s, handlePsqlErrors, handleCustomErrors, handleServerErrors } = require("./utils/errors");

// Routers
const articlesRouter = require("./routers/articles.router");
const commentsRouter = require("./routers/comments.router");
const topicsRouter = require("./routers/topics.router");
const usersRouter = require("./routers/users.router");

//parse req.body
app.use(express.json());

// I'm alive endpoint - replace with a static version of swagger
app.get("/api", (req, res, next) => {
  res.status(200).send({ msg: "all ok" });
});

// Router mount-points
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
