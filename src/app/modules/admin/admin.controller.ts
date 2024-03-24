import { Request, Response } from "express";
import { AdminServices } from "./admin.services";
import pick from "../../../shared/paick";

const getAllFormDB = async (req: Request, res: Response) => {
  const filter = pick(req.query, ["name", "email", "searchTerm"]);
  const result = await AdminServices.getAllFromDB(
    filter as { searchTrem: string }
  );
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
      error: error,
    });
  }
};

export const AdminController = {
  getAllFormDB,
};
