import { Request, Response } from "express";
import { userServices } from "./user.services";

const creatAdmin = async (req: Request, res: Response) => {
  //   console.log(req.body);
  const result = await userServices.creatAdmin(req.body);
  res.send(result);
};

export const userController = {
  creatAdmin,
};
