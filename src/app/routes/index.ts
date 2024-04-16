import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { AdminRouter } from "../modules/admin/admin.route";
import { authRouter } from "../modules/auth/auth.route";
import { specialtiesRouter } from "../modules/specialties/specialties.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { ScheduleRoutes } from "../modules/schedule/schedule.route";

const router = express.Router();

const modiulsRouts = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: AdminRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/specialties",
    route: specialtiesRouter,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/schedule",
    route: ScheduleRoutes,
  },
];

modiulsRouts.forEach((route) => router.use(route.path, route.route));

export default router;
