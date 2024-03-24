import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminServices } from "./admin.services";
import pick from "../../../shared/paick";
import { adminFiltarableFields } from "./admin.constant";
import SendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";


const getAllFormDB: RequestHandler = catchAsync(async (req, res) => {
  const filter = pick(req.query, adminFiltarableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await AdminServices.getAllFromDB(filter, options);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Data Fetched Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFormDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminServices.getByIdFormDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Data Fetched By Id!",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminServices.updateIntoDB(id, req.body);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Data Updated!",
    data: result,
  });
});

const deleteFormDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminServices.deleteFormDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Data Delete Successfuly!",
    data: result,
  });
});

const softDeleteFormDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await AdminServices.softDeleteFormDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Soft Data Delete Successfuly!",
    data: result,
  });
});

export const AdminController = {
  getAllFormDB,
  getByIdFormDB,
  updateIntoDB,
  deleteFormDB,
  softDeleteFormDB,
};
