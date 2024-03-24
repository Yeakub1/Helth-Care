import express from "express";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get("/", AdminController.getAllFormDB);
router.get("/:id", AdminController.getByIdFormDB);
router.patch("/:id", AdminController.updateIntoDB);
router.delete("/:id", AdminController.deleteFormDB);

export const AdminRouter = router;
