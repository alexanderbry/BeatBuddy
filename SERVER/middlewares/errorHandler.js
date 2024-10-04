const errorHandler = async (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      statusCode = 400;
      message = err.errors.map((el) => el.message);
      break;
    case "EmailRequired":
      statusCode = 400;
      message = "Email is required";
      break;
    case "PasswordRequired":
      statusCode = 400;
      message = "Password is required";
      break;
    case "BadRequest":
      statusCode = 400;
      message = "Bad Request";
      break;
    case "AxiosError":
      statusCode = err.response.status;
      message = err.response.data;
      break;
    case "Invalid email/password":
      statusCode = 401;
      message = "Invalid email/password";
      break;
    case "JsonWebTokenError":
      statusCode = 401;
      message = "Invalid Token";
      break;
    case "Unauthorized":
      statusCode = 401;
      message = "Unauthorized";
      break;
    case "Forbidden":
      statusCode = 403;
      message = "Forbidden";
      break;
    case "NotFound":
      statusCode = 404;
      message = "Not Found";
      break;
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
