import { Router } from "express";
import { deleteUser, getAllUsers, getUserById, getUserByToken, loginUser, resendOTP, resetPassword, sendPasswordResetEmail, signUpUser, updateUser, verifyUser } from "../controllers/userController";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.get("/user", getUserByToken);

router.post("/auth/signup", signUpUser);
router.post("/auth/verify", verifyUser);
router.post("/auth/verify/resend", resendOTP);
router.post("/auth/login", loginUser);
router.post("/auth/login/forgot", sendPasswordResetEmail);
router.post("/auth/login/reset", resetPassword);

router.put("/user/update", updateUser);

router.delete("/deleteme", deleteUser);

export default router;
