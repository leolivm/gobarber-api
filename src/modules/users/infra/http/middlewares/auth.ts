import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import AppError from "@shared/errors/AppError";
import authConfig from "@config/auth";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token is missing.", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;
    req.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError("Invalid JWT token.", 401);
  }
}
