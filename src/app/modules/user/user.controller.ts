import { Request, Response } from "express";
import { userServices } from "./user.services";

const creatAdmin = async (req: Request, res: Response) => {
  const result = await userServices.creatAdmin();
  res.send(result);
};

export const userController = {
  creatAdmin,
};
