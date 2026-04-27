import express from "express";
import { Auth } from "../../middleware/auth.js";
import { Profile } from "./Profile.js";

const userRouter = express.Router();

userRouter.get("/profile", Auth, Profile);

export default userRouter;
