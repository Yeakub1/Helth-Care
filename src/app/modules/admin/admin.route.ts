import express from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchema } from "./admin.validation";

const router = express.Router();

router.get("/", AdminController.getAllFormDB);
router.get("/:id", AdminController.getByIdFormDB);
router.patch("/:id", validateRequest(adminValidationSchema.update), AdminController.updateIntoDB);
router.delete("/:id", AdminController.deleteFormDB);
router.delete("/soft/:id", AdminController.softDeleteFormDB);

export const AdminRouter = router;
