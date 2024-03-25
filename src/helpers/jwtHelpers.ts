import jwt from "jsonwebtoken";

const genarateToken = (payload: any, secrete: string, expiresIn: string) => {
  const token = jwt.sign(payload, secrete, {
    algorithm: "HS256",
    expiresIn,
  });
  return token;
};


export const jswHelpers = {
  genarateToken
}