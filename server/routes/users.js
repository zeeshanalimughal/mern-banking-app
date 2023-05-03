import express from "express";
import {
  update,
  deleteUser,
  getUser,
} from "../controllers/user.js";
import { verifyToken, verifyUser } from "../verifyToken.js";

const router = express.Router();

//update user
router.put("/:id", verifyUser, update);

//delete user
router.delete("/:id", verifyUser, deleteUser);

//get a user
router.get("/find/:id", verifyUser, getUser);


export default router;
