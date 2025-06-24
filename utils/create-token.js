import jwt from "jsonwebtoken";

export function createToken(user) {
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
}
