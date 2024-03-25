import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { authServices } from "./auth.services";
import SendResponse from "../../../shared/sendResponse";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req.body);

  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User login successfuly!",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange
    },
  });
});

export const authController = {
  loginUser,
};
