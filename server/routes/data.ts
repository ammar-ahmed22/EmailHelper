import { Router } from "express";
import { getTest, getEmailTemplates } from "../controllers/data"

const router : Router = Router();

router.route("/test").get(getTest);
router.route("/emails").get(getEmailTemplates);

export default router;