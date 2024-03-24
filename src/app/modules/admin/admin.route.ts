import express from "express";
import { AdminController } from "./admin.controller";


const router = express.Router();

router.get('/', AdminController.getAllFormDB);
router.get('/:id', AdminController.getByIdFormDB);

export const AdminRouter = router;
