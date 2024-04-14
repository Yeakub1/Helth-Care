import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { PatientController } from "./patient.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.getAllFromDB
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  PatientController.getByIdFromDB
);

router.patch(
  "/:id",
  auth(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.PATIENT
  ),
  PatientController.updateIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.deleteFromDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  PatientController.softDelete
);

export const PatientRoutes = router;
