import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorSchedule.validations";
import { ScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
router.get(
  "/",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  ScheduleController.getAllFromDB
);

router.get(
  "/my-schedules",
  auth(UserRole.DOCTOR),
  ScheduleController.getMySchedules
);

// router.patch('/:id', ScheduleController.updateIntoDB);
router.post(
  "/",
  validateRequest(DoctorScheduleValidation.create),
  auth(UserRole.DOCTOR),
  ScheduleController.insertIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  ScheduleController.deleteFromDB
);

export const DoctorScheduleRoutes = router;
