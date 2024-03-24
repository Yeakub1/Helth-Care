import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { AdminRouter } from "../modules/admin/admin.route";

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
];

modiulsRouts.forEach((route) => router.use(route.path, route.route));

export default router;
