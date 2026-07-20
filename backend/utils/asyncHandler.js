// Wraps async controller functions so we don't need try/catch everywhere
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.log("Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  });
};

module.exports = asyncHandler;
