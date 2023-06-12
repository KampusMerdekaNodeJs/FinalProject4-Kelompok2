const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const AppError = require("../utils/app-error");

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.token;
    if (!token) {
      throw new Error("Token not provided");
    }

    const result = jwt.verify(token, process.env.JWT_TOKEN);

    // const resultData = await User.findAll({
    //   where: {
    //     id: "4d761d84-82fd-4bcf-b723-0b4aa8615969",
    //   },
    // });
    // console.log(resultData);
    // if (resultData.length === 0) {
    //   throw { name: "JWT Error", message: "Token invalid" };
    // }

    req.user = { id: result.id, email: result.email };
    next();
  } catch (err) {
    next(new AppError(err.message, 403));
  }
}

module.exports = authMiddleware;
