import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as StringValue) || "24h";

export interface JwtPayload {
  userId: number;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
