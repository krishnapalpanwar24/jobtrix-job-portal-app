// catches multer errors and any other errors passed via next(err)
const errorHandler = (err, req, res, next) => {
  console.log("Unhandled error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
