import { Router } from "express";
import { getTeachers, getTeacherById, updateTeacherProfile } from "../controllers/teacherController";
import { authenticate, authorize } from "../middleware/auth";
const router = Router();
router.get("/", authenticate, authorize(["ADMIN", "DISCIPLINE_MASTER"]), getTeachers);
router.get("/:id", authenticate, getTeacherById);
router.put("/:id", authenticate, authorize(["ADMIN", "TEACHER"]), updateTeacherProfile);
export default router;
//# sourceMappingURL=teacherRoutes.js.map