import express from "express";

import {aiProductSearch } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/aichat", aiProductSearch);

export default router;