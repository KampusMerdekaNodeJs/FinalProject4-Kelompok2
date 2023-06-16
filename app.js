//init
const express = require("express");
const app = express();
const AppError = require("./utils/app-error");
app.disable("x-powered-by");
//all-route
const userRoute = require("./routes/users.route");
const photoRoute = require("./routes/photo.route");
const sosmedRoute = require("./routes/sosmed.route");
const commentRoute = require("./routes/comment.route");

//middleware
const morgan = require("morgan");
const errMiddleware = require("./middlewares/err.middleware");
const authMiddleware = require("./middlewares/auth.middleware");
require("dotenv").config();

//Logger Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//body-parser middleware
app.use(express.json());

/* END OF MIDDLEWARE */
app.use("/users", userRoute);
app.use("/photos", authMiddleware, photoRoute);
app.use("/socialmedias", authMiddleware, sosmedRoute);

//without auth
app.use("/comments", authMiddleware, commentRoute);

//invalid route
app.all("*", (_, __, next) => {
  next(new AppError("Route not found", 404));
});

app.use(errMiddleware);

module.exports = app;
