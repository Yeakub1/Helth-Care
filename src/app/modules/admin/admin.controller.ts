import { NextFunction, Request, Response } from "express";
import { AdminServices } from "./admin.services";
import pick from "../../../shared/paick";
import { adminFiltarableFields } from "./admin.constant";
import SendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllFormDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getByIdFormDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.getByIdFormDB(id);
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Data Fetched By Id!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateIntoDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.updateIntoDB(id, req.body);
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Data Updated!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFormDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.deleteFormDB(id);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Data Delete Successfuly!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteFormDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.softDeleteFormDB(id);
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin Soft Data Delete Successfuly!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getAllFormDB,
  getByIdFormDB,
  updateIntoDB,
  deleteFormDB,
  softDeleteFormDB,
};
