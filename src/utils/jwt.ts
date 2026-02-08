import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  const accessToken = jwt.sign(payload, secret, { expiresIn } as SignOptions);
  return accessToken;
};
