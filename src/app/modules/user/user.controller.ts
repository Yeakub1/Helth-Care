import { Request, Response } from "express";
import { userServices } from "./user.services";

const creatAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.creatAdmin(req);
    res.status(200).json({
      success: true,
      message: "Admin Created Successfuly!",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.name || "something went wrong",
      error: err,
    });
  }
};

export const userController = {
  creatAdmin,
};
