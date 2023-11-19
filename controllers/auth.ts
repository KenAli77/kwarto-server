
// Controller to login user

import {authentication, random} from "../helpers";
import * as express from 'express';

export const loginUser = async (req: express.Request, res: express.Response) => {
    try {
        const {email,password} = req.body

        if(!email || !password){
            console.log("missing field")
            return res.sendStatus(400)
        }

        // selecting salt and psw since they're not selected by default
        const user = await getUserByEmail(email).select('+auth.salt + auth.password')

        if(!user){
            console.log("user not registered")
            return res.sendStatus(400)
        }

        const expectedHash = authentication(user.auth.salt,password)

        if(user.auth.password !== expectedHash){
            return res.sendStatus(403)
        }

        const salt = random()
        user.auth.sessionToken = authentication(salt,user._id.toString())

        console.log("setting token to",user.auth.sessionToken)
        await user.save()

        res.cookie("authToken",user.auth.sessionToken, {domain:'localhost',path:'/'})

        return res.status(200).json({success:true,authToken:user.auth.sessionToken,id:user._id}).end()

    } catch (e) {
        console.log(e)
        return res.sendStatus(400)
    }
}

// Controller to signup user

export const signUpUser = ()=>{}