import * as express from 'express';
import {UserService} from "../../services/user/UserService";
import {AuthService} from "../../services/auth/AuthService";
import {CreateUser} from "../../models/user/User";
import {authentication} from "../../helpers";


export class AuthController {
    private userService: UserService = new UserService()


    async loginUser(req: express.Request, res: express.Response) {
        const userService = new UserService()
        const authService = new AuthService()
        try {
            const {email, password} = req.body

            if (!email || !password) {
                console.log("missing field")
                return res.sendStatus(400)
            }

            // selecting salt and psw since they're not selected by default
            let user = await userService.getUserByEmail(email)

            // user.select('+auth.salt + auth.password')

            if (!user) {
                console.log("user not registered")
                return res.sendStatus(400)
            }

            console.log("salt",user.auth.salt)
            const expectedHash = authentication(user.auth.salt, password)

            if (user.auth.password !== expectedHash) {
                console.log("hash don't match")
                return res.sendStatus(403)
            }

            user = authService.setSessionToken(user)

            console.log("setting token to", user.auth.sessionToken)
            await userService.updateUserById(user._id, user)

            res.cookie("authToken", user.auth.sessionToken, {domain: 'localhost', path: '/'})

            return res.status(200).json({success: true, authToken: user.auth.sessionToken, id: user._id}).end()

        } catch (e) {
            console.log(e)
            return res.sendStatus(400)
        }
    }


    async registerUser(req: express.Request, res: express.Response) {
        const userService = new UserService()
        try {

            const userData = req.body as CreateUser

            if (!userData.lastName || !userData.firstName || !userData.email || !userData.password) {
                return res.sendStatus(400)
            }

            console.log(userData)
            const existingUser = await userService.getUserByEmail(userData.email)

            if (existingUser) {
                /**
                 * TODO custom error class
                 */
                console.log("email already registered")
                return res.sendStatus(400)
            }

            console.log("new user")

            const user = await  userService.createUser(userData)

            return res.status(200).json(user).end()

        } catch (e) {
            console.log(e)
            return res.sendStatus(400)
        }

    }

}


