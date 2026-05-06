import { Router } from "express";
import { getDisciplineReports, createDisciplineReport } from "../controllers/disciplineController";
import { authenticate, authorize } from "../middleware/auth";
const router = Router();
router.get("/", authenticate, authorize(["ADMIN", "DISCIPLINE_MASTER"]), getDisciplineReports);
router.post("/", authenticate, authorize(["ADMIN", "DISCIPLINE_MASTER", "TEACHER"]), createDisciplineReport);
export default router;
//# sourceMappingURL=disciplineRoutes.js.map