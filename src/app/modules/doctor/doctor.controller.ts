import httpStatus from "http-status";
import { Request, RequestHandler, Response } from "express";
import pick from "../../../shared/paick";
import SendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { DoctorServices } from "./doctor.services";
import { doctorFilterableFields } from "./doctor.constants";

const getAllFormDB: RequestHandler = catchAsync(async (req, res) => {
  const filter = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorServices.getAllFromDB(filter, options);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Data Fetched Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFormDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServices.getByIdFormDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Data Fetched By Id!",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const { ...doctorData } = payload;
  const result = await DoctorServices.updateIntoDB(id, doctorData);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

const deleteFormDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServices.deleteFormDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Data Delete Successfuly!",
    data: result,
  });
});

const softDeleteFormDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DoctorServices.softDeleteFormDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Soft Data Delete Successfuly!",
    data: result,
  });
});

export const DoctorController = {
  getAllFormDB,
  getByIdFormDB,
  updateIntoDB,
  deleteFormDB,
  softDeleteFormDB,
};
