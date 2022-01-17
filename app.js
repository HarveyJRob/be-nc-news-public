const express = require("express");

const app = express();

const { getOK } = require("./controllers/articles.controller");

// to deal with req.body
app.use(express.json());

app.get("/api", getOK);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    //console.log(err);
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
