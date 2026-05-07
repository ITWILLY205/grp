import { Router } from "express";
import { getStudents, getStudentByUserId, createStudent } from "../controllers/studentController.js";
import { authenticate, authorize } from "../middleware/auth.js";
const router = Router();
router.get("/getUsers", getStudents);
router.get("/:userId", authenticate, getStudentByUserId);
router.post("/", authenticate, authorize(["ADMIN"]), createStudent);
export default router;
//# sourceMappingURL=studentRoutes.js.map