import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ status: 401, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return response.status(401).json({ status: 401, message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return response.status(403).json({ status: 403, message: "Forbidden" });
    }
    request.user = user as AuthUser;
    next();
  });
};

export default authMiddleware;
