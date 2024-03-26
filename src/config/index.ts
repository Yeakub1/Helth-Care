import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expire_in: process.env.EXPIRE_IN,
    refresh_secret: process.env.REFRESH_SECRET,
    refresh_token_expire_in: process.env.REFRESH_TOKEN_EXPIRE_IN,
  },
};
