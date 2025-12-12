import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "@/lib/config/config";

const JWT_SECRET = jwtSecret;

interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}

export function generateToken(userId: string): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & DecodedToken;
    return { userId: decoded.userId };
  } catch (error) {
    console.error(
      "Token verification failed:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
