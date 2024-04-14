import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import SendResponse from "../../../shared/sendResponse";
import { specialtiesService } from "./specialties.services";

const insertInToDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.insertInToDB(req);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties Created successfuly!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesService.getAllFromDB();
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtiesService.deleteFromDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});

export const specialtiesController = {
  insertInToDB,
  getAllFromDB,
  deleteFromDB,
};
