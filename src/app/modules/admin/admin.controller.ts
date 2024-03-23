
import { Request, Response } from "express";
import { AdminServices } from "./admin.services";


const getAllFormDB = async (req: Request, res: Response) => {
const result = await AdminServices.getAllFromDB()

res.status(200).json({
  success: true,
  message: "Admin Data Fetched Successfully!",
  data: result,
});
};

export const AdminController = {
  getAllFormDB
}