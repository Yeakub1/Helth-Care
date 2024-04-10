import express, { NextFunction, Request, Response } from "express";
import { specialtiesController } from "./specialties.controller";
import { fileUploder } from "../../../helpers/fileUploder";
import { SpecialtiesValidation } from "./specialties.validations";

const router = express.Router();

router.post(
  "/",
  fileUploder.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.create.parse(JSON.parse(req.body.data));
    return specialtiesController.insertInToDB(req, res, next);
  }
);

export const specialtiesRouter = router;
