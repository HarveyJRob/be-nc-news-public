exports.getOK = (req, res, next) => {
  res.status(200).send({ msg: "all ok" });
};
