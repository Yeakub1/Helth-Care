import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";
import { fileUploder } from "./../../../helpers/fileUploder";

const router = express.Router();



router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploder.upload.single("file"),
  userController.creatAdmin
);

export const userRoutes = router;
