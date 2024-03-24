import { Request, Response } from "express";
import { AdminServices } from "./admin.services";


const getAllFormDB = async (req: Request, res: Response) => {

const result = await AdminServices.getAllFromDB(req.query)

try {
  res.status(200).json({
    success: true,
    message: "Admin Data Fetched Successfully!",
    data: result,
  });
} catch (error) {
  res.status(500).json({
    success: false,
    message: error?.name || "Data Does't match",
    error: error
  })
}
};

export const AdminController = {
  getAllFormDB
}