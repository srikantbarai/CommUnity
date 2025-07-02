import express from "express"
import { listServices, listServiceDetails, registerService, editService, deleteService} from "../controllers/service.control.js";

const router = express.Router();

router.get("/", listServices);
router.post("/", registerService);
router.get("/:serviceId", listServiceDetails);
router.patch("/:serviceId",editService);
router.delete("/:serviceId",deleteService);

export default router;