import express from "express";
import {
    depositAmount, depositAmountWithCheck, depositCheck, transferAmount, withdrawAmount
} from "../controllers/account.js";
import { verifyEmployee, verifyToken, verifyUser } from "../verifyToken.js";

const router = express.Router();

// Deposit amount
router.post("/deposit", verifyEmployee, depositAmount)
router.post("/deposit-with-check", verifyUser, depositAmountWithCheck)
router.post("/deposit-check", verifyEmployee, depositCheck)
router.post("/withdraw", verifyToken, withdrawAmount)
router.post("/transfer", verifyToken, transferAmount)



export default router;
