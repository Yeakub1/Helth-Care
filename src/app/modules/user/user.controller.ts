import { Request, Response } from "express";
import { userServices } from "./user.services";
import catchAsync from "../../../shared/catchAsync";
import SendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const creatAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.creatAdmin(req);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Created successfuly!",
    data: result,
  });
});

export const userController = {
  creatAdmin,
};
