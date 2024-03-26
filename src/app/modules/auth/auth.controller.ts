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
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token genarate successfuly!",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await authServices.changePassword(user, req.body);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "password change successfuly!",
    data: result,
  });
});

export const authController = {
  loginUser,
  refreshTokens,
  changePassword,
};
