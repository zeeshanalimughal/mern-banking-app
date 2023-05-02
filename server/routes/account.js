import express from "express";
import {
    depositAmount, withdrawAmount
} from "../controllers/account.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// Deposit amount
router.post("/deposit", verifyToken, depositAmount)
router.post("/withdraw", verifyToken, withdrawAmount)



export default router;
