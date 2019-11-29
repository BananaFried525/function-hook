module.exports = (req, res) => {
  ret = {
    statusCode: 200,
    statusMsg: "work",
    message: process.env
  };
  res.status(200).json(ret);
}