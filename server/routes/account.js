import express from "express";
import {
    depositAmount, transferAmount, withdrawAmount
} from "../controllers/account.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

// Deposit amount
router.post("/deposit", verifyToken, depositAmount)
router.post("/withdraw", verifyToken, withdrawAmount)
router.post("/transfer", verifyToken, transferAmount)



export default router;
