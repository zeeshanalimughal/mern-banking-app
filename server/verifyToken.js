import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {

  let token = req.headers.authorization || req.cookies.access_token;
  if(token?.startsWith('Bearer')){
    token = token.split(' ')[1]
  }  
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.type === "user") {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyEmployee = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.type === "employee") {
      next();
    } else {
      return next(createError(403, "You can't deposit check! from image"));
    }
  });
};
