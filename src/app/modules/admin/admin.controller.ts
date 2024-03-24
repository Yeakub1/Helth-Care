import { Request, Response } from "express";
import { AdminServices } from "./admin.services";
import pick from "../../../shared/paick";
import { adminFiltarableFields } from "./admin.constant";

const getAllFormDB = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, adminFiltarableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await AdminServices.getAllFromDB(filter, options);
    res.status(200).json({
      success: true,
      message: "Admin Data Fetched Successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Data Does't match",
      error: error,
    });
  }
};

const getByIdFormDB = async (req: Request, res: Response) => {
  const {id} = req.params
  try {
    const result = await AdminServices.getByIdFormDB(id);
    res.status(200).json({
      success: true,
      message: "Admin Data Fetched By Id!",

      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error,
    });
  }
};

export const AdminController = {
  getAllFormDB,
  getByIdFormDB,
};
