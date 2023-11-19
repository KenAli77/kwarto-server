import {Router} from "express";
import {loginUser, signUpUser} from "../controllers/auth";

export default (router:Router) => {
    router.post('',signUpUser)
    router.post('',loginUser)
}