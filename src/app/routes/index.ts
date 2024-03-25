import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { AdminRouter } from "../modules/admin/admin.route";
import { authRouter } from "../modules/auth/auth.route";

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
];

modiulsRouts.forEach((route) => router.use(route.path, route.route));

export default router;
