import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ScheduleValidation } from "./schedule.validationss";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.getAllFromDB
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleController.getByIdFromDB
);

// router.patch('/:id', PatientController.updateIntoDB);
router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(ScheduleValidation.create),
  ScheduleController.insertIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleController.deleteFromDB
);

export const ScheduleRoutes = router;
