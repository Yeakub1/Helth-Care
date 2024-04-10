import { Request, Response } from "express";
import { userServices } from "./user.services";
import catchAsync from "../../../shared/catchAsync";
import SendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/paick";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const creatAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.creatAdmin(req);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Created successfuly!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Created successfuly!",
    data: result,
  });
});

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient Created successfuly!",
    data: result,
  });
});

const getAllFormDB = catchAsync(async (req, res) => {
  const filter = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userServices.getAllFromDB(filter, options);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Data Fetched Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.changeProfileStatus(id, req.body);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userServices.getMyProfile(user as IAuthUser);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Profile data fatched!",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await userServices.updateMyProfile(user as IAuthUser, req);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Profile Updated!",
      data: result,
    });
  }
);

export const userController = {
  creatAdmin,
  createDoctor,
  createPatient,
  getAllFormDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
