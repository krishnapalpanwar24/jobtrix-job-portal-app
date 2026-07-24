const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/connectDB");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // allows cookies to be sent/received
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

const userRoute = require("./routes/userRoutes");
const employerRoute = require("./routes/employerRoutes");
const adminRoute = require("./routes/adminRoutes");
const jobRoute = require("./routes/jobRoutes");
const applicationRoute = require("./routes/applicationRoutes");
const contactRoute = require("./routes/contactRoutes");
const resumeAnalyzerRoutes = require("./routes/resumeAnalyzerRoutes");

app.use("/api/user", userRoute);
app.use("/api/employer", employerRoute);
app.use("/api/admin", adminRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);
app.use("/api/contact", contactRoute);
app.use("/api/resume", resumeAnalyzerRoutes);

app.get("/", (req, res) => {
  res.send("Jobtrix API is running");
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`server run on http://localhost:${4000}`);
});
