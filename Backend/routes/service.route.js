import express from "express"
import { listServices, listServiceDetails, registerService} from "../controllers/service.control.js";

const router = express.Router();

router.get("/", listServices);
router.get("/:id", listServiceDetails);
router.post("/", registerService)

export default router;