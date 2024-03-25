import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prism";
import { jswHelpers } from "../../../helpers/jwtHelpers";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Incorect Password!");
  }

  const accessToken = jswHelpers.genarateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefg",
    "5m"
  );

  const refreshToken = jswHelpers.genarateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefgijklmnop",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = (token: string) => {
  console.log("refreah token", token);
};

export const authServices = {
  loginUser,
  refreshToken,
};
