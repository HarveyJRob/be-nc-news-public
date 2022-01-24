exports.handle404s = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    // invalid input syntax for article_id
    //console.log(err);
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23502") {
    // violates not-null constraint for votes
    // this may now be redundant as I am checking using javascript also
    //console.log(err);
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    // violates foreign key constraint for topics and authors in articles
    res.status(422).send({ msg: "Unprocessable Entity" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    //console.log(err);
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
