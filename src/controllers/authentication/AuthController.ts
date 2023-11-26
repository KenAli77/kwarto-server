import {authentication, random} from "../../helpers";
import * as express from 'express';
import {UserService} from "../../services/user/UserService";
import {CreateUser} from "../../models/user/User";
import {AuthService} from "../../services/auth/AuthService";


export class AuthController {
    private userService = new UserService()
    private authService = new AuthService()

    async loginUser(req: express.Request, res: express.Response) {
        try {
            const {email, password} = req.body

            if (!email || !password) {
                console.log("missing field")
                return res.sendStatus(400)
            }

            // selecting salt and psw since they're not selected by default
            let user = await this.userService.getUserByEmail(email)

            // user.select('+auth.salt + auth.password')

            if (!user) {
                console.log("user not registered")
                return res.sendStatus(400)
            }

            const expectedHash = authentication(user.auth.salt, password)

            if (user.auth.password !== expectedHash) {
                return res.sendStatus(403)
            }

            user = this.authService.setSessionToken(user)

            console.log("setting token to", user.auth.sessionToken)
            await this.userService.updateUserById(user._id,user)

            res.cookie("authToken", user.auth.sessionToken, {domain: 'localhost', path: '/'})

            return res.status(200).json({success: true, authToken: user.auth.sessionToken, id: user._id}).end()

        } catch (e) {
            console.log(e)
            return res.sendStatus(400)
        }
    }


    async registerUser(req: express.Request, res: express.Response) {

        try {

            const userData = req.body as CreateUser

            if (!userData.lastName || !userData.firstName || !userData.email || !userData.password) {
                return res.sendStatus(400)
            }

            const existingUser = await this.userService.getUserByEmail(userData.email)

            if (existingUser) {
                /**
                 * TODO custom error class
                 */
                console.log("email already registered")
                return res.sendStatus(400)
            }

            const user = await this.userService.createUser(userData)

            return res.status(200).json(user).end()

        } catch (e) {
            console.log(e)
            return res.sendStatus(400)
        }

    }

}


