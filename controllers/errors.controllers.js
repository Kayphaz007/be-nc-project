function handleCustomErrors(err, req, res, next) {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

function handlePostgressErrors(err, req, res, next) {
  if (err.code) {
    res.status(400).send({ msg: "Invalid Input" });
  } else {
    next(err);
  }
}

function handleServerErrors(err, req, res, next) {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
}

module.exports = {
  handlePostgressErrors,
  handleCustomErrors,
  handleServerErrors,
};
